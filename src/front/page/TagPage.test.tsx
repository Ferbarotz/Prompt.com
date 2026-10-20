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

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      tag?.label.toLowerCase() ?? ''
    )
    expect(screen.getByRole('link', { name: /prompts para agentes de ia/i })).toBeInTheDocument()
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
