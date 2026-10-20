/**
 * Estado del generador en la URL.
 *
 * Un prompt generado es un resultado que la gente quiere compartir (por
 * WhatsApp, por correo, en un ticket). Si el prompt vive solo en la memoria
 * del navegador, compartirlo es copiar y pegar a mano; si vive en la URL, es
 * un enlace.
 *
 * Además, cada prompt compartido es una URL con contenido propio: eso abre
 * la puerta a indexarlas (con el `noindex` adecuado) o, como mínimo, a que el
 * visitante vuelva a la herramienta con lo que estaba haciendo.
 *
 * Los parámetros van en el query:
 *   `t` tipo de tarea · `i` idea · `d` detalles (JSON) · `x` extra
 */

import { PATHS } from './paths'

/** Estado del generador que se puede compartir. */
export interface GeneratorLinkState {
  /** Identificador del tipo de tarea. */
  taskId: string
  /** Idea escrita por el visitante. */
  idea: string
  /** Detalles elegidos, por clave de campo. */
  details: Record<string, string>
  /** Anotaciones libres del paso 3. */
  extra: string
}

/** Longitud máxima del query: por encima, algunos navegadores y servicios lo recortan. */
export const MAX_QUERY_LENGTH = 1200

/** Serializa el estado del generador a un query string. */
export const encodeGeneratorState = (state: GeneratorLinkState): string => {
  const build = (idea: string, details: Record<string, string> | null): string => {
    const params = new URLSearchParams()
    if (state.taskId) params.set('t', state.taskId)
    if (idea) params.set('i', idea)
    if (details && Object.keys(details).length > 0) {
      params.set('d', JSON.stringify(details))
    }
    if (state.extra) params.set('x', state.extra)
    return params.toString()
  }

  const completo = build(state.idea, state.details)
  if (completo.length <= MAX_QUERY_LENGTH) return completo

  // El enlace se ha hecho demasiado largo: primero se recortan los detalles
  // (que son opcionales) y, si sigue largo, la idea.
  const sinDetalles = build(state.idea, null)
  if (sinDetalles.length <= MAX_QUERY_LENGTH) return sinDetalles

  const overhead = sinDetalles.length - state.idea.length
  const ideaRecortada = state.idea.slice(0, Math.max(0, MAX_QUERY_LENGTH - overhead))
  const recortada = build(ideaRecortada, null)
  if (recortada.length <= MAX_QUERY_LENGTH) return recortada

  // Último recurso: se recorta también la idea.
  const overheadFinal = recortada.length - ideaRecortada.length
  return build(
    ideaRecortada.slice(0, Math.max(0, MAX_QUERY_LENGTH - overheadFinal)),
    null
  )
}

/**
 * Lee el estado del generador de un query string.
 *
 * Los parámetros Unknown se ignoran: un enlace manipulado no debe romper la
 * aplicación.
 */
export const decodeGeneratorState = (search: string): Partial<GeneratorLinkState> => {
  const params = new URLSearchParams(search)
  const state: Partial<GeneratorLinkState> = {}

  const taskId = params.get('t')
  if (taskId) state.taskId = taskId

  const idea = params.get('i')
  if (idea) state.idea = idea

  const details = params.get('d')
  if (details) {
    try {
      const parsed: unknown = JSON.parse(details)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        state.details = Object.fromEntries(
          Object.entries(parsed as Record<string, unknown>)
            .filter(([, value]) => typeof value === 'string')
            .map(([key, value]) => [key, value as string])
        )
      }
    } catch {
      // El query está manipulado o corrupto: se ignora.
    }
  }

  const extra = params.get('x')
  if (extra) state.extra = extra

  return state
}

/** Indica si un estado leído de la URL trae algo aprovechable. */
export const hasGeneratorState = (state: Partial<GeneratorLinkState>): boolean =>
  Boolean(state.taskId || state.idea || state.extra || Object.keys(state.details ?? {}).length > 0)

/**
 * URL absoluta que abre el generador con el estado indicado.
 *
 * Siempre apunta a la página del generador (no a la home): así el enlace
 * funciona aunque se haya generado el prompt desde la home.
 */
export const buildShareUrl = (state: GeneratorLinkState): string => {
  const query = encodeGeneratorState(state)
  const base = import.meta.env.BASE_URL
  const path = PATHS.generator.replace(/^\//, '')
  const url = `${window.location.origin}${base}${path}`
  return query ? `${url}?${query}` : url
}
