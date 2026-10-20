import { useEffect, useState } from 'react'
import styles from './ThemeToggle.module.css'

/** Temas disponibles. */
export type Theme = 'dark' | 'light'

/** Clave en `localStorage`. */
export const THEME_STORAGE_KEY = 'prompt-com:theme'

/** Color de la barra del navegador en cada tema. */
const THEME_COLOR: Record<Theme, string> = {
  dark: '#050814',
  light: '#f5f7fc'
}

/** Manifest de la PWA en cada tema (el color de la pantalla de inicio). */
const MANIFEST: Record<Theme, string> = {
  dark: `${import.meta.env.BASE_URL}manifest.webmanifest`,
  light: `${import.meta.env.BASE_URL}manifest-light.webmanifest`
}

/** Aplica el tema al documento y actualiza el color de la barra del navegador. */
export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement
  if (theme === 'light') {
    root.dataset.theme = 'light'
  } else {
    delete root.dataset.theme
  }

  const meta = document.querySelector('meta[name="theme-color"]')
  meta?.setAttribute('content', THEME_COLOR[theme])

  // La PWA instalada toma el color del manifest: se cambia con el tema.
  const manifest = document.querySelector('link[rel="manifest"]')
  manifest?.setAttribute('href', MANIFEST[theme])
}

/** Devuelve el tema guardado (o el oscuro, que es el de la marca). */
export const getStoredTheme = (): Theme => {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

/**
 * Botón para alternar entre el tema oscuro y el claro.
 *
 * La marca es oscura, pero leer la guía entera en fondo oscuro cansa. El
 * tema elegido se guarda en `localStorage` y se aplica antes de pintar la
 * página (script en `index.html`), así que no hay destello al recargar.
 */
const ThemeToggle = () => {
  // El tema se lee al montar: el script de `index.html` ya lo aplicó en el
  // HTML, así que no hay destello, y aquí solo hace falta saber cuál es para
  // pintar el botón.
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme())

  // Sincroniza el documento con el estado (el atributo `data-theme` y el
  // color de la barra del navegador).
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Sin almacenamiento, el tema dura lo que dura la pestaña.
    }
  }

  const label = theme === 'light' ? 'Cambiar al tema oscuro' : 'Cambiar al tema claro'

  return (
    <button
      type="button"
      onClick={toggle}
      className={styles.toggle}
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
    </button>
  )
}

export default ThemeToggle
