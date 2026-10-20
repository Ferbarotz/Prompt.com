import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Footer from './Footer'

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  )

describe('Footer', () => {
  it('enlaza a las herramientas y a las páginas legales', () => {
    renderFooter()

    for (const label of [
      'Generador de prompts',
      'Analizador de prompts',
      'Guía de prompts',
      'Aviso legal',
      'Política de privacidad',
      'Política de cookies'
    ]) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
  })

  it('muestra el copyright del año actual', () => {
    renderFooter()
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument()
  })
})
