import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'

/** Prefijo de las claves: evita colisiones con otras apps del mismo origen. */
const STORAGE_PREFIX = 'prompt-com:'

/** Retardo antes de escribir: evita tocar el disco en cada tecla. */
const WRITE_DELAY = 250

/**
 * Lee un valor guardado.
 *
 * Si no existe, está corrupto o el almacenamiento no está disponible (modo
 * privado, cookies bloqueadas), devuelve el valor inicial sin fallar.
 */
const readStored = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/** Escribe un valor, ignorando los errores de cuota o de almacenamiento. */
const writeStored = (key: string, value: unknown): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Sin almacenamiento no se guarda nada, pero la web sigue funcionando.
  }
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
 * Estado que sobrevive a la recarga del navegador.
 *
 * Sin esto, el visitante que escribe medio prompt y recarga la página pierde
 * el trabajo. El valor se guarda en `localStorage` (no hay cookies ni datos
 * personales: solo lo que el visitante escribe en su propio navegador).
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

export default usePersistentState
