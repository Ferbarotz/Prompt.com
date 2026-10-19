import { createBrowserRouter, createMemoryRouter, redirect } from 'react-router-dom'
import type { ComponentType } from 'react'
import type { RouteObject } from 'react-router-dom'
import Home from './page/Home/Home'
import { LEGAL_PAGES } from './data/legalContent'
import { PATHS } from './data/paths'

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
    const Wrapped = () => <LegalPage page={page} path={`/${slug}/`} />
    return { default: Wrapped }
  })
}))

/**
 * Alias de las rutas secundarias.
 *
 * Muchas URLs antiguas o escritas a mano (en inglés, en plural, sin tilde...)
 * acaban en la página 404. Con estos alias el visitante cae siempre en la
 * página correcta, que además es la canónica para el buscador.
 *
 * Son redirecciones, así que no se publican en el sitemap: solo la ruta
 * canónica debe indexarse.
 */
export const ALIAS_ROUTES: RouteObject[] = [
  { path: '/generator-prompt', loader: () => redirect(PATHS.generator) },
  { path: '/prompt-generator', loader: () => redirect(PATHS.generator) },
  { path: '/generador-prompt', loader: () => redirect(PATHS.generator) },
  { path: '/linter', loader: () => redirect(PATHS.linter) },
  { path: '/linter-prompt', loader: () => redirect(PATHS.linter) },
  { path: '/analizador-prompt', loader: () => redirect(PATHS.linter) }
]

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
  // Alias: las URLs en inglés o escritas a mano no deben acabar en la 404.
  ...ALIAS_ROUTES,
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
