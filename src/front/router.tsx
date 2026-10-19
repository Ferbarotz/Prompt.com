import { createBrowserRouter, createMemoryRouter } from 'react-router-dom'
import type { ComponentType } from 'react'
import Home from './page/Home/Home'
import { LEGAL_PAGES } from './data/legalContent'

/**
 * Las rutas secundarias se cargan bajo demanda: la home y su contenido son
 * lo primero que necesita el visitante y así no engordan el bundle inicial.
 */
const lazyRoute = (loader: () => Promise<{ default: ComponentType }>) => async () => {
  const module = await loader()
  return { Component: module.default }
}

// Las páginas legales comparten plantilla: se generan a partir del catálogo.
const legalRoutes = Object.entries(LEGAL_PAGES).map(([slug, page]) => ({
  path: `/${slug}`,
  lazy: lazyRoute(async () => {
    const { default: LegalPage } = await import('./page/LegalPage')
    const Wrapped = () => <LegalPage page={page} path={`/${slug}`} />
    return { default: Wrapped }
  })
}))

export const routes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/generar-prompt',
    lazy: lazyRoute(() => import('./page/GeneratorPage'))
  },
  {
    path: '/analizar-prompt',
    lazy: lazyRoute(() => import('./page/LinterPage'))
  },
  ...legalRoutes,
  {
    path: '*',
    lazy: lazyRoute(() => import('./page/NotFoundPage'))
  }
]

// `import.meta.env.BASE_URL` refleja el `base` de vite.config.js ('/Prompt.com/'),
// por lo que las rutas funcionan igual en dev, en el build y en GitHub Pages.
const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL })

export { createMemoryRouter }

export default router
