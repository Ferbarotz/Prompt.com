import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { MAX_AGE_DAYS, clearStored, onDataCleared, readStored, writeStored } from '../utils/storage'

export { MAX_AGE_DAYS }

/** Retardo antes de escribir: evita tocar el disco en cada tecla. */
const WRITE_DELAY = 250

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
 * Cuando se borra, el hook se entera: pone su valor a cero y deja de
 * guardar hasta que el visitante vuelva a escribir. Sin eso, el valor que
 * está en memoria se volvería a escribir al desmontar el componente (al
 * navegar a otra página) y lo borrado reaparecería.
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
  // El valor de partida: es al que se vuelve cuando el visitante borra lo
  // guardado. Se calcula una sola vez, aunque el componente se vuelva a
  // pintar muchas veces.
  const [initial] = useState<T>(() =>
    typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue
  )

  const [value, setValue] = useState<T>(() =>
    options.preferInitial ? initial : readStored<T>(key, initial)
  )

  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latest = useRef(value)
  // Marca el reinicio por un borrado: ese valor no se vuelve a guardar hasta
  // que el visitante cambie algo.
  const cleared = useRef<{ value: T } | null>(null)
  // El primer render no escribe nada por defecto: así una página que solo
  // lee lo guardado no deja una clave nueva en el navegador.
  const firstRun = useRef(true)

  // Guarda el valor poco después del último cambio.
  useEffect(() => {
    latest.current = value

    // Si el valor es el que puso el borrado, no se guarda: lo que el
    // visitante borró no debe volver al almacenamiento.
    if (cleared.current) {
      if (Object.is(cleared.current.value, value)) return
      cleared.current = null
    }

    if (firstRun.current) {
      firstRun.current = false
      if (options.writeOnMount === false) return
    }

    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => writeStored(key, value), WRITE_DELAY)
  }, [key, value, options.writeOnMount])

  // Al desmontar se guarda el valor pendiente: si no, se perdería el último
  // cambio si el visitante navega antes de que expire el retardo.
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current)
      // Si lo último fue un borrado, no se resucita lo que se borró.
      if (cleared.current && Object.is(cleared.current.value, latest.current)) return
      writeStored(key, latest.current)
    },
    [key]
  )

  // Escucha el borrado global: pone el estado a cero y deja de guardar hasta
  // que el visitante vuelva a escribir.
  useEffect(
    () =>
      onDataCleared(() => {
        if (timeout.current) {
          clearTimeout(timeout.current)
          timeout.current = null
        }
        cleared.current = { value: initial }
        // Se actualiza aquí y no solo en el efecto: si el visitante navega
        // justo después de borrar, el valor en memoria ya es el inicial.
        latest.current = initial
        setValue(initial)
      }),
    [initial]
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
  /**
   * Si es `false`, el valor inicial no se guarda hasta que cambie.
   *
   * Lo usa el tema: no tiene sentido dejar la clave en el navegador de
   * alguien que solo ha visitado la web.
   */
  writeOnMount?: boolean
}

/**
 * Borra todo lo que la aplicación ha guardado en este navegador.
 *
 * Lo usa el pie de página ("Borrar los datos guardados"): el visitante puede
 * dejar el navegador como estaba, sin tener que buscarlo en la ajustes del
 * navegador.
 *
 * @returns {boolean} Si se ha borrado algo.
 */
export const clearPersistedState = (): boolean => clearStored()

export default usePersistentState
