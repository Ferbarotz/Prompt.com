import { describe, expect, it } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { routes } from './router'
import { LEGAL_PAGES } from './data/legalContent'
import { ROUTE_BY_KEY } from './data/routeMeta'

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

  it.each(Object.entries(LEGAL_PAGES))('la ruta %s carga su página legal', async (key, page) => {
    renderAt(ROUTE_BY_KEY[key].path.replace(/\/$/, ''))
    expect(
      await screen.findByRole('heading', { level: 1, name: page.title })
    ).toBeInTheDocument()
  })

  it('el índice de la guía carga su listado', async () => {
    renderAt('/guia')
    expect(
      await screen.findByRole('heading', { level: 1, name: /todos los bloques/i })
    ).toBeInTheDocument()
  })

  it('una página de la guía carga su contenido', async () => {
    renderAt('/guia/rol')
    expect(
      await screen.findByRole('heading', { level: 1, name: /el rol en un prompt/i })
    ).toBeInTheDocument()
  })

  it('el índice del blog carga los artículos', async () => {
    renderAt('/blog')
    expect(
      await screen.findByRole('heading', { level: 1, name: /prompts en el trabajo real/i })
    ).toBeInTheDocument()
  })

  it('un artículo del blog carga su contenido', async () => {
    renderAt('/blog/un-mismo-prompt-con-varios-modelos')
    expect(
      await screen.findByRole('heading', { level: 1, name: /un mismo prompt para varios modelos/i })
    ).toBeInTheDocument()
  })

  it('una ruta inexistente muestra la 404', async () => {
    renderAt('/no-existe-esta-pagina')
    expect(await screen.findByText('404')).toBeInTheDocument()
  })

  it.each([
    ['/generator-prompt', /generador de prompts/i],
    ['/prompt-generator', /generador de prompts/i],
    ['/generador-prompt', /generador de prompts/i],
    ['/linter', /analizador de prompts/i],
    ['/linter-prompt', /analizador de prompts/i]
  ])('el alias %s lleva a su página canónica', async (alias, heading) => {
    renderAt(alias)
    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
  })

  it('el alias conserva el base path de GitHub Pages', async () => {
    const router = createMemoryRouter(routes, {
      basename: '/Prompt.com/',
      initialEntries: ['/Prompt.com/generator-prompt']
    })
    render(<RouterProvider router={router} />)

    expect(
      await screen.findByRole('heading', { level: 1, name: /generador de prompts/i })
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/Prompt.com/generar-prompt/')
  })

  it('las rutas diferidas tienen pantalla de carga y de error', async () => {
    // Sin HydrateFallback, React Router renderiza null mientras descarga el
    // módulo de la ruta y el visitante ve un hueco en blanco.
    type RutaDiferida = RouteObject & {
      lazy: () => Promise<{ Component?: unknown }>
    }
    const diferidas = routes.filter(
      (ruta): ruta is RutaDiferida => typeof (ruta as RouteObject).lazy === 'function'
    )

    expect(diferidas.length).toBeGreaterThan(0)

    for (const ruta of diferidas) {
      // Las propiedades van en la ruta, no en el `lazy`: si la descarga del
      // módulo falla, el `errorElement` tiene que existir ya.
      expect(ruta.HydrateFallback).toBeDefined()
      expect(ruta.errorElement).toBeTruthy()

      const cargada = await ruta.lazy()
      expect(cargada.Component).toBeDefined()
    }
  })

  it('todas las rutas tienen un título de documento', async () => {    for (const path of ['/', '/generar-prompt', '/analizar-prompt', '/privacidad']) {
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
