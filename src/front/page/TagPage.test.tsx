import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TagPage from './TagPage'
import { getArticleTag } from '../data/articles'

const renderPage = (slug: string) =>
  render(
    <MemoryRouter>
      <TagPage slug={slug} />
    </MemoryRouter>
  )

describe('página de etiqueta', () => {
  it('lista los artículos de la etiqueta', () => {
    const tag = getArticleTag('agentes-de-ia')
    renderPage('agentes-de-ia')

    // Solo la primera palabra va en minúscula: las siglas se respetan
    // («agentes de IA», no «agentes de ia»).
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'agentes de IA'
    )
    expect(tag?.label).toBe('Agentes de IA')
    // También aparece en el pie (columna del blog): se busca el de la lista.
    const enlaces = screen.getAllByRole('link', { name: /prompts para agentes de ia/i })
    expect(enlaces.length).toBeGreaterThan(0)
    expect(enlaces[0]).toHaveAttribute('href', '/blog/prompts-para-agentes-de-ia/')
  })

  it('con un solo artículo no se indexa', () => {
    renderPage('agentes-de-ia')

    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex, nofollow'
    )
  })

  it('un slug que no existe muestra un aviso', () => {
    renderPage('no-existe')

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/no encontrada/i)
  })
})
