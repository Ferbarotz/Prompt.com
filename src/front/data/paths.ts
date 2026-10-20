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

import { ROUTE_BY_KEY } from './routeMeta'

export const PATHS = {
  home: ROUTE_BY_KEY.home.path,
  generator: ROUTE_BY_KEY.generator.path,
  linter: ROUTE_BY_KEY.linter.path,
  avisoLegal: ROUTE_BY_KEY.avisoLegal.path,
  privacidad: ROUTE_BY_KEY.privacidad.path,
  cookies: ROUTE_BY_KEY.cookies.path
}

/** Rutas que aparecen en el sitemap. */
export const PUBLIC_PATHS: string[] = Object.values(PATHS)
