import { describe, expect, it, vi } from 'vitest'
import { EVENTS, analyticsEnabled, trackEvent } from './analytics'

describe('analítica sin cookies', () => {
  it('sin variables de entorno no hay analítica', () => {
    expect(analyticsEnabled()).toBe(false)
  })

  it('sin analítica, enviar un evento no hace nada', () => {
    const plausible = vi.fn()
    Object.defineProperty(window, 'plausible', { value: plausible, configurable: true })

    trackEvent(EVENTS.copyPrompt)

    expect(plausible).not.toHaveBeenCalled()
  })

  it('con analítica, el evento se envía con sus propiedades', () => {
    vi.stubEnv('VITE_ANALYTICS_URL', 'https://plausible.io/js/script.js')
    vi.stubEnv('VITE_ANALYTICS_DOMAIN', 'prompt.com')

    const plausible = vi.fn()
    Object.defineProperty(window, 'plausible', { value: plausible, configurable: true })

    trackEvent(EVENTS.copyPrompt, { tipo: 'video' })

    expect(plausible).toHaveBeenCalledWith('Copiar prompt', { props: { tipo: 'video' } })

    vi.unstubAllEnvs()
  })

  it('si el script no ha cargado, el evento se encola', () => {
    vi.stubEnv('VITE_ANALYTICS_URL', 'https://plausible.io/js/script.js')
    vi.stubEnv('VITE_ANALYTICS_DOMAIN', 'prompt.com')
    // Se borra a propósito para simular el script sin cargar.
    Reflect.deleteProperty(window, 'plausible')

    trackEvent(EVENTS.copyLink)

    expect(typeof window.plausible).toBe('function')
    // El sustituto guarda la llamada en su cola.
    expect((window.plausible as unknown as { q: unknown[] }).q.length).toBe(1)

    vi.unstubAllEnvs()
  })

  it('los nombres de evento son los esperados', () => {
    expect(EVENTS.copyPrompt).toBe('Copiar prompt')
    expect(EVENTS.copyLink).toBe('Copiar enlace')
    expect(EVENTS.navigation).toBe('Navegación')
  })
})
