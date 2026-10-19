import { describe, expect, it } from 'vitest'
import { PATHS, PUBLIC_PATHS } from './paths'
import { routes } from '../router'
import { LEGAL_PAGES } from './legalContent'

describe('rutas públicas', () => {
  it('todas terminan en barra final (excepto la home)', () => {
    for (const path of Object.values(PATHS)) {
      expect(path).toMatch(/\/$/)
    }
  })

  it('la home es la raíz', () => {
    expect(PATHS.home).toBe('/')
  })

  it('cada ruta del router tiene su carpeta en el sitemap', () => {
    const routePaths = routes
      .map((route) => `/${String(route.path).replace(/^\//, '')}/`)
      .filter((path) => path !== '//')

    for (const path of routePaths) {
      // La ruta comodín (*) no se publica.
      if (path === '/*/') continue
      expect(PUBLIC_PATHS).toContain(path)
    }
  })

  it('las páginas legales del catálogo están en el sitemap', () => {
    for (const slug of Object.keys(LEGAL_PAGES)) {
      expect(PUBLIC_PATHS).toContain(`/${slug}/`)
    }
  })

  it('no hay rutas duplicadas en el sitemap', () => {
    expect(new Set(PUBLIC_PATHS).size).toBe(PUBLIC_PATHS.length)
  })
})
