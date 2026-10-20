import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GUIDE_SECTIONS } from './guideSections'
import { HOME_JSON_LD, type ArticleNode, type WebSiteNode } from './seoData'

const findNode = <T extends { '@type': string }>(type: string): T | undefined =>
  HOME_JSON_LD['@graph'].find((node) => node['@type'] === type) as T | undefined

describe('contenido de la guía', () => {
  it('tiene al menos las tres secciones del índice', () => {
    expect(GUIDE_SECTIONS.length).toBeGreaterThanOrEqual(3)
  })

  it('cada sección tiene título, resumen, detalles, ejemplo e imagen', () => {
    for (const section of GUIDE_SECTIONS) {
      expect(section.id).toMatch(/^[a-z-]+$/)
      expect(section.title.length).toBeGreaterThan(5)
      expect(section.summary.length).toBeGreaterThan(50)
      expect(section.details.length).toBeGreaterThanOrEqual(3)
      expect(section.example.length).toBeGreaterThan(20)
      expect(section.imageAlt.length).toBeGreaterThan(20)
      expect(section.image.src).toMatch(/\.webp$/)
      expect(section.image.srcSet).toMatch(/ \d+w,/)
      expect(section.image.width).toBeGreaterThan(0)
      expect(section.image.height).toBeGreaterThan(0)
    }
  })

  it('los identificadores son únicos (anclas del índice)', () => {
    const ids = GUIDE_SECTIONS.map((section) => section.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('datos estructurados de la home', () => {
  it('el artículo de la guía lista todas sus secciones', () => {
    const article = findNode<ArticleNode>('Article')
    expect(article?.mainEntity.itemListElement).toHaveLength(GUIDE_SECTIONS.length)
  })

  it('los apartados del JSON-LD coinciden con los títulos visibles', () => {
    const article = findNode<ArticleNode>('Article')
    expect(article?.mainEntity.itemListElement.map((item) => item.name)).toEqual(
      GUIDE_SECTIONS.map((section) => section.title)
    )
  })

  it('cada apartado apunta a su página de la guía', () => {
    const article = findNode<ArticleNode>('Article')

    for (const [index, item] of (article?.mainEntity.itemListElement ?? []).entries()) {
      expect(item.url).toContain(`/guia/${GUIDE_SECTIONS[index].id}/`)
    }
  })

  it('el WebSite declara nombre, url e idioma', () => {
    const site = findNode<WebSiteNode>('WebSite')
    expect(site?.name).toBe('Prompt.com')
    expect(site?.url).toMatch(/^https?:\/\//)
    expect(site?.inLanguage).toBe('es-ES')
  })
})

describe('Home', () => {
  it('muestra un índice navegable con todas las secciones', () => {
    render(
      <div>
        <h1>Guía de prompts</h1>
        {GUIDE_SECTIONS.map((section) => (
          <section key={section.id} id={section.id} />
        ))}
      </div>
    )

    expect(screen.getAllByRole('heading', { level: 1 })[0]).toHaveTextContent('Guía de prompts')
  })
})
