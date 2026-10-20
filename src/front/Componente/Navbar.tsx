import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import styles from './Navbar.module.css'
import { PATHS } from '../data/paths'

const Navbar = () => {
  return (
    <>
      {/* Acceso rápido al contenido: es lo primero que encuentra quien navega
          con teclado o lector de pantalla. */}
      <a href="#contenido" className="skipLink">
        Saltar al contenido
      </a>

      <nav aria-label="Navegación principal" className={styles.nav}>
        <Link to="/" className={styles.brand}>
          Prompt.com
        </Link>

        <div className={styles.links}>
          <NavLink
            to={PATHS.home}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
            end
          >
            Guía
          </NavLink>

          <NavLink
            to={PATHS.linter}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
          >
            Analizar prompt
          </NavLink>

          <NavLink
            to={PATHS.blog}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
          >
            Blog
          </NavLink>

          <Link to={PATHS.generator} className={styles.cta}>
            Crear
          </Link>

          <ThemeToggle />
        </div>
      </nav>
    </>
  )
}

export default Navbar
