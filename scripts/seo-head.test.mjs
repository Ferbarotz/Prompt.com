import { describe, expect, it } from 'vitest'
import { SEO_END, SEO_START, escapeHtml, renderSeoHead, replaceSeoBlock } from './seo-head.mjs'

const HEAD = {
  title: 'Guía de prompts: qué son y cómo escribirlos',
  description: 'Qué es un prompt y cómo escribir los mejores.',
  url: 'https://prompt.com/generar-prompt/',
  image: 'https://prompt.com/og-image.png'
}

describe('etiquetas SEO del build', () => {
  it('escribe el título con el sufijo del sitio', () => {
    const head = renderSeoHead(HEAD)
    expect(head).toContain('<title>Guía de prompts: qué son y cómo escribirlos — Prompt.com</title>')
    expect(head).toContain('property="og:title"')
  })

  it('escribe la canonical y la imagen absolutas', () => {
    const head = renderSeoHead(HEAD)
    expect(head).toContain('<link rel="canonical" href="https://prompt.com/generar-prompt/" />')
    expect(head).toContain('property="og:image" content="https://prompt.com/og-image.png"')
  })

  it('una página noindex no tiene canonical', () => {
    const head = renderSeoHead({ ...HEAD, noindex: true })
    expect(head).toContain('content="noindex, nofollow"')
    expect(head).not.toContain('rel="canonical"')
  })

  it('escapa las comillas y los símbolos del contenido', () => {
    const head = renderSeoHead({
      ...HEAD,
      title: 'Un "título" con <script>',
      description: 'Una & descripción <extra>'
    })
    expect(head).toContain('&quot;')
    expect(head).toContain('&lt;script&gt;')
    expect(head).toContain('&amp;')
    expect(head).not.toContain('<script>')
  })

  it('sustituye el bloque SEO del HTML', () => {
    const html = `<html><head>${SEO_START}<title>viejo</title>${SEO_END}</head><body></body></html>`
    const result = replaceSeoBlock(html, renderSeoHead(HEAD))

    expect(result).toContain('<title>Guía de prompts')
    expect(result).not.toContain('<title>viejo</title>')
    expect(result).toContain('<body></body>')
  })

  it('falla si el HTML no tiene el bloque SEO', () => {
    expect(() => replaceSeoBlock('<html><head></head></html>', renderSeoHead(HEAD))).toThrow(
      /SEO/
    )
  })

  it('escapa los símbolos sueltos', () => {
    expect(escapeHtml('a & b < c > d "e"')).toBe('a &amp; b &lt; c &gt; d &quot;e&quot;')
  })
})
