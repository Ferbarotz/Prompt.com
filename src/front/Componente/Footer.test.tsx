import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('permite borrar lo que la web ha guardado en el navegador', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem('prompt-com:generator', '{"idea":"hola"}')
    renderFooter()

    await user.click(screen.getByRole('button', { name: /borrar los datos guardados/i }))

    expect(window.localStorage.getItem('prompt-com:generator')).toBeNull()
    expect(screen.getByRole('status')).toHaveTextContent(/no queda nada guardado/i)
  })

  it('la columna de la guía enlaza con los bloques', () => {
    renderFooter()

    const guia = screen.getByRole('navigation', { name: 'Guía' })
    const enlaces = Array.from(guia.querySelectorAll('a')).map((a) => a.getAttribute('href'))

    expect(enlaces).toContain('/guia/')
    expect(enlaces).toContain('/guia/rol/')
    expect(enlaces).toContain('/guia/validacion/')
  })
})
