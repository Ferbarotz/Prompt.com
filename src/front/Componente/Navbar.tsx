import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import styles from './Navbar.module.css'
import { PATHS } from '../data/paths'

const Navbar = () => {
  return (
    <nav aria-label="Navegación principal" className={styles.nav}>
      <Link to="/" className={styles.brand}>
        Prompt.com
      </Link>

      <div className={styles.links}>
        <NavLink
          to={PATHS.guia}
          className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
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

        <NavLink
          to={PATHS.generator}
          className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
        >
          Crear
        </NavLink>

        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Navbar
