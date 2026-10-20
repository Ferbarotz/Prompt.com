/**
 * Etiquetas SEO por ruta, para el HTML estático.
 *
 * La aplicación actualiza las etiquetas en caliente (ver `useSeo`), pero eso
 * solo funciona si el visitante ejecuta JavaScript. Los previews de Slack,
 * WhatsApp, X o Telegram, y algunos buscadores, leen el HTML tal cual: sin
 * esto, la preview de `/generar-prompt/` mostraría el título de la home y la
 * canonical apuntaría a la home (y la página se descartaría como duplicada).
 *
 * Por eso el post-build genera un HTML por ruta con sus propias etiquetas.
 * Las dos versiones salen de los mismos datos (`src/front/data/routes.json`),
 * así que no pueden contradecirse.
 */

/** Marca de inicio del bloque que el post-build sustituye. */
export const SEO_START = '<!-- SEO:START -->'

/** Marca de fin del bloque que el post-build sustituye. */
export const SEO_END = '<!-- SEO:END -->'

/** Bloque completo que se sustituye en el HTML. */
const SEO_BLOCK = new RegExp(`${SEO_START}[\\s\\S]*?${SEO_END}`)

/** Escapa los caracteres que no pueden aparecer en un atributo HTML. */
export const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/**
 * Datos que necesita el bloque SEO de una ruta.
 *
 * @typedef {object} SeoHeadOptions
 * @property {string} title Título de la página, sin el sufijo del sitio.
 * @property {string} description Descripción para buscadores y redes.
 * @property {string} url URL canónica absoluta de la ruta.
 * @property {string} image URL absoluta de la imagen Open Graph.
 * @property {string} [siteName] Nombre del sitio.
 * @property {boolean} [noindex] Impide la indexación (la 404).
 */

/**
 * Genera el bloque de etiquetas SEO de una ruta.
 *
 * Las etiquetas son las mismas que escribe `useSeo` en el navegador, para que
 * quien ejecute JavaScript vea exactamente lo mismo.
 */
export const renderSeoHead = ({
  title,
  description,
  url,
  image,
  siteName = 'Prompt.com',
  noindex = false
}) => {
  const fullTitle = title ? `${title} — ${siteName}` : siteName
  const meta = (attribute, key, content) =>
    `    <meta ${attribute}="${key}" content="${escapeHtml(content)}" />`

  return [
    `    <title>${escapeHtml(fullTitle)}</title>`,
    meta('name', 'description', description),
    ...(noindex ? [] : [`    <link rel="canonical" href="${escapeHtml(url)}" />`]),
    meta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow'),
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', siteName),
    meta('property', 'og:locale', 'es_ES'),
    meta('property', 'og:title', fullTitle),
    meta('property', 'og:description', description),
    meta('property', 'og:url', url),
    meta('property', 'og:image', image),
    meta('property', 'og:image:type', 'image/png'),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('property', 'og:image:alt', fullTitle),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', fullTitle),
    meta('name', 'twitter:description', description),
    meta('name', 'twitter:image', image),
    meta('name', 'twitter:image:alt', fullTitle)
  ].join('\n')
}

/**
 * Sustituye el bloque SEO de un HTML por el de una ruta concreta.
 *
 * Si el HTML no tiene el bloque, falla el build en lugar de publicar un
 * HTML con las etiquetas de otra ruta.
 */
export const replaceSeoBlock = (html, head) => {
  if (!SEO_BLOCK.test(html)) {
    throw new Error(
      'El HTML no contiene el bloque SEO (marcadores SEO:START / SEO:END). Revisa index.html.'
    )
  }
  return html.replace(SEO_BLOCK, `${SEO_START}\n${head}\n    ${SEO_END}`)
}
