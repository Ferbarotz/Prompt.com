import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'
import { GUIDE_SECTIONS } from '../../data/guideSections'

/** Convierte un color hexadecimal a sus canales RGB (0-255). */
const hexToRgb = (hex: string): [number, number, number] => {
  const clean = hex.replace('#', '')
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16)
  ]
}

/** Luminancia relativa de un color (la fórmula de WCAG). */
const luminancia = ([r, g, b]: [number, number, number]): number => {
  const canales = [r, g, b].map((valor) => {
    const canal = valor / 255
    return canal <= 0.03928 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * canales[0] + 0.7152 * canales[1] + 0.0722 * canales[2]
}

describe('Home (presentación)', () => {
  it('aplica las clases de CSS Module a cada sección', () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    const sections = container.querySelectorAll('section[id]')
    expect(sections).toHaveLength(3)

    for (const section of sections) {
      // La clase del módulo está hasheada, pero el atributo de estilo
      // con las variables CSS de acento debe estar presente.
      const style = section.getAttribute('style') ?? ''
      expect(style).toContain('--section-accent')
      // El color vivo (para el tema oscuro) y su variante oscura (para el
      // tema claro, donde el vivo no tiene contraste suficiente).
      expect(style).toContain('--section-accent-solid')
      expect(style).toContain('--section-accent-text')
      expect(section.className.length).toBeGreaterThan(0)
    }
  })

  it('cada sección tiene un color de acento para texto con contraste suficiente', () => {
    for (const section of GUIDE_SECTIONS) {
      // El color de texto del tema claro tiene que llegar a 4.5:1 sobre la
      // superficie clara de la tarjeta (#f6f8ff).
      const relativo = luminancia(hexToRgb(section.accentText))
      const fondo = luminancia(hexToRgb('#f6f8ff'))
      const contraste =
        (Math.max(relativo, fondo) + 0.05) / (Math.min(relativo, fondo) + 0.05)
      expect(contraste).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('las imágenes tienen srcset y dimensiones', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    const images = Array.from(document.querySelectorAll('article img'))
    expect(images).toHaveLength(3)
    for (const image of images) {
      expect(image.getAttribute('srcset')).toContain('w,')
      expect(image.getAttribute('width')).toBeTruthy()
      expect(image.getAttribute('height')).toBeTruthy()
      expect(image.getAttribute('loading')).toBe('lazy')
    }
  })

  it('el footer está presente', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /política de privacidad/i })).toBeInTheDocument()
  })

  it('el hero ofrece acceso directo a las dos herramientas', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: /crear un prompt/i })).toHaveAttribute(
      'href',
      '/generar-prompt/'
    )
    expect(screen.getByRole('link', { name: /analizar un prompt/i })).toHaveAttribute(
      'href',
      '/analizar-prompt/'
    )
  })

  it('cada sección enlaza con su página de la guía', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    const enlaces = screen.getAllByRole('link', { name: /leer el bloque completo/i })
    expect(enlaces).toHaveLength(3)
    for (const enlace of enlaces) {
      expect(enlace.getAttribute('href')).toMatch(/^\/guia\/[a-z-]+\/$/)
    }
  })
})
