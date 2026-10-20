import { createBrowserRouter, createMemoryRouter, Navigate } from 'react-router-dom'
import type { ComponentType } from 'react'
import type { RouteObject } from 'react-router-dom'
import Home from './page/Home/Home'
import { LEGAL_PAGES } from './data/legalContent'
import { ALIASES, ROUTE_BY_KEY, ROUTES } from './data/routeMeta'
import { RouteError, RouteLoading } from './Componente/RouteStatus'

/**
 * Las rutas secundarias se cargan bajo demanda: la home y su contenido son
 * lo primero que necesita el visitante y así no engordan el bundle inicial.
 *
 * Cada ruta diferida necesita:
 * - `HydrateFallback`: si no, React Router renderiza `null` mientras descarga
 *   el módulo y el visitante ve un hueco en blanco.
 * - `errorElement`: si la descarga falla (red, extensión bloqueando la
 *   petición...), se muestra una pantalla con opción de recargar.
 *
 * Los dos van como propiedades de la ruta y no dentro de `lazy`, porque un
 * error durante la descarga del módulo ocurre antes de que `lazy` llegue a
 * devolver sus propiedades.
 */
const lazyRoute = (
  loader: () => Promise<{ default: ComponentType }>
): RouteObject => ({
  lazy: async () => {
    const module = await loader()
    return { Component: module.default }
  },
  HydrateFallback: RouteLoading,
  errorElement: <RouteError />
})

// Las páginas legales comparten plantilla: se generan a partir del catálogo.
// La URL sale del catálogo de rutas (`routes.json`), el mismo que usa el
// post-build para crear las carpetas y el sitemap.
const legalRoutes = Object.entries(LEGAL_PAGES).map(([key, page]) => ({
  path: ROUTE_BY_KEY[key].path.replace(/\/$/, ''),
  ...lazyRoute(async () => {
    const { default: LegalPage } = await import('./page/LegalPage')
    const Wrapped = () => <LegalPage page={page} path={ROUTE_BY_KEY[key].path} />
    return { default: Wrapped }
  })
}))

/** Slug de una ruta: la última parte con contenido (`/guia/rol/` → `rol`). */
const slugFromPath = (path: string): string =>
  path.split('/').filter(Boolean).pop() ?? ''

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
export const ALIAS_ROUTES: RouteObject[] = ALIASES.map((alias) => ({
  path: alias.path.replace(/\/$/, ''),
  element: <Navigate to={ROUTE_BY_KEY[alias.target].path} replace />
}))

// Las páginas de la guía: una URL por bloque del prompt, más el índice.
//
// Las rutas salen del catálogo (`routes.json`), no del contenido: así el texto
// de la guía viaja en el chunk perezoso de su página y no engorda el bundle
// inicial, que es lo primero que descarga el visitante.
const guideRoutes: RouteObject[] = [
  {
    path: '/guia',
    ...lazyRoute(() => import('./page/GuideIndexPage'))
  },
  ...ROUTES.filter((route) => route.path.startsWith('/guia/') && route.path !== '/guia/').map(
    (route) => ({
      path: route.path.replace(/\/$/, ''),
      ...lazyRoute(async () => {
        const { default: GuidePage } = await import('./page/GuidePage')
        const Wrapped = () => <GuidePage slug={slugFromPath(route.path)} />
        return { default: Wrapped }
      })
    })
  )
]

// El blog: el índice y un artículo por entrada.
const blogRoutes: RouteObject[] = [
  {
    path: '/blog',
    ...lazyRoute(() => import('./page/BlogIndexPage'))
  },
  ...ROUTES.filter((route) => route.path.startsWith('/blog/') && route.path !== '/blog/').map(
    (route) => ({
      path: route.path.replace(/\/$/, ''),
      ...lazyRoute(async () => {
        const { default: ArticlePage } = await import('./page/ArticlePage')
        const Wrapped = () => <ArticlePage slug={slugFromPath(route.path)} />
        return { default: Wrapped }
      })
    })
  )
]

export const routes = [
  {
    path: '/',
    element: <Home />,
    HydrateFallback: RouteLoading,
    errorElement: <RouteError />
  },
  {
    path: '/generar-prompt',
    ...lazyRoute(() => import('./page/GeneratorPage'))
  },
  {
    path: '/analizar-prompt',
    ...lazyRoute(() => import('./page/LinterPage'))
  },
  // Alias: las URLs en inglés o escritas a mano no deben acabar en la 404.
  ...ALIAS_ROUTES,
  ...legalRoutes,
  ...guideRoutes,
  ...blogRoutes,
  {
    path: '*',
    ...lazyRoute(() => import('./page/NotFoundPage'))
  }
]

// `import.meta.env.BASE_URL` refleja el `base` de vite.config.js ('/Prompt.com/'),
// por lo que las rutas funcionan igual en dev, en el build y en GitHub Pages.
const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL })

export { createMemoryRouter }

export default router
