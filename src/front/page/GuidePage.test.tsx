import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GuidePage from './GuidePage'
import { getGuidePage } from '../data/guidePages'

const renderPage = (slug: string) =>
  render(
    <MemoryRouter>
      <GuidePage slug={slug} />
    </MemoryRouter>
  )

describe('página de la guía', () => {
  it('muestra el título, la entrada y los apartados', () => {
    const page = getGuidePage('rol')
    renderPage('rol')

    expect(screen.getByRole('heading', { level: 1, name: page?.title ?? '' })).toBeInTheDocument()
    expect(screen.getByText(page?.summary ?? '')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(0)
  })

  it('incluye las migas de pan con el enlace a la guía', () => {
    renderPage('formato')

    const breadcrumb = screen.getByRole('navigation', { name: /migas de pan/i })
    expect(breadcrumb).toBeInTheDocument()
    expect(breadcrumb).toHaveTextContent('Inicio')
    expect(breadcrumb).toHaveTextContent('Guía')
  })

  it('los bloques de la rúbrica muestran la plantilla y los errores', () => {
    const page = getGuidePage('formato')
    renderPage('formato')

    // La plantilla y el ejemplo van en bloques de código: se comprueba su
    // contenido, no su texto renderizado (que normaliza los saltos de línea).
    const bloques = Array.from(document.querySelectorAll('pre')).map((pre) => pre.textContent ?? '')
    expect(bloques.some((texto) => texto.includes(page?.template ?? ''))).toBe(true)
    expect(bloques.some((texto) => texto.includes(page?.example ?? ''))).toBe(true)
    expect(screen.getByText(/errores frecuentes/i)).toBeInTheDocument()
  })

  it('enlaza con las dos herramientas', () => {
    renderPage('contexto')

    expect(screen.getByRole('link', { name: /generar un prompt/i })).toHaveAttribute(
      'href',
      '/generar-prompt/'
    )
    expect(screen.getByRole('link', { name: /analizar un prompt/i })).toHaveAttribute(
      'href',
      '/analizar-prompt/'
    )
  })

  it('enlaza con las páginas relacionadas', () => {
    renderPage('rol')

    const related = screen.getByRole('navigation', { name: /páginas relacionadas/i })
    expect(related.querySelectorAll('a').length).toBeGreaterThan(0)
  })

  it('un slug que no existe muestra un aviso, no un error', () => {
    renderPage('no-existe')

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/no encontrada/i)
  })
})
