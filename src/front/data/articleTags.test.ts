import { describe, expect, it } from 'vitest'
import { ARTICLE_TAGS, ARTICLES, getArticleTag, tagSlug } from './articles'
import { ROUTES, routesByGroup } from './routeMeta'

describe('etiquetas del blog', () => {
  it('el slug de una etiqueta es una URL limpia', () => {
    expect(tagSlug('Agentes de IA')).toBe('agentes-de-ia')
    expect(tagSlug('Iteración')).toBe('iteracion')
    expect(tagSlug('Comparativa')).toBe('comparativa')
  })

  it('cada etiqueta agrupa sus artículos', () => {
    expect(ARTICLE_TAGS.length).toBeGreaterThan(0)
    for (const tag of ARTICLE_TAGS) {
      expect(tag.articles.length).toBeGreaterThan(0)
      expect(tag.path).toBe(`/blog/etiqueta/${tag.slug}/`)
      for (const article of tag.articles) {
        expect(article.tags).toContain(tag.label)
      }
    }
  })

  it('todas las etiquetas tienen su ruta en el catálogo del build', () => {
    const rutas = routesByGroup('blog-tag').map((route) => route.path).sort()
    const esperadas = ARTICLE_TAGS.map((tag) => tag.path).sort()
    expect(rutas).toEqual(esperadas)
  })

  it('una etiqueta con un solo artículo no se indexa', () => {
    // Con un artículo la página es demasiado fina: se marca como `noindex`
    // hasta que haya dos.
    for (const tag of ARTICLE_TAGS) {
      const route = ROUTES.find((item) => item.path === tag.path)
      expect(route).toBeDefined()
      expect(route?.noindex).toBe(tag.articles.length < 2 ? true : undefined)
    }
  })

  it('todos los artículos tienen al menos una etiqueta', () => {
    for (const article of ARTICLES) {
      expect(article.tags.length).toBeGreaterThan(0)
    }
  })

  it('se encuentra la etiqueta por su slug', () => {
    expect(getArticleTag('agentes-de-ia')?.label).toBe('Agentes de IA')
    expect(getArticleTag('no-existe')).toBeUndefined()
  })
})
