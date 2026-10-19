import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

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
      expect(style).toContain('--title-gradient')
      expect(section.className.length).toBeGreaterThan(0)
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

  it('el índice enlaza con las secciones', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    const links = Array.from(
      screen.getByRole('navigation', { name: /índice de la guía/i }).querySelectorAll('a')
    )
    expect(links).toHaveLength(3)
    for (const link of links) {
      const id = link.getAttribute('href')?.slice(1)
      expect(document.getElementById(id ?? '')).not.toBeNull()
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
})
