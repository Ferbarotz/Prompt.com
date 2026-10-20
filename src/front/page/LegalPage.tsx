import { Link } from 'react-router-dom'
import Navbar from '../Componente/Navbar'
import Footer from '../Componente/Footer'
import useSeo from '../hooks/useSeo'
import { ROUTE_BY_KEY, getRouteSeo } from '../data/routeMeta'
import { LEGAL_PAGES } from '../data/legalContent'
import { PATHS } from '../data/paths'
import styles from './LegalPage.module.css'

/** Propiedades de la plantilla de página legal. */
export interface LegalPageProps {
  /** Clave de la ruta en el catálogo (`avisoLegal`, `privacidad`…). */
  routeKey: string
}

/**
 * Página de contenido legal reutilizable.
 *
 * Recibe la clave de la ruta y busca su contenido en el catálogo: así el
 * texto legal solo se descarga cuando se visita una de estas páginas.
 */
const LegalPage = ({ routeKey }: LegalPageProps) => {
  const route = ROUTE_BY_KEY[routeKey]
  const page = LEGAL_PAGES[routeKey]

  useSeo(getRouteSeo(route?.path ?? PATHS.home))

  return (
    <div className="site-bg">
      <Navbar />
      <main className={styles.main}>
        <article className={styles.article}>
          <h1 className={styles.title}>{page.title}</h1>
          <p className={styles.updated}>
            Última actualización: <time dateTime={page.updated}>{page.updated}</time>
          </p>

          {page.sections.map((section) => (
            <section key={section.heading} className={styles.section}>
              <h2 className={styles.sectionTitle}>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <p className={styles.back}>
            <Link to={PATHS.home}>← Volver al inicio</Link>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  )
}

export default LegalPage
