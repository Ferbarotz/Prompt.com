import { Link } from 'react-router-dom'
import styles from './Footer.module.css'
import { PATHS } from '../data/paths'
import { routesByGroup } from '../data/routeMeta'

interface Column {
  title: string
  links: Array<{ label: string; to: string }>
}

const columns: Column[] = [
  {
    title: 'Herramientas',
    links: [
      { label: 'Generador de prompts', to: PATHS.generator },
      { label: 'Analizador de prompts', to: PATHS.linter },
      { label: 'Blog', to: PATHS.blog }
    ]
  },
  {
    title: 'Guía',
    links: [
      { label: 'Guía de prompts', to: PATHS.guia },
      ...routesByGroup('guide-blocks').map((route) => ({
        label: route.short ?? route.title,
        to: route.path
      }))
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Aviso legal', to: PATHS.avisoLegal },
      { label: 'Política de privacidad', to: PATHS.privacidad },
      { label: 'Política de cookies', to: PATHS.cookies }
    ]
  }
]

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div>
          <p className={styles.brand}>Prompt.com</p>
          <p className={styles.tagline}>
            Aprende a escribir mejores prompts y llévalos a cualquier modelo de
            lenguaje: ChatGPT, Claude, Gemini, Copilot o un LLM local.
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className={styles.columnTitle}>{column.title}</h2>
            <ul className={styles.linkList}>
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Prompt.com</span>
        <span>
          Hecho con <span aria-label="amor">♥</span> para quienes escriben prompts
        </span>
      </div>
    </footer>
  )
}

export default Footer
