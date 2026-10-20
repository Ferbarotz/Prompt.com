import { Link } from 'react-router-dom'
import Navbar from '../Componente/Navbar'
import Footer from '../Componente/Footer'
import useSeo from '../hooks/useSeo'
import { getRouteSeo } from '../data/routeMeta'
import { ARTICLES, ARTICLE_TAGS } from '../data/articles'
import { BLOG_INDEX_PATH } from './ArticlePage'
import { PATHS } from '../data/paths'
import styles from './ContentPage.module.css'

/**
 * Índice del blog.
 *
 * Los artículos cubren lo que no cabe en la guía: casos concretos, flujos de
 * trabajo y errores reales.
 */
const BlogIndexPage = () => {
  useSeo(getRouteSeo(BLOG_INDEX_PATH))

  return (
    <div className="site-bg">
      <Navbar />

      <main className={styles.listPage}>
        <h1 className={styles.listTitle}>Blog: prompts en el trabajo real</h1>
        <p className={styles.listIntro}>
          Casos concretos, flujos de trabajo y errores que se repiten. Cada artículo va al grano,
          con ejemplos de prompts que se pueden copiar y adaptar.
        </p>

        <ul className={styles.cards}>
          {ARTICLES.map((article) => (
            <li key={article.slug}>
              <Link to={article.path} className={styles.card}>
                <span className={styles.cardTag}>{article.tags[0]}</span>
                <span className={styles.cardTitle}>{article.title}</span>
                <span className={styles.cardText}>{article.description}</span>
                <span className={styles.meta}>
                  <time dateTime={article.date}>{article.date}</time> · {article.minutes} min
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {ARTICLE_TAGS.length > 0 ? (
          <>
            <h2 className={styles.groupTitle}>Por tema</h2>
            <ul className={styles.relatedList}>
              {ARTICLE_TAGS.map((tag) => (
                <li key={tag.slug}>
                  <Link to={tag.path} className={styles.relatedLink}>
                    {tag.label} ({tag.articles.length})
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : null}

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

export default BlogIndexPage
