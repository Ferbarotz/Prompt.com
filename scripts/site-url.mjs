/**
 * Resolución de la URL pública del sitio.
 *
 * La URL canónica depende de dónde se publique el repo:
 *
 *   1. `CUSTOM_DOMAIN` (dominio propio: "prompt.com"). El sitio se publica
 *      en la raíz de ese dominio, así que el `base` de Vite pasa a ser "/"
 *      y se añade un fichero `CNAME` al artefacto.
 *   2. Cloudflare Pages (`CF_PAGES`). Se detecta solo: publica en la raíz
 *      y el origen es `CF_PAGES_URL` (p. ej. "https://prompt.pages.dev").
 *   3. Vercel (`VERCEL`). También se detecta solo: publica en la raíz y el
 *      origen es `VERCEL_PROJECT_PRODUCTION_URL`.
 *   4. `SITE_URL` (para canonical/OG sin cambiar el base).
 *   5. `GITHUB_REPOSITORY` (definido por GitHub Actions en CI).
 *   6. El remoto `origin` de git (funciona en local y en un runner con checkout).
 *   7. Un origen de desarrollo por defecto.
 *
 * Lo usan tanto el plugin de Vite (para inyectar las etiquetas de Open Graph
 * estáticas) como el script que genera el sitemap tras el build.
 */

import { execSync } from 'node:child_process'

/** Devuelve `{ owner, name }` del repositorio de GitHub, o `null`. */
export const getRepoInfo = () => {
  const fromEnv = process.env.GITHUB_REPOSITORY
  if (fromEnv && fromEnv.includes('/')) {
    const [owner, name] = fromEnv.split('/')
    return { owner, name }
  }

  try {
    const remote = execSync('git config --get remote.origin.url', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
    const match = remote.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/)
    if (match) return { owner: match[1], name: match[2] }
  } catch {
    // Sin git o sin remoto: se usa el origen por defecto.
  }

  return null
}

/** Nombre del repositorio, usado como base de la URL en GitHub Pages. */
export const getRepoName = () => getRepoInfo()?.name ?? 'Prompt.com'

/**
 * Dominio propio configurado, sin protocolo ni barra final.
 * Vacío si el sitio se publica en la URL `*.github.io`.
 */
export const getCustomDomain = () => {
  const raw = process.env.CUSTOM_DOMAIN?.trim()
  if (!raw) return ''
  return raw.replace(/^https?:\/\//, '').replace(/\/+$/, '')
}

/**
 * Base de las rutas del sitio.
 *
 * Con dominio propio o en un hosting que sirve en la raíz (Cloudflare Pages,
 * Vercel) el sitio vive en "/", así que no hay prefijo. En un repositorio de
 * proyecto de GitHub Pages, en cambio, se sirve bajo "/<nombre-del-repo>/".
 */
export const getBase = () => (getDeployment() === 'github-pages' ? `/${getRepoName()}/` : '/')

/**
 * Dónde se publica el sitio.
 *
 * - `custom`: dominio propio (CUSTOM_DOMAIN).
 * - `cloudflare`: Cloudflare Pages (CF_PAGES).
 * - `vercel`: Vercel (VERCEL).
 * - `github-pages`: repositorio de proyecto de GitHub Pages (por defecto).
 */
export const getDeployment = () => {
  if (getCustomDomain()) return 'custom'
  if (process.env.CF_PAGES) return 'cloudflare'
  if (process.env.VERCEL) return 'vercel'
  return 'github-pages'
}

/** Origen del sitio sin barra final, p. ej. `https://prompt.com`. */
export const getSiteOrigin = () => {
  const custom = getCustomDomain()
  if (custom) return `https://${custom}`

  // Cloudflare Pages publica en la raíz y expone la URL pública.
  if (process.env.CF_PAGES && process.env.CF_PAGES_URL) {
    return process.env.CF_PAGES_URL.replace(/\/+$/, '')
  }

  // Vercel: `VERCEL_PROJECT_PRODUCTION_URL` es el dominio de producción y
  // `VERCEL_URL` el de este despliegue concreto.
  if (process.env.VERCEL) {
    const url = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
    if (url) return `https://${url.replace(/^https?:\/\//, '').replace(/\/+$/, '')}`
  }

  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '')

  const info = getRepoInfo()
  if (info) return `https://${info.owner.toLowerCase()}.github.io/${info.name}`

  return 'https://localhost'
}

/** URL absoluta de una ruta interna, p. ej. `/generar-prompt`. */
export const absoluteUrl = (path = '/') => {
  const origin = getSiteOrigin()
  const clean = path === '/' ? '' : `/${path.replace(/^\/+|\/+$/g, '')}`
  return `${origin}${clean}`
}
