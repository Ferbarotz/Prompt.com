/**
 * URLs absolutas del sitio.
 *
 * Vive fuera de `useSeo` porque lo usan también los módulos de datos (los
 * datos estructurados de schema.org): un fichero de datos no debería
 * depender de un hook de React.
 *
 * `import.meta.env.BASE_URL` refleja el `base` de vite.config.js ('/Prompt.com/'),
 * por lo que las URLs funcionan igual en dev, en el build y en GitHub Pages.
 */

/** Base pública del sitio, sin barra final. */
const BASE_URL = import.meta.env.BASE_URL.replace(/\/+$/, '')

/** Origen del sitio, p. ej. `https://prompt.com`. */
export const origin = (): string => (typeof window === 'undefined' ? '' : window.location.origin)

/**
 * URL absoluta de una ruta interna de la SPA, siempre con barra final.
 *
 * GitHub Pages sirve cada ruta desde su propia carpeta (`dist/ruta/index.html`)
 * para responder con un 200; sin la barra final responde 404.
 */
export const absoluteUrl = (path = '/'): string => {
  const clean = path.replace(/^\/+/, '').replace(/\/+$/, '')
  const base = `${BASE_URL}/`
  return clean ? `${origin()}${base}${clean}/` : `${origin()}${base}`
}

/** URL absoluta de un fichero estático (imágenes, manifest…). */
export const assetUrl = (path: string): string =>
  `${origin()}${BASE_URL}/${path.replace(/^\/+/, '')}`
