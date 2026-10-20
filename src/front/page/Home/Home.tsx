import { type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../Componente/Navbar'
import Footer from '../../Componente/Footer'
import useSeo from '../../hooks/useSeo'
import { GUIDE_SECTIONS } from '../../data/guideSections'
import { HOME_JSON_LD } from '../../data/seoData'
import { getRouteSeo } from '../../data/routeMeta'
import styles from './Home.module.css'
import { PATHS } from '../../data/paths'

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

      <main className={styles.main}>
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

                  <h2 id={`${section.id}-title`} className={styles.cardTitle}>
                    {section.title}
                  </h2>

                  <p className={styles.summary}>{section.summary}</p>

                  <p className={styles.more}>
                    <Link to={`${PATHS.guia}${section.id}/`}>Leer el bloque completo →</Link>
                  </p>
                </section>
              ))}
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Home
