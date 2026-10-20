import { Link } from 'react-router-dom'
import Navbar from '../Componente/Navbar'
import Footer from '../Componente/Footer'
import PromptAnatomy from '../Componente/PromptAnatomy'
import useSeo from '../hooks/useSeo'
import { getRouteSeo } from '../data/routeMeta'
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildJsonLdGraph } from '../data/seoData'
import { GUIDE_INDEX_PATH, getGuidePage, type GuidePage } from '../data/guidePages'
import { PATHS } from '../data/paths'
import styles from './ContentPage.module.css'

/** Fecha de publicación de la guía (no cambia: el contenido es editorial). */
const GUIDE_DATE = '2026-10-20'

/**
 * Página de una sección de la guía.
 *
 * Una URL por bloque del prompt: es la página que la gente busca ("cómo
 * escribir el contexto de un prompt") y la que enlaza con el generador y
 * con el analizador.
 *
 * Recibe el slug en vez de la página entera para que el catálogo (con todo
 * el texto) viaje en el chunk perezoso de esta ruta.
 */
const GuidePage = ({ slug }: { slug: string }) => {
  const page = getGuidePage(slug)

  useSeo({
    ...getRouteSeo(page?.path ?? GUIDE_INDEX_PATH),
    jsonLd: page
      ? buildJsonLdGraph([
          buildArticleJsonLd({
            title: page.title,
            description: page.description,
            path: page.path,
            datePublished: GUIDE_DATE,
            section: 'Guía de prompts'
          }),
          buildBreadcrumbJsonLd([
            { name: 'Inicio', path: PATHS.home },
            { name: 'Guía', path: GUIDE_INDEX_PATH },
            { name: page.title, path: page.path }
          ])
        ])
      : undefined
  })

  if (!page) {
    return (
      <div className="site-bg">
        <Navbar />
        <main className={styles.main}>
          <h1 className={styles.title}>Página no encontrada</h1>
          <p className={styles.paragraph}>
            Esa página de la guía no existe. <Link to={GUIDE_INDEX_PATH}>Ver el índice</Link>.
          </p>
        </main>
        <Footer />
      </div>
    )
  }

  const related = page.related
    .map((relatedSlug) => getGuidePage(relatedSlug))
    .filter((relatedPage): relatedPage is GuidePage => Boolean(relatedPage))

  return (
    <div className="site-bg">
      <Navbar />

      <main className={styles.main}>
        <nav aria-label="Migas de pan" className={styles.breadcrumb}>
          <Link to={PATHS.home}>Inicio</Link> › <Link to={GUIDE_INDEX_PATH}>Guía</Link> ›{' '}
          {page.title}
        </nav>

        <article>
          <header className={styles.hero}>
            <h1 className={styles.title}>{page.title}</h1>
            <p className={styles.summary}>{page.summary}</p>
          </header>

          {page.image ? (
            <img
              src={page.image.src}
              srcSet={page.image.srcSet}
              sizes="(max-width: 900px) 92vw, 860px"
              width={page.image.width}
              height={page.image.height}
              alt={page.image.alt}
              loading="lazy"
              decoding="async"
              className={styles.image}
            />
          ) : null}

          {page.criterionId ? <PromptAnatomy current={page.criterionId} /> : null}

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

          {page.template ? (
            <section className={styles.section}>
              <span className={styles.label}>Cómo se escribe</span>
              <pre className={styles.code}>{page.template}</pre>
            </section>
          ) : null}

          {page.example ? (
            <section className={styles.section}>
              <span className={styles.label}>Ejemplo</span>
              <pre className={styles.code}>{page.example}</pre>
            </section>
          ) : null}

          {page.mistakes && page.mistakes.length > 0 ? (
            <section className={styles.section}>
              <div className={styles.mistakes}>
                <h2 className={styles.mistakesTitle}>Errores frecuentes</h2>
                <ul className={styles.list}>
                  {page.mistakes.map((mistake) => (
                    <li key={mistake}>{mistake}</li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          {related.length > 0 ? (
            <nav aria-label="Páginas relacionadas" className={styles.related}>
              <h2 className={styles.relatedTitle}>Sigue con</h2>
              <ul className={styles.relatedList}>
                {related.map((other) => (
                  <li key={other.slug}>
                    <Link to={other.path} className={styles.relatedLink}>
                      {other.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div className={styles.cta}>
            <Link to={PATHS.generator} className="btn btn-primary">
              Generar un prompt
            </Link>
            <Link to={PATHS.linter} className="btn btn-outline">
              Analizar un prompt
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

export default GuidePage
