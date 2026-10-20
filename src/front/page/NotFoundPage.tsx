import { Link } from 'react-router-dom'
import Footer from '../Componente/Footer'
import useSeo from '../hooks/useSeo'
import styles from './NotFoundPage.module.css'
import { PATHS } from '../data/paths'

const NotFoundPage = () => {
  useSeo({
    title: 'Página no encontrada',
    description: 'La página que buscas no existe o ha cambiado de dirección.',
    path: '/404/',
    noindex: true
  })

  return (
    <div className="site-bg">
      <div className={styles.wrapper}>
        <main className={styles.main}>
          <span className={styles.code}>404</span>

          <h1 className={styles.title}>No hemos encontrado esta página</h1>

          <p className={styles.text}>
            El enlace puede estar mal escrito o la página ya no existe. Vuelve al inicio
            para seguir aprendiendo a escribir mejores prompts.
          </p>

          <div className={styles.actions}>
            <Link to={PATHS.home} className="btn btn-primary">
              Volver al inicio
            </Link>

            <Link to={PATHS.guia} className={styles.secondary}>
              Ver la guía
            </Link>

            <Link to={PATHS.generator} className={styles.secondary}>
              Crear un prompt
            </Link>

            <Link to={PATHS.linter} className={styles.secondary}>
              Analizar un prompt
            </Link>
          </div>

          <p className={styles.hint}>
            También puedes leer los{' '}
            <Link to={PATHS.blog}>artículos del blog</Link> o escribir en{' '}
            <Link to={PATHS.privacidad}>la política de privacidad</Link>.
          </p>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default NotFoundPage
