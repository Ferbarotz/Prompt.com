import { Link } from 'react-router-dom'
import Navbar from '../Componente/Navbar'
import Footer from '../Componente/Footer'
import useSeo from '../hooks/useSeo'
import { getRouteSeo } from '../data/routeMeta'
import { GUIDE_INDEX_PATH, GUIDE_PAGES } from '../data/guidePages'
import { PATHS } from '../data/paths'
import styles from './ContentPage.module.css'

/**
 * Índice de la guía.
 *
 * Es el mapa de todo el contenido: las tres secciones de la guía de la home y
 * las ocho páginas de los bloques del prompt. Sirve al visitante para elegir
 * por dónde empezar y a los buscadores para descubrir las páginas internas.
 */
const GuideIndexPage = () => {
  useSeo(getRouteSeo(GUIDE_INDEX_PATH))

  const sections = GUIDE_PAGES.filter((page) => !page.criterionId)
  const criteria = GUIDE_PAGES.filter((page) => page.criterionId)

  return (
    <div className="site-bg">
      <Navbar />

      <main className={styles.listPage}>
        <h1 className={styles.listTitle}>Guía de prompts: todos los bloques, uno a uno</h1>
        <p className={styles.listIntro}>
          Un prompt se construye por bloques. Cada bloque tiene su propia página, con lo que
          hace, cómo se escribe y los errores que más se repiten. Al final de cada una están
          las herramientas para aplicarlo: el generador y el analizador.
        </p>

        <h2 className={styles.groupTitle}>Los fundamentos</h2>
        <ul className={styles.cards}>
          {sections.map((page) => (
            <li key={page.slug}>
              <Link to={page.path} className={styles.card}>
                <span className={styles.cardTitle}>{page.title}</span>
                <span className={styles.cardText}>{page.description}</span>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className={styles.groupTitle}>Los ocho bloques de un prompt</h2>
        <ul className={styles.cards}>
          {criteria.map((page) => (
            <li key={page.slug}>
              <Link to={page.path} className={styles.card}>
                <span className={styles.cardTag}>Bloque</span>
                <span className={styles.cardTitle}>{page.title}</span>
                <span className={styles.cardText}>{page.description}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.cta}>
          <Link to={PATHS.generator} className="btn btn-primary">
            Generar un prompt
          </Link>
          <Link to={PATHS.linter} className="btn btn-outline">
            Analizar un prompt
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default GuideIndexPage
