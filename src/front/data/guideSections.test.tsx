import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GUIDE_SECTIONS } from './guideSections'
import { HOME_JSON_LD, type FaqPageNode, type WebSiteNode } from './seoData'

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
  it('el FAQPage cubre todas las secciones de la guía', () => {
    const faq = findNode<FaqPageNode>('FAQPage')
    expect(faq?.mainEntity).toHaveLength(GUIDE_SECTIONS.length)
  })

  it('las preguntas del JSON-LD coinciden con los títulos visibles', () => {
    const faq = findNode<FaqPageNode>('FAQPage')
    expect(faq?.mainEntity.map((q) => q.name)).toEqual(GUIDE_SECTIONS.map((s) => s.title))
  })

  it('cada respuesta incluye el resumen, los detalles y el ejemplo', () => {
    const faq = findNode<FaqPageNode>('FAQPage')

    for (const [index, question] of (faq?.mainEntity ?? []).entries()) {
      const section = GUIDE_SECTIONS[index]
      expect(question.acceptedAnswer.text).toContain(section.summary)
      for (const detail of section.details) {
        expect(question.acceptedAnswer.text).toContain(detail)
      }
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
