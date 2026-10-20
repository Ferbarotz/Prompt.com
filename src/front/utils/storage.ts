/**
 * Almacenamiento local del navegador.
 *
 * Todo lo que la web guarda vive en `localStorage`, con un prefijo propio
 * (`prompt-com:`) para no mezclarse con otras aplicaciones del mismo origen.
 * No hay cookies ni datos personales: solo lo que el visitante escribe en su
 * propio navegador.
 *
 * Cada valor se guarda con la fecha en que se escribió, para que caduque a los
 * 30 días (lo que dice la política de privacidad). Lo que caduca se borra al
 * leerlo: no queda ni un rastro en el disco.
 *
 * Este módulo es el único que habla con `localStorage`. Así, el formato (con
 * su envoltorio y su fecha) está en un solo sitio y el script que se ejecuta
 * antes de pintar en `index.html` puede leerlo sin depender de la aplicación.
 */

/** Prefijo de las claves: evita colisiones con otras apps del mismo origen. */
export const STORAGE_PREFIX = 'prompt-com:'

/** Días que se conserva lo guardado antes de caducar. */
export const MAX_AGE_DAYS = 30

/** Milisegundos que dura la caducidad. */
const MAX_AGE_MS = MAX_AGE_DAYS * 24 * 60 * 60 * 1000

/** Formato en el que se guarda un valor (con su fecha). */
export interface StoredValue<T = unknown> {
  /** Versión del formato, por si cambia. */
  v: 1
  /** Momento en que se guardó (epoch en ms). */
  savedAt: number
  /** El valor en sí. */
  value: T
}

/** Clave completa de un valor (con el prefijo de la aplicación). */
export const storageKey = (key: string): string => `${STORAGE_PREFIX}${key}`

/**
 * Lee un valor guardado.
 *
 * Si no existe, está corrupto o ha caducado, devuelve el valor inicial. Un
 * valor caducado se borra al leerlo.
 */
export const readStored = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(storageKey(key))
    if (raw === null) return fallback

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !('savedAt' in parsed)) return fallback

    const stored = parsed as StoredValue<T>
    const age = Date.now() - stored.savedAt
    if (age > MAX_AGE_MS) {
      // Ha caducado: se borra y se empieza de cero.
      window.localStorage.removeItem(storageKey(key))
      return fallback
    }
    return stored.value as T
  } catch {
    return fallback
  }
}

/** Escribe un valor con la fecha de guardado, ignorando los errores. */
export const writeStored = <T,>(key: string, value: T): void => {
  if (typeof window === 'undefined') return
  try {
    const stored: StoredValue<T> = { v: 1, savedAt: Date.now(), value }
    window.localStorage.setItem(storageKey(key), JSON.stringify(stored))
  } catch {
    // Sin almacenamiento no se guarda nada, pero la web sigue funcionando.
  }
}

/**
 * Suscriptores al borrado de los datos guardados.
 *
 * Vaciar `localStorage` no basta: los componentes que tienen el valor en
 * memoria lo volverían a escribir (al cambiar o al desmontarse), y lo que el
 * visitante ha borrado reaparecería. Con esta lista, el borrado les avisa:
 * ponen su estado a cero y se abstienen de guardar nada hasta que el
 * visitante vuelva a escribir.
 */
const clearListeners = new Set<() => void>()

/**
 * Se suscribe al borrado de los datos guardados.
 *
 * @returns La función para cancelar la suscripción.
 */
export const onDataCleared = (listener: () => void): (() => void) => {
  clearListeners.add(listener)
  return () => {
    clearListeners.delete(listener)
  }
}

/**
 * Borra todo lo que la aplicación ha guardado en este navegador.
 *
 * @returns Si se ha borrado algo.
 */
export const clearStored = (): boolean => {
  if (typeof window === 'undefined') return false
  let removed = false
  try {
    const keys = Object.keys(window.localStorage).filter((key) =>
      key.startsWith(STORAGE_PREFIX)
    )
    for (const key of keys) {
      window.localStorage.removeItem(key)
      removed = true
    }
  } catch {
    return false
  }

  // Avisa a los componentes para que no resuciten lo que se ha borrado.
  for (const listener of clearListeners) listener()
  return removed
}
