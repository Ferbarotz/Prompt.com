import { Link, NavLink, useNavigation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import styles from './Navbar.module.css'
import { PATHS } from '../data/paths'
import { EVENTS, trackEvent } from '../utils/analytics'

/**
 * Estado de la navegación actual.
 *
 * `useNavigation` solo existe dentro de un router de datos (el que usa la
 * aplicación). Con un `<MemoryRouter>` normal —como en los tests— no hay
 * estado de navegación: se devuelve "idle" y no se muestra la barra.
 */
const useNavigationState = (): string => {
  try {
    return useNavigation().state
  } catch {
    return 'idle'
  }
}

const Navbar = () => {
  // Las rutas se cargan bajo demanda: durante una navegación React Router
  // mantiene la página anterior en pantalla hasta que descarga el módulo.
  // La barra de progreso dice que algo está pasando.
  const cargando = useNavigationState() === 'loading'

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>

      {cargando ? (
        <div className={styles.progress} aria-hidden="true">
          <span className={styles.progressBar} />
        </div>
      ) : null}

      <nav aria-label="Navegación principal" className={styles.nav}>
        <Link to="/" className={styles.brand}>
          Prompt.com
        </Link>

        <div className={styles.links}>
          <NavLink
            to={PATHS.guia}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
            onClick={() => trackEvent(EVENTS.navigation, { destino: 'Guía' })}
          >
            Guía
          </NavLink>

          <NavLink
            to={PATHS.linter}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
            onClick={() => trackEvent(EVENTS.navigation, { destino: 'Analizador' })}
          >
            Analizar prompt
          </NavLink>

          <NavLink
            to={PATHS.blog}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
            onClick={() => trackEvent(EVENTS.navigation, { destino: 'Blog' })}
          >
            Blog
          </NavLink>

          <NavLink
            to={PATHS.generator}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
            onClick={() => trackEvent(EVENTS.navigation, { destino: 'Generador' })}
          >
            Crear
          </NavLink>

          <ThemeToggle />
        </div>
      </nav>
    </>
  )
}

export default Navbar
