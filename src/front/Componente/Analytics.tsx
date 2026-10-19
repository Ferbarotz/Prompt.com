import { useEffect } from 'react'

/**
 * Analítica sin cookies y sin datos personales.
 *
 * Solo se carga si se configuran `VITE_ANALYTICS_URL` (el script) y
 * `VITE_ANALYTICS_DOMAIN` (el dominio que se reporta). Por defecto no se
 * carga nada, de modo que el sitio no hace ninguna petición a terceros.
 *
 * Compatible con Plausible y con cualquier servicio que use el mismo
 * esquema de `plausible.io/api/event` (Umami, yFrog, etc.).
 *
 * @see https://plausible.io/docs/script-extended
 */
const Analytics = () => {
  useEffect(() => {
    const scriptUrl = import.meta.env.VITE_ANALYTICS_URL
    const domain = import.meta.env.VITE_ANALYTICS_DOMAIN

    if (!scriptUrl || !domain) return undefined

    const script = document.createElement('script')
    script.defer = true
    script.dataset.domain = domain
    script.src = scriptUrl
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return null
}

export default Analytics
