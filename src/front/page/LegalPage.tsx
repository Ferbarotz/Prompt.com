import { Link } from 'react-router-dom'
import Navbar from '../Componente/Navbar'
import Footer from '../Componente/Footer'
import useSeo from '../hooks/useSeo'
import { ROUTE_BY_KEY, getRouteSeo } from '../data/routeMeta'
import { LEGAL_PAGES, OWNER_WARNING, siteOwnerIncomplete } from '../data/legalContent'
import { PATHS } from '../data/paths'
import { analyticsEnabled } from '../utils/analytics'
import styles from './LegalPage.module.css'

/** Proveedor de analítica sin cookies (Plausible o compatible). */
const ANALYTICS_PROVIDER = 'Plausible'

/** Enlace para renunciar a la analítica (lo ofrece el propio proveedor). */
const ANALYTICS_OPTOUT = 'https://plausible.io/usage'

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
 *
 * El apartado de analítica solo aparece si la hay activada en este build: el
 * texto legal describe lo que la web hace de verdad, no lo que podría llegar
 * a hacer.
 */
const LegalPage = ({ routeKey }: LegalPageProps) => {
  const route = ROUTE_BY_KEY[routeKey]
  const page = LEGAL_PAGES[routeKey]
  const conAnalitica = analyticsEnabled()

  useSeo(getRouteSeo(route?.path ?? PATHS.home))

  return (
    <div className="site-bg">
      <Navbar />
      <main id="contenido" className={styles.main}>
        <article className={styles.article}>
          <h1 className={styles.title}>{page.title}</h1>
          <p className={styles.updated}>
            Última actualización: <time dateTime={page.updated}>{page.updated}</time>
          </p>

          {/* Si faltan datos del titular, se avisa en la propia página: los
              textos legales no pueden publicarse con marcadores de posición
              sin que se note. */}
          {siteOwnerIncomplete() ? (
            <p className={styles.warning} role="note">
              {OWNER_WARNING}
            </p>
          ) : null}

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

          {conAnalitica && routeKey === 'privacidad' ? (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Analítica sin cookies</h2>
              <p className={styles.paragraph}>
                Para saber qué páginas se usan y cuáles no, este sitio cuenta las visitas con{' '}
                {ANALYTICS_PROVIDER}, una analítica sin cookies ni datos personales. No
                guarda tu dirección IP, no usa cookies, no crea perfiles y no permite
                identificarte: solo cuenta visitas a cada página en forma agregada.
              </p>
              <p className={styles.paragraph}>
                Los datos se envían a {ANALYTICS_PROVIDER} como processor y se conservan
                de forma agregada. Puedes renunciar al conteo en cualquier momento
                desde su <a href={ANALYTICS_OPTOUT}>página de exclusión</a> o bloqueando
                el script de analítica en tu navegador.
              </p>
            </section>
          ) : null}

          {conAnalitica && routeKey === 'cookies' ? (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Analítica sin cookies</h2>
              <p className={styles.paragraph}>
                El conteo de visitas se hace con {ANALYTICS_PROVIDER}, que no utiliza
                cookies ni guarda identificadores en tu navegador: no hay banner de
                consentimiento porque no hay cookies que consentir. Puedes excluir tu
                navegación desde su <a href={ANALYTICS_OPTOUT}>página de exclusión</a>.
              </p>
            </section>
          ) : null}

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
