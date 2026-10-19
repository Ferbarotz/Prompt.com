/**
 * Resolución de la URL pública del sitio.
 *
 * La web se publica en GitHub Pages, así que la URL canónica depende de quién
 * publique el repo. Se resuelve en este orden:
 *
 *   1. `CUSTOM_DOMAIN` (dominio propio: "prompt.com"). El sitio se publica
 *      en la raíz de ese dominio, así que el `base` de Vite pasa a ser "/"
 *      y se añade un fichero `CNAME` al artefacto.
 *   2. `SITE_URL` (variables de entorno, para canonical/OG sin cambiar el base).
 *   3. `GITHUB_REPOSITORY` (definido por GitHub Actions en CI).
 *   4. El remoto `origin` de git (funciona en local y en un runner con checkout).
 *   5. Un origen de desarrollo por defecto.
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
 * Con dominio propio el sitio vive en la raíz ("/"), así que no hay prefijo.
 * En un repositorio de proyecto de GitHub Pages, en cambio, se sirve bajo
 * "/<nombre-del-repo>/".
 */
export const getBase = () => (getCustomDomain() ? '/' : `/${getRepoName()}/`)

/** Origen del sitio sin barra final, p. ej. `https://prompt.com`. */
export const getSiteOrigin = () => {
  const custom = getCustomDomain()
  if (custom) return `https://${custom}`

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
