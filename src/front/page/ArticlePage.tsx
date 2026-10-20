import { Link } from 'react-router-dom'
import Navbar from '../Componente/Navbar'
import Footer from '../Componente/Footer'
import useSeo from '../hooks/useSeo'
import { getRouteSeo } from '../data/routeMeta'
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildJsonLdGraph } from '../data/seoData'
import { getArticle, tagSlug } from '../data/articles'
import { getGuidePage } from '../data/guidePages'
import { assetUrl } from '../utils/siteUrl'
import { PATHS } from '../data/paths'
import styles from './ContentPage.module.css'

/** Ruta del índice del blog. */
export const BLOG_INDEX_PATH = '/blog/'

/** Ruta de la página de una etiqueta del blog. */
const tagPath = (label: string): string => `/blog/etiqueta/${tagSlug(label)}/`

/**
 * Página de un artículo del blog.
 *
 * Los artículos cubren lo que no cabe en la guía: casos concretos, flujos de
 * trabajo y errores reales. Cada uno tiene su URL, sus datos estructurados y
 * su entrada en el sitemap.
 *
 * Recibe el slug en vez del artículo entero para que el texto viaje en el
 * chunk perezoso de esta ruta.
 */
const ArticlePage = ({ slug }: { slug: string }) => {
  const article = getArticle(slug)

  useSeo({
    ...getRouteSeo(article?.path ?? BLOG_INDEX_PATH),
    // Un artículo del blog es un `article` de Open Graph, no una web: sin
    // esto, las redes lo muestran como una página más y pierden la fecha.
    type: 'article',
    jsonLd: article
      ? buildJsonLdGraph([
          buildArticleJsonLd({
            title: article.title,
            description: article.description,
            path: article.path,
            datePublished: article.date,
            section: article.tags[0] ?? 'Blog',
            image: assetUrl(`og/blog/${article.slug}.png`),
            wordCount: article.sections.reduce(
              (total, section) => total + section.paragraphs.join(' ').split(/\s+/).length,
              0
            )
          }),
          buildBreadcrumbJsonLd([
            { name: 'Inicio', path: PATHS.home },
            { name: 'Blog', path: BLOG_INDEX_PATH },
            { name: article.title, path: article.path }
          ])
        ])
      : undefined
  })

  if (!article) {
    return (
      <div className="site-bg">
        <Navbar />
        <main id="contenido" className={styles.main}>
          <h1 className={styles.title}>Artículo no encontrado</h1>
          <p className={styles.paragraph}>
            Ese artículo no existe. <Link to={BLOG_INDEX_PATH}>Ver todos los artículos</Link>.
          </p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="site-bg">
      <Navbar />

      <main id="contenido" className={styles.main}>
        <nav aria-label="Migas de pan" className={styles.breadcrumb}>
          <Link to={PATHS.home}>Inicio</Link> › <Link to={BLOG_INDEX_PATH}>Blog</Link> ›{' '}
          {article.title}
        </nav>

        <article>
          <header className={styles.hero}>
            <h1 className={styles.title}>{article.title}</h1>
            <p className={styles.summary}>{article.description}</p>
            <p className={styles.meta}>
              <time dateTime={article.date}>{article.date}</time> · {article.minutes} min de
              lectura ·{' '}
              {article.tags.map((tag, index) => (
                <span key={tag}>
                  {index > 0 ? ' · ' : ''}
                  <Link to={tagPath(tag)}>{tag}</Link>
                </span>
              ))}
            </p>
          </header>

          {article.sections.map((section) => (
            <section key={section.heading} className={styles.section}>
              <h2 className={styles.sectionTitle}>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          {article.takeaways && article.takeaways.length > 0 ? (
            <section className={styles.section}>
              <div className={styles.mistakes}>
                <h2 className={styles.mistakesTitle}>En corto</h2>
                <ul className={styles.list}>
                  {article.takeaways.map((takeaway) => (
                    <li key={takeaway}>{takeaway}</li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          {/* Los bloques de la guía de los que habla el artículo: el blog y la
              guía se apuntan el uno al otro. */}
          {article.blocks.length > 0 ? (
            <nav aria-label="Bloques de la guía" className={styles.related}>
              <h2 className={styles.relatedTitle}>Los bloques de la guía</h2>
              <ul className={styles.relatedList}>
                {article.blocks.map((slug) => {
                  const bloque = getGuidePage(slug)
                  if (!bloque) return null
                  return (
                    <li key={slug}>
                      <Link to={bloque.path} className={styles.relatedLink}>
                        {bloque.title}
                      </Link>
                    </li>
                  )
                })}
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

export default ArticlePage
