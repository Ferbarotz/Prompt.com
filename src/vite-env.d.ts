/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Dominio que se reporta a la analítica sin cookies. */
  readonly VITE_ANALYTICS_DOMAIN?: string
  /** URL del script de analítica (Plausible o compatible). */
  readonly VITE_ANALYTICS_URL?: string
  /** Endpoint del formulario del boletín. */
  readonly VITE_NEWSLETTER_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
