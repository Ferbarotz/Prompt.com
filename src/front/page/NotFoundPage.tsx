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
        <main id="contenido" className={styles.main}>
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

            <Link to={PATHS.generator} className={styles.secondary}>
              Crear un prompt
            </Link>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default NotFoundPage
