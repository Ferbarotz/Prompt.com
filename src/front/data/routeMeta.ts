/**
 * Rutas públicas y metadatos SEO.
 *
 * `routes.json` es la fuente única de verdad: la usan la aplicación (para las
 * canonical y las etiquetas de cada página) y el post-build (para inyectar las
 * mismas etiquetas en el HTML de cada ruta y generar el sitemap).
 *
 * Está en JSON, y no en TypeScript, porque el script de post-build es Node y
 * no puede importar módulos `.ts`; así las dos partes comparten los mismos
 * datos sin duplicarlos ni depender del orden en que se actualicen.
 */

import routesData from './routes.json'

/** Nombre del sitio, usado en los títulos y en las etiquetas Open Graph. */
export const SITE_NAME = 'Prompt.com'

/** Título por defecto cuando una ruta no tiene metadatos propios. */
export const DEFAULT_TITLE = `${SITE_NAME} — Guía y generador de prompts`

/** Descripción por defecto cuando una ruta no tiene metadatos propios. */
export const DEFAULT_DESCRIPTION =
  'Aprende qué es un prompt, para qué sirve y cómo escribir los mejores. Generador de prompts profesionales para código, contenido, imágenes, SEO y más.'

/** Ruta pública con sus metadatos de SEO y de sitemap. */
export interface RouteMeta {
  /** Identificador de la ruta (`home`, `generator`…). */
  key: string
  /** URL interna, siempre con barra final. */
  path: string
  /** Título de la página, sin el sufijo del sitio. */
  title: string
  /** Descripción para buscadores y redes. */
  description: string
  /** Frecuencia de cambio para el sitemap. */
  changefreq: string
  /** Prioridad para el sitemap. */
  priority: string
}

/** Todas las rutas públicas, en el orden en que se publican. */
export const ROUTES: RouteMeta[] = routesData.routes

/** Alias de URL: ruta antigua o escrita a mano que redirige a una canónica. */
export interface RouteAlias {
  /** URL del alias, con barra final. */
  path: string
  /** Clave de la ruta canónica a la que apunta. */
  target: string
}

/** Todos los alias de URL. */
export const ALIASES: RouteAlias[] = routesData.aliases

/** Rutas indexadas por su identificador. */
export const ROUTE_BY_KEY: Record<string, RouteMeta> = Object.fromEntries(
  ROUTES.map((route) => [route.key, route])
)

/** Rutas indexadas por su URL. */
export const ROUTE_BY_PATH: Record<string, RouteMeta> = Object.fromEntries(
  ROUTES.map((route) => [route.path, route])
)

/** Normaliza una ruta: sin barra inicial duplicada y con barra final. */
export const normalizePath = (path: string): string => {
  const clean = path.replace(/^\/+/, '')
  return clean ? `/${clean.replace(/\/+$/, '')}/` : '/'
}

/** Devuelve la ruta pública que corresponde a una URL interna. */
export const getRouteByPath = (path: string): RouteMeta | undefined =>
  ROUTE_BY_PATH[normalizePath(path)]

/** Metadatos SEO que necesita `useSeo`. */
export interface RouteSeo {
  title: string
  description: string
  path: string
}

/**
 * Metadatos SEO de una ruta.
 *
 * Si la ruta no está en el catálogo (por ejemplo, una URL unknown) devuelve
 * los de la home: es preferible una etiqueta razonable a ninguna.
 */
export const getRouteSeo = (path: string): RouteSeo => {
  const route = getRouteByPath(path)
  return {
    title: route?.title ?? ROUTE_BY_KEY.home.title,
    description: route?.description ?? ROUTE_BY_KEY.home.description,
    path: route?.path ?? '/'
  }
}
