/**
 * Datos estructurados (schema.org) del HTML estático.
 *
 * La aplicación genera un JSON-LD más completo en caliente (con las migas de
 * pan y la imagen de cada página). Este archivo genera el suyo para el HTML
 * estático: los buscadores que no ejecutan JavaScript solo ven eso.
 *
 * Cuando la aplicación arranca, sustituye este bloque por el suyo
 * (ver `useSeo`), así que nunca hay dos a la vez.
 */

/** Nombre del sitio. */
const SITE_NAME = 'Prompt.com'

/**
 * Datos estructurados de una ruta.
 *
 * @param {object} route Ruta del catálogo (`src/front/data/routes.json`).
 * @param {string} origin Origen del sitio (sin barra final).
 * @returns {object|null} El JSON-LD de la ruta.
 */
export const buildJsonLd = (route, origin) => {
  const url = `${origin}${route.path}`
  const image = route.og ? `${origin}/og/${route.og.file}.png` : `${origin}/og-image.png`
  const organization = {
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${origin}/`
  }

  // La home: el sitio y la guía, que es un artículo.
  if (route.key === 'home') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          url: `${origin}/`,
          name: SITE_NAME,
          inLanguage: 'es-ES',
          publisher: { ...organization, '@id': `${origin}/#publisher` }
        },
        {
          '@type': 'Article',
          '@id': `${origin}/#article`,
          headline: route.title,
          description: route.description,
          url,
          inLanguage: 'es-ES',
          datePublished: route.lastmod ?? '2026-10-20',
          dateModified: route.lastmod ?? '2026-10-20',
          image,
          author: organization,
          publisher: { ...organization, '@id': `${origin}/#publisher` }
        }
      ]
    }
  }

  // Las dos herramientas: son aplicaciones web.
  if (route.key === 'generator' || route.key === 'linter') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      '@id': `${url}#app`,
      name: route.title,
      url,
      description: route.description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      inLanguage: 'es-ES',
      isAccessibleForFree: true,
      image,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR'
      }
    }
  }

  // La guía y el blog: artículos con imagen (requisito para el resultado
  // enriquecido de Google).
  const esArticulo =
    route.group === 'guide-sections' ||
    route.group === 'guide-blocks' ||
    route.group === 'blog'

  if (esArticulo) {
    const publicado = route.published ?? route.lastmod ?? '2026-10-20'
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: route.title,
      description: route.description,
      url,
      mainEntityOfPage: url,
      inLanguage: 'es-ES',
      articleSection: route.group === 'blog' ? 'Blog' : 'Guía de prompts',
      datePublished: publicado,
      dateModified: route.lastmod ?? publicado,
      image,
      author: organization,
      publisher: organization
    }
  }

  // El resto (índices, etiquetas y páginas legales): una página normal.
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    name: route.title,
    description: route.description,
    url,
    inLanguage: 'es-ES',
    image,
    isPartOf: { '@id': `${origin}/#website` }
  }
}
