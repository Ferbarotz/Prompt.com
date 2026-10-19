import { Link, NavLink } from 'react-router-dom'
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
          to={PATHS.linter}
          className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
        >
          Analizar prompt
        </NavLink>

        <Link to={PATHS.generator} className={styles.cta}>
          Crear
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
