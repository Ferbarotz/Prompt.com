import { describe, expect, it, vi } from 'vitest'
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

  it('el formulario del boletín pide un email válido', async () => {
    const user = userEvent.setup()
    renderFooter()

    const input = screen.getByLabelText(/tu correo electrónico/i)
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toBeRequired()

    // La validación nativa del navegador impide enviar un email inválido.
    await user.type(input, 'no-es-un-email')
    await user.click(screen.getByRole('button', { name: /suscribirme/i }))

    expect(input).toBeInvalid()
    expect(screen.getByRole('status')).toHaveTextContent('')
  })

  it('avisa cuando no hay endpoint configurado', async () => {
    const user = userEvent.setup()
    renderFooter()

    await user.type(screen.getByLabelText(/tu correo electrónico/i), 'hola@ejemplo.com')
    await user.click(screen.getByRole('button', { name: /suscribirme/i }))

    expect(screen.getByRole('status')).toHaveTextContent(/aún no está disponible/i)
  })

  it('envía el email al endpoint configurado', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('VITE_NEWSLETTER_ENDPOINT', 'https://example.test/subscribe')

    renderFooter()
    await user.type(screen.getByLabelText(/tu correo electrónico/i), 'hola@ejemplo.com')
    await user.click(screen.getByRole('button', { name: /suscribirme/i }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://example.test/subscribe')
    expect(JSON.parse(options.body)).toEqual({ email: 'hola@ejemplo.com' })

    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('muestra el copyright del año actual', () => {
    renderFooter()
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument()
  })
})
