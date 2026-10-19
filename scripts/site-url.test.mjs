import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import {
  getBase,
  getCustomDomain,
  getDeployment,
  getSiteOrigin,
  absoluteUrl
} from './site-url.mjs'

/** Variables de entorno que se manipulan en cada test. */
const ENTORNO = [
  'CUSTOM_DOMAIN',
  'SITE_URL',
  'GITHUB_REPOSITORY',
  'CF_PAGES',
  'CF_PAGES_URL',
  'VERCEL',
  'VERCEL_URL',
  'VERCEL_PROJECT_PRODUCTION_URL'
]
let guardados = {}

beforeEach(() => {
  guardados = {}
  for (const clave of ENTORNO) {
    guardados[clave] = process.env[clave]
    delete process.env[clave]
  }
  // Sin remoto ni repositorio, el origen por defecto es el de desarrollo.
  process.env.GITHUB_REPOSITORY = 'Ferbarotz/Prompt.com'
})

afterEach(() => {
  for (const clave of ENTORNO) {
    if (guardados[clave] === undefined) delete process.env[clave]
    else process.env[clave] = guardados[clave]
  }
})

describe('dominio propio', () => {
  it('sin dominio propio, el sitio se publica bajo el nombre del repositorio', () => {
    expect(getCustomDomain()).toBe('')
    expect(getBase()).toBe('/Prompt.com/')
    expect(getSiteOrigin()).toBe('https://ferbarotz.github.io/Prompt.com')
  })

  it('con dominio propio, el sitio va en la raíz del dominio', () => {
    process.env.CUSTOM_DOMAIN = 'prompt.com'

    expect(getCustomDomain()).toBe('prompt.com')
    expect(getBase()).toBe('/')
    expect(getSiteOrigin()).toBe('https://prompt.com')
  })

  it('normaliza el dominio: quita protocolo y barra final', () => {
    process.env.CUSTOM_DOMAIN = 'https://www.prompt.com/'

    expect(getCustomDomain()).toBe('www.prompt.com')
    expect(getSiteOrigin()).toBe('https://www.prompt.com')
  })

  it('el dominio propio manda sobre SITE_URL', () => {
    process.env.CUSTOM_DOMAIN = 'prompt.com'
    process.env.SITE_URL = 'https://otro.example'

    expect(getSiteOrigin()).toBe('https://prompt.com')
  })

  it('SITE_URL cambia el origen pero no el base', () => {
    process.env.SITE_URL = 'https://otro.example/'

    expect(getBase()).toBe('/Prompt.com/')
    expect(getSiteOrigin()).toBe('https://otro.example')
  })

  it('construye URLs absolutas con el origen resuelto', () => {
    process.env.CUSTOM_DOMAIN = 'prompt.com'

    expect(absoluteUrl('/')).toBe('https://prompt.com')
    expect(absoluteUrl('/generar-prompt/')).toBe('https://prompt.com/generar-prompt')
  })
})

describe('hosting en la raíz del dominio', () => {
  it('Cloudflare Pages se detecta solo', () => {
    process.env.CF_PAGES = '1'
    process.env.CF_PAGES_URL = 'https://prompt-com.pages.dev/'

    expect(getDeployment()).toBe('cloudflare')
    expect(getBase()).toBe('/')
    expect(getSiteOrigin()).toBe('https://prompt-com.pages.dev')
  })

  it('Vercel se detecta solo y usa el dominio de producción', () => {
    process.env.VERCEL = '1'
    process.env.VERCEL_URL = 'prompt-com-abc123.vercel.app'
    process.env.VERCEL_PROJECT_PRODUCTION_URL = 'prompt-com.vercel.app'

    expect(getDeployment()).toBe('vercel')
    expect(getBase()).toBe('/')
    expect(getSiteOrigin()).toBe('https://prompt-com.vercel.app')
  })

  it('Vercel sin dominio de producción usa el del despliegue', () => {
    process.env.VERCEL = '1'
    process.env.VERCEL_URL = 'prompt-com-abc123.vercel.app'

    expect(getSiteOrigin()).toBe('https://prompt-com-abc123.vercel.app')
  })

  it('el dominio propio manda sobre la detección de hosting', () => {
    process.env.CUSTOM_DOMAIN = 'prompt.com'
    process.env.CF_PAGES = '1'
    process.env.CF_PAGES_URL = 'https://prompt-com.pages.dev'

    expect(getDeployment()).toBe('custom')
    expect(getBase()).toBe('/')
    expect(getSiteOrigin()).toBe('https://prompt.com')
  })
})
