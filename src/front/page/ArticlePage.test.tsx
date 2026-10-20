import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ArticlePage from './ArticlePage'
import { getArticle } from '../data/articles'

const renderPage = (slug: string) =>
  render(
    <MemoryRouter>
      <ArticlePage slug={slug} />
    </MemoryRouter>
  )

describe('página de artículo', () => {
  it('muestra el título, la fecha y los apartados', () => {
    const article = getArticle('un-mismo-prompt-con-varios-modelos')
    renderPage('un-mismo-prompt-con-varios-modelos')

    expect(
      screen.getByRole('heading', { level: 1, name: article?.title ?? '' })
    ).toBeInTheDocument()
    expect(screen.getByText(article?.date ?? '')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThanOrEqual(3)
  })

  it('muestra los puntos clave', () => {
    renderPage('prompts-para-agentes-de-ia')

    expect(screen.getByText(/en corto/i)).toBeInTheDocument()
  })

  it('enlaza con las dos herramientas', () => {
    renderPage('revisar-y-mejorar-un-prompt-que-no-funciona')

    expect(screen.getByRole('link', { name: /generar un prompt/i })).toHaveAttribute(
      'href',
      '/generar-prompt/'
    )
    expect(screen.getByRole('link', { name: /analizar un prompt/i })).toHaveAttribute(
      'href',
      '/analizar-prompt/'
    )
  })

  it('un slug que no existe muestra un aviso, no un error', () => {
    renderPage('no-existe')

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/no encontrado/i)
  })
})
