import { describe, expect, it } from 'vitest'
import { renderOgImage, renderOgSvg, wrapTitle } from './og-images.mjs'

describe('imágenes Open Graph', () => {
  it('parte el título en líneas que caben', () => {
    const lines = wrapTitle('El rol en un prompt: por qué decide cómo responde el modelo')

    expect(lines.length).toBeGreaterThan(1)
    for (const line of lines) {
      expect(line.length).toBeLessThanOrEqual(30)
    }
  })

  it('avisa con puntos suspensivos cuando el título no cabe entero', () => {
    const lines = wrapTitle(
      'Un título playbook de prompts para agentes autónomos con herramientas, memoria y planificación'
    )

    expect(lines).toHaveLength(3)
    expect(lines[lines.length - 1].endsWith('…')).toBe(true)
  })

  it('un título corto cabe en una línea', () => {
    expect(wrapTitle('Blog')).toEqual(['Blog'])
  })

  it('el SVG lleva el título, la etiqueta y el sitio', () => {
    const svg = renderOgSvg({ title: 'El rol en un prompt', kicker: 'Guía de prompts' })

    expect(svg).toContain('El rol en un prompt')
    expect(svg).toContain('GUÍA DE PROMPTS')
    expect(svg).toContain('Prompt.com')
    expect(svg).toContain('width="1200"')
    expect(svg).toContain('height="630"')
  })

  it('escapa los caracteres que romperían el SVG', () => {
    const svg = renderOgSvg({ title: 'A & B < C > D "E"' })

    expect(svg).toContain('&amp;')
    expect(svg).toContain('&lt;')
    expect(svg).not.toContain('< C >')
  })

  it('genera un PNG con el tamaño de Open Graph', async () => {
    const png = await renderOgImage({ title: 'El rol en un prompt', kicker: 'Guía de prompts' })

    // Firma de un PNG: 8 bytes de cabecera.
    expect(png.subarray(1, 4).toString()).toBe('PNG')
    expect(png.length).toBeGreaterThan(1000)
  })
})
