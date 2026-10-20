import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LegalPage from './LegalPage'
import { LEGAL_PAGES, siteOwner } from '../data/legalContent'

describe('páginas legales', () => {
  it('el catálogo cubre las tres páginas obligatorias', () => {
    expect(Object.keys(LEGAL_PAGES).sort()).toEqual([
      'avisoLegal',
      'cookies',
      'privacidad'
    ])
  })

  it.each(Object.entries(LEGAL_PAGES))('%s tiene título, descripción y secciones', (_slug, page) => {
    expect(page.title.length).toBeGreaterThan(5)
    expect(page.description.length).toBeGreaterThan(40)
    expect(page.sections.length).toBeGreaterThanOrEqual(3)
    expect(page.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    for (const section of page.sections) {
      expect(section.heading.length).toBeGreaterThan(3)
      expect(section.paragraphs.length).toBeGreaterThan(0)
    }
  })

  it('los datos del titular están centralizados para poder editarlos', () => {
    expect(siteOwner.email).toContain('@')
    expect(siteOwner.legalName.length).toBeGreaterThan(0)
    expect(siteOwner.address.length).toBeGreaterThan(0)
  })

  it('la página legal renderiza el contenido y el enlace de vuelta', () => {
    const page = LEGAL_PAGES.privacidad
    render(
      <MemoryRouter>
        <LegalPage routeKey="privacidad" />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(page.title)
    for (const section of page.sections) {
      expect(screen.getByRole('heading', { name: section.heading })).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: /volver al inicio/i })).toHaveAttribute('href', '/')
  })

  it('el apartado de analítica solo aparece si la hay activada', () => {
    vi.stubEnv('VITE_ANALYTICS_URL', 'https://plausible.io/js/script.js')
    vi.stubEnv('VITE_ANALYTICS_DOMAIN', 'prompt.com')

    render(
      <MemoryRouter>
        <LegalPage routeKey="privacidad" />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /analítica sin cookies/i })).toBeInTheDocument()
    expect(screen.getAllByText(/plausible/i).length).toBeGreaterThan(0)

    vi.unstubAllEnvs()
  })

  it('sin analítica no se menciona en la política', () => {
    render(
      <MemoryRouter>
        <LegalPage routeKey="privacidad" />
      </MemoryRouter>
    )

    expect(screen.queryByRole('heading', { name: /analítica sin cookies/i })).toBeNull()
  })
})
