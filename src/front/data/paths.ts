/**
 * Rutas públicas del sitio.
 *
 * Se usan con barra final porque es la forma que GitHub Pages sirve con un
 * 200: cada ruta tiene su carpeta en `dist/` con su `index.html`. Sin ella,
 * Pages responde 404 y las URL del sitemap acaban descartadas.
 *
 * El router registra las rutas sin barra final porque acepta las dos formas.
 *
 * Las rutas salen de `routes.json` (ver `routeMeta.ts`): ese catálogo es la
 * fuente única que comparten la aplicación y el post-build.
 */

import { ROUTES } from './routeMeta'

export const PATHS = {
  home: ROUTES.find((route) => route.key === 'home')?.path ?? '/',
  generator: ROUTES.find((route) => route.key === 'generator')?.path ?? '/generar-prompt/',
  linter: ROUTES.find((route) => route.key === 'linter')?.path ?? '/analizar-prompt/',
  avisoLegal: ROUTES.find((route) => route.key === 'avisoLegal')?.path ?? '/aviso-legal/',
  privacidad: ROUTES.find((route) => route.key === 'privacidad')?.path ?? '/privacidad/',
  cookies: ROUTES.find((route) => route.key === 'cookies')?.path ?? '/cookies/',
  guia: ROUTES.find((route) => route.key === 'guia')?.path ?? '/guia/',
  blog: ROUTES.find((route) => route.key === 'blog')?.path ?? '/blog/'
}

/** Rutas que aparecen en el sitemap. */
export const PUBLIC_PATHS: string[] = ROUTES.map((route) => route.path)
