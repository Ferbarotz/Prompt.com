/**
 * Páginas de la guía.
 *
 * Cada bloque de un buen prompt tiene su propia URL: es lo que la gente
 * busca y es lo que da cobertura a búsquedas que la home (una sola URL) no
 * puede cubrir.
 *
 * Hay dos tipos de página:
 * - Las tres secciones de la guía de la home (qué es un prompt, para qué
 *   sirve y las claves para escribirlo bien).
 * - Las ocho páginas de los criterios de la rúbrica, que son los bloques
 *   concretos del prompt (rol, objetivo, contexto, datos, restricciones,
 *   formato, ejemplos y validación).
 */

import { GUIDE_SECTIONS } from './guideSections'
import { CRITERIA_GUIDE } from './criteriaGuide'

/** Apartado de una página de contenido. */
export interface ContentSection {
  heading: string
  paragraphs: string[]
}

/** Imagen responsiva de una página de la guía. */
export interface ContentImage {
  src: string
  srcSet: string
  width: number
  height: number
  alt: string
}

/** Página de la guía. */
export interface GuidePage {
  /** Slug de la URL (sin `/guia/`). */
  slug: string
  /** URL interna de la página. */
  path: string
  /** Título visible. */
  title: string
  /** Descripción para buscadores y redes. */
  description: string
  /** Entradada de la página. */
  summary: string
  /** Color de acento. */
  accent: string
  /** Apartados del contenido. */
  sections: ContentSection[]
  /** Bloque listo para copiar. */
  template?: string
  /** Ejemplo de uso. */
  example?: string
  /** Errores frecuentes. */
  mistakes?: string[]
  /** Slugs de las páginas relacionadas. */
  related: string[]
  /** Slug del artículo del blog que habla de este bloque. */
  post?: string
  /** Imagen de cabecera (solo la tienen las secciones de la guía). */
  image?: ContentImage
  /** Criterio de la rúbrica que explica la página, si aplica. */
  criterionId?: string
}

/** Prefijo de las rutas de la guía. */
export const GUIDE_PREFIX = '/guia/'

/** Ruta del índice de la guía. */
export const GUIDE_INDEX_PATH = GUIDE_PREFIX

/**
 * Páginas relacionadas de cada sección de la guía.
 *
 * A mano y no por posición: cada sección enlaza con lo que de verdad va
 * después (los fundamentos que la sostienen y los bloques que la aplican).
 */
const RELATED_BY_SECTION: Record<string, string[]> = {
  'que-es-un-prompt': [
    'para-que-sirve-un-prompt',
    'claves-para-un-buen-prompt',
    'rol',
    'objetivo',
    'formato'
  ],
  'para-que-sirve-un-prompt': [
    'que-es-un-prompt',
    'claves-para-un-buen-prompt',
    'datos',
    'ejemplos',
    'formato'
  ],
  'claves-para-un-buen-prompt': [
    'que-es-un-prompt',
    'para-que-sirve-un-prompt',
    'rol',
    'contexto',
    'restricciones',
    'validacion'
  ]
}

/** Páginas de las tres secciones de la guía de la home. */
const sectionPages: GuidePage[] = GUIDE_SECTIONS.map((section) => ({
  slug: section.id,
  path: `${GUIDE_PREFIX}${section.id}/`,
  title: section.title,
  description: section.description,
  summary: section.summary,
  accent: section.accent,
  sections: [
    { heading: 'En qué consiste', paragraphs: section.details },
    { heading: 'Ejemplo', paragraphs: [section.example] }
  ],
  related: RELATED_BY_SECTION[section.id] ?? [],
  image: {
    src: section.image.src,
    srcSet: section.image.srcSet,
    width: section.image.width,
    height: section.image.height,
    alt: section.imageAlt
  }
}))

/** Páginas de los ocho criterios de la rúbrica. */
const criterionPages: GuidePage[] = CRITERIA_GUIDE.map((criterion) => ({
  slug: criterion.slug,
  path: `${GUIDE_PREFIX}${criterion.slug}/`,
  title: criterion.title,
  description: criterion.description,
  summary: criterion.summary,
  accent: '#8b5cf6',
  sections: criterion.sections,
  template: criterion.template,
  example: criterion.example,
  mistakes: criterion.mistakes,
  related: criterion.related,
  post: criterion.post,
  criterionId: criterion.criterionId
}))

/** Todas las páginas de la guía. */
export const GUIDE_PAGES: GuidePage[] = [...sectionPages, ...criterionPages]

/** Páginas de la guía indexadas por su slug. */
export const GUIDE_PAGE_BY_SLUG: Record<string, GuidePage> = Object.fromEntries(
  GUIDE_PAGES.map((page) => [page.slug, page])
)

/** Devuelve la página de la guía que corresponde a un slug. */
export const getGuidePage = (slug: string): GuidePage | undefined => GUIDE_PAGE_BY_SLUG[slug]
