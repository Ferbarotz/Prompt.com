import { absoluteUrl } from '../utils/siteUrl'
import { GUIDE_SECTIONS } from './guideSections'
import { PATHS } from './paths'

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
  '@graph': Array<WebSiteNode | FaqPageNode>
}

/**
 * Datos estructurados de la home.
 *
 * El contenido de la guía es un formato de pregunta y respuesta que encaja
 * exactamente con el tipo `FAQPage` de schema.org. Google puede mostrarlo como
 * resultado enriquecido (pregunta desplegable) sin necesidad de otro markup.
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
      '@type': 'FAQPage',
      '@id': `${siteUrl}#faq`,
      isPartOf: { '@id': `${siteUrl}#website` },
      mainEntity: GUIDE_SECTIONS.map((section) => ({
        '@type': 'Question',
        name: section.title,
        acceptedAnswer: {
          '@type': 'Answer',
          text: [section.summary, ...section.details, section.example].join(' ')
        }
      }))
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
