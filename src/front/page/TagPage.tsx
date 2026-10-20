import { Link } from 'react-router-dom'
import Navbar from '../Componente/Navbar'
import Footer from '../Componente/Footer'
import useSeo from '../hooks/useSeo'
import { getRouteSeo } from '../data/routeMeta'
import { getArticleTag } from '../data/articles'
import { PATHS } from '../data/paths'
import styles from './ContentPage.module.css'

/**
 * Página de una etiqueta del blog.
 *
 * Una URL por tema («/blog/etiqueta/agentes-de-ia/»). Mientras una etiqueta
 * solo tenga un artículo, la página se marca como `noindex`: no tiene
 * contenido suficiente para merecer un puesto en el buscador. En cuanto haya
 * dos, se publica sola (el catálogo de rutas es la fuente de verdad y hay un
 * test que lo comprueba).
 */
const TagPage = ({ slug }: { slug: string }) => {
  const tag = getArticleTag(slug)

  useSeo({
    ...getRouteSeo(tag?.path ?? '/blog/'),
    noindex: !tag || tag.articles.length < 2
  })

  if (!tag) {
    return (
      <div className="site-bg">
        <Navbar />
        <main className={styles.listPage}>
          <h1 className={styles.listTitle}>Etiqueta no encontrada</h1>
          <p className={styles.listIntro}>
            Esa etiqueta no existe. <Link to={PATHS.blog}>Ver todos los artículos</Link>.
          </p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="site-bg">
      <Navbar />

      <main className={styles.listPage}>
        <nav aria-label="Migas de pan" className={styles.breadcrumb}>
          <Link to={PATHS.home}>Inicio</Link> › <Link to={PATHS.blog}>Blog</Link> ›{' '}
          {tag.label}
        </nav>

        <h1 className={styles.listTitle}>Artículos sobre {tag.label.toLowerCase()}</h1>
        <p className={styles.listIntro}>
          {tag.articles.length === 1
            ? 'Un artículo sobre este tema.'
            : `${tag.articles.length} artículos sobre este tema.`}
        </p>

        <ul className={styles.cards}>
          {tag.articles.map((article) => (
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

        <div className={styles.cta}>
          <Link to={PATHS.blog} className="btn btn-outline">
            Ver todos los artículos
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default TagPage
