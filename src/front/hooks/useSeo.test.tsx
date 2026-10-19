import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import useSeo, { type SeoOptions } from './useSeo'

const meta = (key: string): string | undefined =>
  document.head.querySelector(`meta[name="${key}"]`)?.getAttribute('content') ?? undefined
const property = (key: string): string | undefined =>
  document.head.querySelector(`meta[property="${key}"]`)?.getAttribute('content') ?? undefined
const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')
const jsonLd = () => {
  const script = document.head.querySelector('script[type="application/ld+json"]')
  return script ? JSON.parse(script.textContent) : null
}

const Probe = (props: SeoOptions) => {
  useSeo(props)
  return null
}

describe('useSeo', () => {
  it('define el título con el sufijo del sitio', () => {
    render(<Probe title="Generador de prompts" />)
    expect(document.title).toBe('Generador de prompts — Prompt.com')
  })

  it('usa el título por defecto si no se pasa ninguno', () => {
    render(<Probe />)
    expect(document.title).toContain('Prompt.com')
    expect(document.title.length).toBeGreaterThan(10)
  })

  it('define descripción, canonical y robots', () => {
    render(<Probe title="Guía" description="Una descripción" path="/guia" />)

    expect(meta('description')).toBe('Una descripción')
    expect(canonical()).toMatch(/\/guia\/$/)
    expect(meta('robots')).toBe('index, follow')
  })

  it('marca como noindex cuando corresponde', () => {
    render(<Probe title="404" noindex />)

    expect(meta('robots')).toBe('noindex, nofollow')
    expect(canonical()).toBeUndefined()
  })

  it('rellena las etiquetas de Open Graph', () => {
    render(<Probe title="Guía" description="Desc" path="/" />)

    expect(property('og:title')).toContain('Guía')
    expect(property('og:description')).toBe('Desc')
    expect(property('og:type')).toBe('website')
    expect(property('og:site_name')).toBe('Prompt.com')
    expect(property('og:url')).toMatch(/^https?:\/\//)
    expect(property('og:image')).toMatch(/\/og-image\.png$/)
    expect(property('og:image:width')).toBe('1200')
  })

  it('rellena las etiquetas de Twitter', () => {
    render(<Probe title="Guía" />)

    expect(meta('twitter:card')).toBe('summary_large_image')
    expect(meta('twitter:title')).toContain('Guía')
    expect(meta('twitter:image')).toMatch(/\/og-image\.png$/)
  })

  it('inserta los datos estructurados y los retira al desmontar', () => {
    const { unmount } = render(
      <Probe title="Guía" jsonLd={{ '@type': 'FAQPage', mainEntity: [] }} />
    )

    expect(jsonLd()).toEqual({ '@type': 'FAQPage', mainEntity: [] })

    unmount()
    expect(jsonLd()).toBeNull()
  })

  it('no inserta datos estructurados si no se pasan', () => {
    render(<Probe title="Guía" />)
    expect(jsonLd()).toBeNull()
  })
})
