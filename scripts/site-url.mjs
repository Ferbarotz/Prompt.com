/**
 * Resolución de la URL pública del sitio.
 *
 * La web se publica en GitHub Pages, así que la URL canónica depende de quién
 * publique el repo. Se resuelve en este orden:
 *
 *   1. `SITE_URL` (variables de entorno, para dominios propios).
 *   2. `GITHUB_REPOSITORY` (definido por GitHub Actions en CI).
 *   3. El remoto `origin` de git (funciona en local y en un runner con checkout).
 *   4. Un origen de desarrollo por defecto.
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

/** Nombre del repositorio, usado para el `base` de Vite. */
export const getRepoName = () => getRepoInfo()?.name ?? 'Prompt.com'

/** Origen del sitio sin barra final, p. ej. `https://prompt.com`. */
export const getSiteOrigin = () => {
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
