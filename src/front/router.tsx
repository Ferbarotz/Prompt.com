import { createBrowserRouter, createMemoryRouter, Navigate } from 'react-router-dom'
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
 *
 * Se usa `<Navigate>` en lugar de un `loader` con `redirect()`: el loader
 * deja la ruta sin elemento durante un instante (y avisa por consola), y
 * `<Navigate>` redirige en el primer render.
 */
export const ALIAS_ROUTES: RouteObject[] = [
  { path: '/generator-prompt', element: <Navigate to={PATHS.generator} replace /> },
  { path: '/prompt-generator', element: <Navigate to={PATHS.generator} replace /> },
  { path: '/generador-prompt', element: <Navigate to={PATHS.generator} replace /> },
  { path: '/linter', element: <Navigate to={PATHS.linter} replace /> },
  { path: '/linter-prompt', element: <Navigate to={PATHS.linter} replace /> },
  { path: '/analizador-prompt', element: <Navigate to={PATHS.linter} replace /> }
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
