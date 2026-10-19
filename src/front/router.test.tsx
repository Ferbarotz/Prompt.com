import { describe, expect, it } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from './router'
import { LEGAL_PAGES } from './data/legalContent'

const renderAt = (path: string) => {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return router
}

describe('enrutado', () => {
  it('la home muestra la guía', async () => {
    renderAt('/')
    expect(
      await screen.findByRole('heading', { level: 1, name: /guía de prompts/i })
    ).toBeInTheDocument()
  })

  it('la ruta del generador carga su página', async () => {
    renderAt('/generar-prompt')
    expect(
      await screen.findByRole('heading', { level: 1, name: /generador de prompts/i })
    ).toBeInTheDocument()
  })

  it('la ruta del analizador carga su página', async () => {
    renderAt('/analizar-prompt')
    expect(
      await screen.findByRole('heading', { level: 1, name: /analizador de prompts/i })
    ).toBeInTheDocument()
  })

  it.each(Object.entries(LEGAL_PAGES))('la ruta /%s carga su página legal', async (slug, page) => {
    renderAt(`/${slug}`)
    expect(
      await screen.findByRole('heading', { level: 1, name: page.title })
    ).toBeInTheDocument()
  })

  it('una ruta inexistente muestra la 404', async () => {
    renderAt('/no-existe-esta-pagina')
    expect(await screen.findByText('404')).toBeInTheDocument()
  })

  it('todas las rutas tienen un título de documento', async () => {
    for (const path of ['/', '/generar-prompt', '/analizar-prompt', '/privacidad']) {
      const router = createMemoryRouter(routes, { initialEntries: [path] })
      const { container, unmount } = render(<RouterProvider router={router} />)

      // La consulta se acota a este render: las rutas se cargan bajo demanda y
      // el render anterior sigue en el DOM hasta que se desmonta.
      await waitFor(() => {
        expect(within(container).getByRole('heading', { level: 1 })).toBeInTheDocument()
      })
      expect(document.title.length).toBeGreaterThan(5)

      unmount()
    }
  })
})
