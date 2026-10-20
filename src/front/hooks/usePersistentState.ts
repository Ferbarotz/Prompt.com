import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'

/** Prefijo de las claves: evita colisiones con otras apps del mismo origen. */
const STORAGE_PREFIX = 'prompt-com:'

/** Retardo antes de escribir: evita tocar el disco en cada tecla. */
const WRITE_DELAY = 250

/** Días que se conserva lo guardado antes de caducar. */
export const MAX_AGE_DAYS = 30

/** Formato en el que se guarda el valor (con su fecha). */
interface StoredValue {
  /** Versión del formato, por si cambia. */
  v: 1
  /** Momento en que se guardó (epoch en ms). */
  savedAt: number
  /** El valor en sí. */
  value: unknown
}

/** Lee un valor guardado. Si no existe, está corrupto o ha caducado, devuelve el inicial. */
const readStored = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !('savedAt' in parsed)) return fallback

    const stored = parsed as StoredValue
    const age = Date.now() - stored.savedAt
    if (age > MAX_AGE_DAYS * 24 * 60 * 60 * 1000) {
      // Ha caducado: se borra y se empieza de cero.
      window.localStorage.removeItem(key)
      return fallback
    }
    return stored.value as T
  } catch {
    return fallback
  }
}

/** Escribe un valor con la fecha de guardado, ignorando los errores. */
const writeStored = (key: string, value: unknown): void => {
  if (typeof window === 'undefined') return
  try {
    const stored: StoredValue = { v: 1, savedAt: Date.now(), value }
    window.localStorage.setItem(key, JSON.stringify(stored))
  } catch {
    // Sin almacenamiento no se guarda nada, pero la web sigue funcionando.
  }
}

/**
 * Estado que sobrevive a la recarga del navegador.
 *
 * Sin esto, el visitante que escribe medio prompt y recarga la página pierde
 * el trabajo. El valor se guarda en `localStorage` (no hay cookies ni datos
 * personales: solo lo que el visitante escribe en su propio navegador).
 *
 * Lo guardado caduca a los 30 días: es lo que dice la política de privacidad.
 * El visitante también puede borrarlo cuando quiera desde el pie de página.
 *
 * El valor inicial puede ser una función, para leer del `localStorage` o de
 * la URL solo cuando hace falta.
 *
 * @param key Clave dentro del espacio de nombres de la aplicación.
 * @param initialValue Valor inicial, o función que lo calcula.
 * @param options Opciones (ver `PersistentStateOptions`).
 */
export const usePersistentState = <T,>(
  key: string,
  initialValue: T | (() => T),
  options: PersistentStateOptions = {}
): [T, Dispatch<SetStateAction<T>>] => {
  const storageKey = `${STORAGE_PREFIX}${key}`
  const [value, setValue] = useState<T>(() => {
    const fallback =
      typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue
    if (options.preferInitial) return fallback
    return readStored(storageKey, fallback)
  })

  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latest = useRef(value)

  // Guarda el valor poco después del último cambio.
  useEffect(() => {
    latest.current = value
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => writeStored(storageKey, value), WRITE_DELAY)
  }, [storageKey, value])

  // Al desmontar se guarda el valor pendiente: si no, se perdería el último
  // cambio si el visitante navega antes de que expire el retardo.
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current)
      writeStored(storageKey, latest.current)
    },
    [storageKey]
  )

  return [value, setValue]
}

/** Opciones del estado persistente. */
export interface PersistentStateOptions {
  /**
   * Si es `true`, el valor inicial tiene prioridad sobre el guardado.
   *
   * Se usa cuando el estado puede venir de fuera (por ejemplo, de una URL
   * compartida): lo que llega en el enlace manda sobre lo que había en el
   * navegador, y a partir de ahí el enlace se convierte en el nuevo estado
   * guardado.
   */
  preferInitial?: boolean
}

/**
 * Borra todo lo que la aplicación ha guardado en este navegador.
 *
 * Lo usa el pie de página ("Borrar los datos guardados"): el visitante puede
 * dejar el navegador como estaba, sin tener que buscarlo en las ajustes del
 * navegador.
 *
 * @returns {boolean} Si se ha borrado algo.
 */
export const clearPersistedState = (): boolean => {
  if (typeof window === 'undefined') return false
  try {
    const keys = Object.keys(window.localStorage).filter((key) =>
      key.startsWith(STORAGE_PREFIX)
    )
    for (const key of keys) window.localStorage.removeItem(key)
    return keys.length > 0
  } catch {
    return false
  }
}

export default usePersistentState
