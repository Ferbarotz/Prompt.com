import { useEffect } from 'react'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  getOgImagePath,
  getRouteByPath
} from '../data/routeMeta'
import { absoluteUrl, assetUrl } from '../utils/siteUrl'

/** Crea o actualiza una etiqueta `<meta>`. */
const upsertMeta = (attribute: string, key: string, content?: string): void => {
  if (!content) return
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

/** Crea o actualiza un `<link rel>`. */
const upsertLink = (rel: string, href?: string | null): void => {
  if (!href) return
  let element = document.head.querySelector(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

/** Objeto de datos estructurados de schema.org. */
export type JsonLd = object

/** Opciones del hook de SEO. */
export interface SeoOptions {
  /** Título de la página (sin el sufijo). */
  title?: string
  /** Descripción para buscadores y redes. */
  description?: string
  /** Ruta interna, p. ej. `/generar-prompt`. */
  path?: string
  /** Imagen Open Graph (URL absoluta). */
  image?: string
  /** Tipo de Open Graph (`website`, `article`…). */
  type?: string
  /** Datos estructurados (schema.org). */
  jsonLd?: JsonLd
  /** Impide la indexación de la página. */
  noindex?: boolean
}

/**
 * Mantiene sincronizadas las etiquetas SEO de la ruta activa: título,
 * descripción, canonical, Open Graph, Twitter Card y datos estructurados.
 */
const useSeo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image,
  type = 'website',
  jsonLd,
  noindex = false
}: SeoOptions = {}): void => {
  useEffect(() => {
    const url = absoluteUrl(path)
    // Cada ruta puede tener su propia imagen Open Graph: la que genera el
    // post-build en `dist/og/`. Sin ella, todos los enlaces se verían igual.
    const ogImage = getOgImagePath(getRouteByPath(path))
    const imageUrl = image ?? (ogImage ? assetUrl(ogImage) : assetUrl('og-image.png'))
    const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE

    // Una ruta marcada como `noindex` en el catálogo (por ejemplo, una página
    // de etiqueta con un solo artículo) no se indexa, aunque el visitante
    // llegue a ella.
    const isNoindex = noindex || Boolean(getRouteByPath(path)?.noindex)

    document.title = fullTitle

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', isNoindex ? 'noindex, nofollow' : 'index, follow')
    // Una página noindex (la 404) no debe apuntar a ninguna canonical.
    upsertLink('canonical', isNoindex ? null : url)

    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', imageUrl)
    upsertMeta('property', 'og:image:width', '1200')
    upsertMeta('property', 'og:image:height', '630')
    upsertMeta('property', 'og:locale', 'es_ES')

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', imageUrl)
  }, [title, description, path, image, type, noindex])

  // Los datos estructurados son específicos de la ruta: se insertan al entrar
  // y se retiran al salir para no dejar datos de otra página en el DOM.
  useEffect(() => {
    if (!jsonLd) return undefined

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.seo = 'page'
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [jsonLd])
}

export default useSeo
