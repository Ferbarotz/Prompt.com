/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Dominio que se reporta a la analítica sin cookies. */
  readonly VITE_ANALYTICS_DOMAIN?: string
  /** URL del script de analítica (Plausible o compatible). */
  readonly VITE_ANALYTICS_URL?: string
  /** Nombre con el que se identifica el sitio en los textos legales. */
  readonly VITE_SITE_OWNER_NAME?: string
  /** Nombre legal o razón social del titular del sitio. */
  readonly VITE_SITE_OWNER_LEGAL_NAME?: string
  /** NIF, NIE o CIF del titular del sitio. */
  readonly VITE_SITE_OWNER_TAX_ID?: string
  /** Dirección fiscal del titular del sitio. */
  readonly VITE_SITE_OWNER_ADDRESS?: string
  /** Correo de contacto del titular del sitio. */
  readonly VITE_SITE_OWNER_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
