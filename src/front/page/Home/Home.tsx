import { lazy, Suspense, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../Componente/Navbar'
import Footer from '../../Componente/Footer'
import useSeo from '../../hooks/useSeo'
import { GUIDE_SECTIONS } from '../../data/guideSections'
import { HOME_JSON_LD } from '../../data/seoData'
import { getRouteSeo } from '../../data/routeMeta'
import styles from './Home.module.css'
import { PATHS } from '../../data/paths'

// El generador pesa ~25 KB: se carga después del contenido principal para no
// retrasar el LCP de la home.
const PromptGenerator = lazy(() => import('../../Componente/PromptGenerator'))

/** Los colores de acento dependen de la sección, así que se aplican en línea. */
const accentStyle = (accent: string): CSSProperties =>
  ({
    '--section-accent': `${accent}66`,
    '--section-shadow': `0 8px 22px ${accent}1f`,
    '--title-gradient': `linear-gradient(90deg, ${accent} 0%, #b690ff 100%)`
  }) as CSSProperties

const Home = () => {
  useSeo({
    ...getRouteSeo(PATHS.home),
    jsonLd: HOME_JSON_LD
  })

  return (
    <div className="site-bg">
      <Navbar />

      <main id="contenido" className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Guía de prompts: qué son y cómo escribirlos</h1>
          <p className={styles.subtitle}>
            Aprende a interactuar con un modelo de lenguaje y genera prompts
            profesionales listos para usar en segundos.
          </p>
          <div className={styles.heroActions}>
            <Link to={PATHS.generator} className="btn btn-primary">
              Crear un prompt
            </Link>
            <Link to={PATHS.linter} className="btn btn-outline">
              Analizar un prompt
            </Link>
          </div>
        </section>

        <nav aria-label="Índice de la guía">
          <h2 className={styles.tocTitle}>En esta guía</h2>
          <ul className={styles.tocList}>
            {GUIDE_SECTIONS.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className={styles.tocLink}>
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section>
          <article className={styles.card}>
            <div className={styles.cardHeader}>prompt</div>

            <div className={styles.cardBody}>
              {GUIDE_SECTIONS.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-title`}
                  className={styles.section}
                  style={accentStyle(section.accent)}
                >
                  <img
                    src={section.image.src}
                    srcSet={section.image.srcSet}
                    sizes="(max-width: 720px) 92vw, (max-width: 1100px) 46vw, 480px"
                    width={section.image.width}
                    height={section.image.height}
                    alt={section.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className={styles.image}
                  />

                  <h3 id={`${section.id}-title`} className={styles.cardTitle}>
                    {section.title}
                  </h3>

                  <p className={styles.summary}>{section.summary}</p>

                  <ul className={styles.details}>
                    {section.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>

                  <p className={styles.example}>{section.example}</p>
                </section>
              ))}
            </div>
          </article>
        </section>

        <Suspense fallback={<div className={styles.lazySpacer} aria-hidden="true" />}>
          <PromptGenerator />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default Home
