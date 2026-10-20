import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

beforeEach(() => {
  // La aplicación guarda el trabajo del visitante en `localStorage`. Sin
  // limpiarlo, el estado de un test se filtra al siguiente.
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  // `useSeo` escribe en document.head: se limpia para que cada test parta
  // de las mismas etiquetas.
  document.head.querySelectorAll('meta[name="description"], link[rel="canonical"]').forEach((el) => el.remove())
})

// jsdom no implementa la Clipboard API en todos los casos: se define un
// mock para poder probar el botón de copiar.
if (!navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true
  })
}
