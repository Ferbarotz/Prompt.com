import { describe, expect, it } from 'vitest'
import { PATHS, PUBLIC_PATHS } from './paths'
import { ALIASES, ROUTES, ROUTE_BY_KEY, getRouteByPath, getRouteSeo } from './routeMeta'
import { LEGAL_PAGES } from './legalContent'

describe('catálogo de rutas', () => {
  it('cada ruta tiene URL, título y descripción', () => {
    for (const route of ROUTES) {
      expect(route.path).toBeTruthy()
      expect(route.title.length).toBeGreaterThan(5)
      expect(route.description.length).toBeGreaterThan(40)
      expect(route.changefreq).toBeTruthy()
      expect(route.priority).toBeTruthy()
    }
  })

  it('las URLs terminan en barra final', () => {
    for (const route of ROUTES) {
      expect(route.path.endsWith('/')).toBe(true)
    }
  })

  it('las claves son únicas', () => {
    expect(new Set(ROUTES.map((route) => route.key)).size).toBe(ROUTES.length)
  })

  it('PATHS sale del catálogo', () => {
    expect(PATHS.home).toBe(ROUTE_BY_KEY.home.path)
    expect(PATHS.generator).toBe(ROUTE_BY_KEY.generator.path)
    expect(PATHS.linter).toBe(ROUTE_BY_KEY.linter.path)
    expect(PUBLIC_PATHS).toEqual(ROUTES.map((route) => route.path))
  })

  it('encuentra una ruta con o sin barra final', () => {
    expect(getRouteByPath('/generar-prompt/')?.key).toBe('generator')
    expect(getRouteByPath('/generar-prompt')?.key).toBe('generator')
    expect(getRouteByPath('/no-existe')).toBeUndefined()
  })

  it('devuelve metadatos por ruta', () => {
    expect(getRouteSeo('/analizar-prompt/').title).toBe(ROUTE_BY_KEY.linter.title)
    // Una ruta desconocida cae en la home en lugar de dejar sin etiquetas.
    expect(getRouteSeo('/no-existe').title).toBe(ROUTE_BY_KEY.home.title)
  })

  it('las páginas legales tienen sus metadatos en el catálogo', () => {
    for (const key of Object.keys(LEGAL_PAGES)) {
      const route = ROUTE_BY_KEY[key]
      expect(route).toBeDefined()
      expect(LEGAL_PAGES[key].title).toBe(route.title)
      expect(LEGAL_PAGES[key].description).toBe(route.description)
    }
  })

  it('los alias apuntan a rutas que existen', () => {
    for (const alias of ALIASES) {
      expect(ROUTE_BY_KEY[alias.target]).toBeDefined()
      expect(alias.path.endsWith('/')).toBe(true)
    }
  })
})
