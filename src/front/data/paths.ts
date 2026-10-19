/**
 * Rutas públicas del sitio.
 *
 * Se usan con barra final porque es la forma que GitHub Pages sirve con un
 * 200: cada ruta tiene su carpeta en `dist/` con su `index.html`. Sin ella,
 * Pages responde 404 y las URL del sitemap acaban descartadas.
 *
 * El router registra las rutas sin barra final porque acepta las dos formas.
 */

export const PATHS = {
  home: '/',
  generator: '/generar-prompt/',
  linter: '/analizar-prompt/',
  avisoLegal: '/aviso-legal/',
  privacidad: '/privacidad/',
  cookies: '/cookies/'
} as const

/** Rutas que aparecen en el sitemap. */
export const PUBLIC_PATHS: string[] = [
  PATHS.home,
  PATHS.generator,
  PATHS.linter,
  PATHS.avisoLegal,
  PATHS.privacidad,
  PATHS.cookies
]
