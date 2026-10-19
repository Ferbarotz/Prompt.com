import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

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
