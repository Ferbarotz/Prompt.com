/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Dominio que se reporta a la analítica sin cookies. */
  readonly VITE_ANALYTICS_DOMAIN?: string
  /** URL del script de analítica (Plausible o compatible). */
  readonly VITE_ANALYTICS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
