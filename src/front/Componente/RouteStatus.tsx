import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import styles from './RouteStatus.module.css'
import { PATHS } from '../data/paths'

/**
 * Pantalla de carga de una ruta.
 *
 * Las rutas internas se cargan bajo demanda (`lazy`). Durante la carga
 * inicial, React Router no puede pintar la ruta y renderiza `null`: sin este
 * estado, el visitante ve un hueco en blanco hasta que termina la descarga.
 */
export const RouteLoading = () => {
  /*
   * La región live nace vacía y se rellena un instante después: una región que
   * ya tiene texto al montarse no la anuncian la mayoría de los lectores de
   * pantalla. Se rellena por la DOM (y no con un estado) para no provocar un
   * segundo renderizado solo para esto.
   */
  const regionRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (regionRef.current) regionRef.current.textContent = 'Cargando la página…'
  }, [])

  return (
    <div className={styles.loading}>
      <span className={styles.spinner} aria-hidden="true" />
      <p className={styles.text}>Cargando…</p>
      <p className="sr-only" role="status" aria-live="polite" ref={regionRef} />
    </div>
  )
}

/**
 * Error al cargar una ruta.
 *
 * Si el módulo no se puede descargar (red, extensión bloqueando la petición o
 * versión cacheada), se muestra esto con un botón de recarga en lugar de la
 * pantalla en blanco o de un error interno de React Router.
 *
 * Monta la barra de navegación y el pie: quien llega aquí por un enlace roto
 * necesita poder seguir por la web.
 */
export const RouteError = () => (
  <div className="site-bg">
    <Navbar />

    <main id="contenido" className={styles.error}>
      <div role="alert">
        <h1 className={styles.title}>No se ha podido cargar esta página</h1>
        <p className={styles.text}>
          Es un problema temporal de conexión o de la caché del navegador. Recarga la
          página para intentarlo de nuevo.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Recargar
          </button>
          <Link to={PATHS.home} className="btn btn-outline">
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>

    <Footer />
  </div>
)
