import { describe, expect, it } from 'vitest'
import { GUIDE_PAGES, GUIDE_INDEX_PATH, getGuidePage } from './guidePages'
import { CRITERIA_GUIDE } from './criteriaGuide'
import { GUIDE_SECTIONS } from './guideSections'
import { CRITERIA } from './promptLinter'
import { ROUTES, routesByGroup } from './routeMeta'

describe('páginas de la guía', () => {
  it('cada sección de la guía tiene su propia página', () => {
    for (const section of GUIDE_SECTIONS) {
      const page = getGuidePage(section.id)
      expect(page).toBeDefined()
      expect(page?.path).toBe(`${GUIDE_INDEX_PATH}${section.id}/`)
    }
  })

  it('cada criterio de la rúbrica tiene su propia página', () => {
    for (const criterion of CRITERIA) {
      const page = getGuidePage(criterion.id)
      expect(page).toBeDefined()
      expect(page?.criterionId).toBe(criterion.id)
      expect(page?.template).toBe(criterion.template)
    }
  })

  it('las páginas tienen título, descripción y contenido', () => {
    for (const page of GUIDE_PAGES) {
      expect(page.title.length).toBeGreaterThan(10)
      expect(page.description.length).toBeGreaterThan(40)
      expect(page.summary.length).toBeGreaterThan(80)
      expect(page.sections.length).toBeGreaterThan(0)
      for (const section of page.sections) {
        expect(section.heading.length).toBeGreaterThan(3)
        expect(section.paragraphs.length).toBeGreaterThan(0)
      }
    }
  })

  it('las páginas de los bloques traen plantilla, ejemplo y errores', () => {
    for (const guide of CRITERIA_GUIDE) {
      const page = getGuidePage(guide.slug)
      expect(page?.template).toBeTruthy()
      expect(page?.example).toBeTruthy()
      expect(page?.mistakes?.length).toBeGreaterThan(0)
    }
  })

  it('los enlaces relacionados apuntan a páginas que existen', () => {
    for (const page of GUIDE_PAGES) {
      expect(page.related.length).toBeGreaterThan(0)
      for (const slug of page.related) {
        expect(getGuidePage(slug)).toBeDefined()
      }
    }
  })

  it('el catálogo de rutas y el de páginas están sincronizados', () => {
    const enCatalogo = routesByGroup('guide-blocks')
      .concat(routesByGroup('guide-sections'))
      .map((route) => route.path)
      .sort()

    const enPaginas = GUIDE_PAGES.map((page) => page.path).sort()

    expect(enCatalogo).toEqual(enPaginas)
  })

  it('las rutas de la guía están en el catálogo del build', () => {
    for (const page of GUIDE_PAGES) {
      const route = ROUTES.find((item) => item.path === page.path)
      expect(route).toBeDefined()
      expect(route?.title).toBe(page.title)
      expect(route?.description).toBe(page.description)
      expect(route?.og?.file).toBe(`guia/${page.slug}`)
    }
  })

  it('los títulos no son tan largos como para que se corten en el buscador', () => {
    // Con el sufijo " — Prompt.com", el título no debería pasar de 60
    // caracteres: Google corta el title tag y muestra "…".
    for (const page of GUIDE_PAGES) {
      expect(page.title.length + ' — Prompt.com'.length).toBeLessThanOrEqual(60)
    }
  })

  it('las descripciones caben en el resultado del buscador y no se cortan a media frase', () => {
    for (const page of GUIDE_PAGES) {
      expect(page.description.length).toBeLessThanOrEqual(160)
      expect(page.description.endsWith('…')).toBe(false)
    }
  })
})
