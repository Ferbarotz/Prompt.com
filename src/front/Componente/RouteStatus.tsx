import styles from './RouteStatus.module.css'

/**
 * Pantalla de carga de una ruta.
 *
 * Las rutas internas se cargan bajo demanda (`lazy`). Durante la carga
 * inicial, React Router no puede pintar la ruta y renderiza `null`: sin este
 * estado, el visitante ve un hueco en blanco hasta que termina la descarga.
 */
export const RouteLoading = () => (
  <div className={styles.loading} role="status" aria-live="polite">
    <span className={styles.spinner} aria-hidden="true" />
    <p className={styles.text}>Cargando…</p>
  </div>
)

/**
 * Error al cargar una ruta.
 *
 * Si el módulo no se puede descargar (red, extensión bloqueando la petición o
 * versión cacheada), se muestra esto con un botón de recarga en lugar de la
 * pantalla en blanco o de un error interno de React Router.
 */
export const RouteError = () => (
  <div className={styles.error} role="alert">
    <h1 className={styles.title}>No se ha podido cargar esta página</h1>
    <p className={styles.text}>
      Es un problema temporal de conexión o de la caché del navegador. Recarga la
      página para intentarlo de nuevo.
    </p>
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => window.location.reload()}
    >
      Recargar
    </button>
  </div>
)
