import { useEffect } from 'react'

const SITE_NAME = 'Prompt.com'
const DEFAULT_TITLE = 'Prompt.com — Guía y generador de prompts'
const DEFAULT_DESCRIPTION =
  'Aprende qué es un prompt, para qué sirve y cómo escribir los mejores. Generador de prompts profesionales para código, contenido, imágenes, SEO y más.'
const BASE_URL = import.meta.env.BASE_URL.replace(/\/+$/, '')

/** URL absoluta de una ruta interna de la SPA. */
export const absoluteUrl = (path = '/'): string => {
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  const base = `${BASE_URL}/`
  const clean = path === '/' ? '' : path.replace(/^\/+/, '')
  return `${origin}${base}${clean}`
}

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
    const imageUrl = image ?? absoluteUrl('/og-image.png')
    const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE

    document.title = fullTitle

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    // Una página noindex (la 404) no debe apuntar a ninguna canonical.
    upsertLink('canonical', noindex ? null : url)

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
