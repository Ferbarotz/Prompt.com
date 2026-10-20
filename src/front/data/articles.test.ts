import { describe, expect, it } from 'vitest'
import { ARTICLES } from './articles'
import { ROUTES, routesByGroup } from './routeMeta'
import { PATHS } from './paths'

describe('artículos del blog', () => {
  it('cada artículo tiene slug, ruta y título', () => {
    expect(ARTICLES.length).toBeGreaterThan(0)
    for (const article of ARTICLES) {
      expect(article.slug).toMatch(/^[a-z0-9-]+$/)
      expect(article.path).toBe(`/blog/${article.slug}/`)
      expect(article.title.length).toBeGreaterThan(10)
      expect(article.description.length).toBeGreaterThan(40)
      expect(article.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(article.minutes).toBeGreaterThan(0)
      expect(article.tags.length).toBeGreaterThan(0)
    }
  })

  it('cada artículo tiene apartados con contenido', () => {
    for (const article of ARTICLES) {
      expect(article.sections.length).toBeGreaterThanOrEqual(3)
      for (const section of article.sections) {
        expect(section.heading.length).toBeGreaterThan(3)
        expect(section.paragraphs.length).toBeGreaterThan(0)
        for (const paragraph of section.paragraphs) {
          expect(paragraph.length).toBeGreaterThan(40)
        }
      }
    }
  })

  it('los slugs son únicos', () => {
    expect(new Set(ARTICLES.map((article) => article.slug)).size).toBe(ARTICLES.length)
  })

  it('los artículos van del más reciente al más antiguo', () => {
    const fechas = ARTICLES.map((article) => article.date)
    expect([...fechas].sort().reverse()).toEqual(fechas)
  })

  it('el catálogo del build tiene una ruta por artículo', () => {
    const rutas = routesByGroup('blog').map((route) => route.path).sort()
    const esperadas = ARTICLES.map((article) => article.path).sort()
    expect(rutas).toEqual(esperadas)
  })

  it('cada artículo está en el catálogo del build con sus metadatos', () => {
    for (const article of ARTICLES) {
      const route = ROUTES.find((item) => item.path === article.path)
      expect(route).toBeDefined()
      expect(route?.title).toBe(article.title)
      expect(route?.description).toBe(article.description)
      expect(route?.og?.file).toBe(`blog/${article.slug}`)
    }
  })

  it('los títulos no son tan largos como para que se corten en el buscador', () => {
    // Con el sufijo " — Prompt.com", el título no debería pasar de 60
    // caracteres: Google corta el title tag y muestra "…".
    for (const article of ARTICLES) {
      expect(article.title.length + ' — Prompt.com'.length).toBeLessThanOrEqual(60)
    }
  })

  it('el índice del blog está en el catálogo', () => {
    const index = ROUTES.find((route) => route.path === PATHS.blog)
    expect(index).toBeDefined()
    expect(index?.group).toBe('blog-index')
  })
})
