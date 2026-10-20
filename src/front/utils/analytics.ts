/**
 * Analítica sin cookies.
 *
 * Solo hay analítica si se definen `VITE_ANALYTICS_URL` y
 * `VITE_ANALYTICS_DOMAIN` (Plausible o cualquier servicio compatible). Si no
 * están, todo esto no hace nada: el sitio no carga ningún script de terceros.
 *
 * Los eventos se envían con la API de Plausible, que es una función en
 * `window.plausible`. El script define un sustituto que encola las llamadas
 * hasta que carga; aquí se replica ese patrón para no perder los eventos que
 * ocurren antes.
 */

/** Función de Plausible (compatible con Umami y servicios alike). */
type PlausibleFn = (event: string, options?: { props?: Record<string, string> }) => void

declare global {
  interface Window {
    plausible?: PlausibleFn
  }
}

/** Nombres de los eventos que se miden. */
export const EVENTS = {
  copyPrompt: 'Copiar prompt',
  copyLink: 'Copiar enlace',
  copyImproved: 'Copiar prompt mejorado',
  useExample: 'Usar un ejemplo',
  tryExample: 'Probar con un ejemplo',
  navigation: 'Navegación'
} as const

/** ¿Hay analítica configurada en este build? */
export const analyticsEnabled = (): boolean =>
  Boolean(import.meta.env.VITE_ANALYTICS_URL && import.meta.env.VITE_ANALYTICS_DOMAIN)

/**
 * Envía un evento a la analítica.
 *
 * Es un no-op si no hay analítica: se puede llamar sin miedo desde cualquier
 * sitio y no rompe nada si el visitante bloquea el script.
 *
 * @param name Nombre del evento.
 * @param props Propiedades opcionales (por ejemplo, desde qué botón).
 */
export const trackEvent = (name: string, props?: Record<string, string>): void => {
  if (typeof window === 'undefined') return
  if (!analyticsEnabled()) return

  if (typeof window.plausible !== 'function') {
    // Sustituto de Plausible: encola las llamadas hasta que el script carga.
    const stub = function (this: unknown, ...args: unknown[]) {
      const queue = (stub as unknown as { q?: unknown[] }).q ?? []
      queue.push(args)
      ;(stub as unknown as { q: unknown[] }).q = queue
    } as unknown as PlausibleFn
    window.plausible = stub
  }

  try {
    window.plausible(name, props ? { props } : undefined)
  } catch {
    // Si la analítica falla, la web sigue funcionando.
  }
}
