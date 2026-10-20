import { absoluteUrl, assetUrl } from '../utils/siteUrl'
import { GUIDE_SECTIONS } from './guideSections'
import { GUIDE_PREFIX } from './guidePages'
import { PATHS } from './paths'
import { SITE_NAME } from './routeMeta'

const siteUrl = absoluteUrl('/')

const DESCRIPTION =
  'Guía práctica sobre prompts: qué son, para qué sirven y cómo escribir los mejores. Incluye un generador de prompts profesionales por tipo de tarea.'

/** Pregunta de un `FAQPage` de schema.org. */
export interface FaqQuestion {
  '@type': 'Question'
  name: string
  acceptedAnswer: {
    '@type': 'Answer'
    text: string
  }
}

/** Nodo `FAQPage` de schema.org. */
export interface FaqPageNode {
  '@type': 'FAQPage'
  '@id': string
  isPartOf: { '@id': string }
  mainEntity: FaqQuestion[]
}

/** Nodo `Article` de schema.org (la guía de la home). */
export interface ArticleNode {
  '@type': 'Article'
  '@id': string
  headline: string
  description: string
  url: string
  inLanguage: string
  datePublished: string
  dateModified: string
  image: string
  author: { '@type': 'Organization'; name: string; url: string }
  publisher: { '@type': 'Organization'; '@id': string; name: string; url: string }
  mainEntity: {
    '@type': 'ItemList'
    itemListElement: Array<{ '@type': 'ListItem'; position: number; name: string; url: string }>
  }
}

/** Nodo `WebSite` de schema.org. */
export interface WebSiteNode {
  '@type': 'WebSite'
  '@id': string
  url: string
  name: string
  description: string
  inLanguage: string
  publisher: {
    '@type': 'Organization'
    '@id': string
    name: string
    url: string
  }
}

/** Grafo de datos estructurados de la home. */
export interface HomeJsonLd {
  '@context': 'https://schema.org'
  '@graph': Array<WebSiteNode | ArticleNode>
}

/**
 * Datos estructurados de la home.
 *
 * La guía de la home es un artículo (qué es un prompt, para qué sirve y cómo
 * se escribe bien). Se declara como `Article` con la lista de sus secciones:
 * el tipo `FAQPage` ya no da resultado enriquecido en Google desde 2023, así
 * que no tiene sentido mantenerlo.
 */
export const HOME_JSON_LD: HomeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
      url: siteUrl,
      name: 'Prompt.com',
      description: DESCRIPTION,
      inLanguage: 'es-ES',
      publisher: {
        '@type': 'Organization',
        '@id': `${siteUrl}#publisher`,
        name: 'Prompt.com',
        url: siteUrl
      }
    },
    {
      '@type': 'Article',
      '@id': `${siteUrl}#article`,
      headline: 'Guía de prompts: qué son y cómo escribirlos',
      description: DESCRIPTION,
      url: siteUrl,
      inLanguage: 'es-ES',
      datePublished: '2026-10-20',
      dateModified: '2026-10-20',
      image: assetUrl('og-image.png'),
      author: {
        '@type': 'Organization',
        name: 'Prompt.com',
        url: siteUrl
      },
      publisher: {
        '@type': 'Organization',
        '@id': `${siteUrl}#publisher`,
        name: 'Prompt.com',
        url: siteUrl
      },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: GUIDE_SECTIONS.map((section, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: section.title,
          url: absoluteUrl(`${GUIDE_PREFIX}${section.id}/`)
        }))
      }
    }
  ]
}

/** Datos estructurados de la página del generador. */
export const GENERATOR_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': `${absoluteUrl(PATHS.generator)}#app`,
  name: 'Generador de prompts de Prompt.com',
  url: absoluteUrl(PATHS.generator),
  description:
    'Generador de prompts profesionales en 3 pasos: elige el tipo de tarea, completa los detalles y copia el prompt listo para usar.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requiere un navegador con JavaScript habilitado',
  inLanguage: 'es-ES',
  isAccessibleForFree: true,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR'
  },
  featureList: [
    '10 tipos de tarea: web, contenido, código, análisis, imagen, vídeo, email, SEO, resumen y traducción',
    'Prompts específicos por tipo de tarea, no una plantilla genérica',
    'Campos de detalle contextuales según la tarea elegida',
    'Copia al portapapeles en un clic'
  ]
}

/**
 * Migas de pan en schema.org.
 *
 * Las páginas de contenido (guía y artículos) están a dos niveles: la home y
 * la sección. Declararlo ayuda a los buscadores a entender la estructura del
 * sitio y a mostrar el camino en el resultado.
 */
export const buildBreadcrumbJsonLd = (items: Array<{ name: string; path: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path)
  }))
})

/** Datos estructurados de un artículo de contenido. */
export const buildArticleJsonLd = ({
  title,
  description,
  path,
  datePublished,
  dateModified,
  section,
  image,
  wordCount
}: {
  title: string
  description: string
  path: string
  datePublished: string
  dateModified?: string
  section: string
  /** URL absoluta de la imagen del artículo (la tarjeta Open Graph). */
  image?: string
  wordCount?: number
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description,
  url: absoluteUrl(path),
  mainEntityOfPage: absoluteUrl(path),
  inLanguage: 'es-ES',
  articleSection: section,
  datePublished,
  dateModified: dateModified ?? datePublished,
  // La imagen es requisito para que Google conceda el resultado enriquecido
  // de artículo: sin ella, el `Article` no se muestra con miniatura.
  ...(image ? { image } : {}),
  ...(wordCount ? { wordCount } : {}),
  author: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: absoluteUrl('/')
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: absoluteUrl('/')
  }
})

/** Agrupa varios nodos de datos estructurados en un solo grafo. */
export const buildJsonLdGraph = (nodes: object[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes
})

/** Datos estructurados de la página del analizador. */
export const LINTER_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': `${absoluteUrl(PATHS.linter)}#app`,
  name: 'Analizador de prompts de Prompt.com',
  url: absoluteUrl(PATHS.linter),
  description:
    'Pega tu prompt y obtén una puntuación con el desglose de lo que le falta: rol, objetivo, contexto, datos, restricciones, formato, ejemplos y validación.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requiere un navegador con JavaScript habilitado',
  inLanguage: 'es-ES',
  isAccessibleForFree: true,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR'
  }
}
