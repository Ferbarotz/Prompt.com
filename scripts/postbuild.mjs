/**
 * Pasos de post-build que dependen del resultado de `vite build`.
 *
 *   node scripts/postbuild.mjs
 *
 *  1. Copia `index.html` a `404.html`. GitHub Pages no tiene rewrite de
 *     rutas, así que una URL interna (`/Prompt.com/generar-prompt`) se sirve
 *     con el 404. Al copiar el index, la SPA arranca directamente en esa URL:
 *     el router resuelve la ruta y no hace falta redirigir ni recargar la
 *     aplicación entera.
 *  2. Genera un HTML por ruta con sus propias etiquetas SEO (título,
 *     canonical y Open Graph). Esos datos los aplica la aplicación en
 *     caliente, pero un preview de Slack o un buscador que no ejecuta
 *     JavaScript solo ve el HTML: sin esto, todas las rutas se presentarían
 *     como la home y la canonical apuntaría a la home.
 *  3. Genera `sitemap.xml` y `robots.txt` con la URL real del sitio.
 *
 * Las rutas y sus metadatos salen de `src/front/data/routes.json`, el mismo
 * catálogo que usa la aplicación.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { getCustomDomain, getSiteOrigin } from './site-url.mjs'
import { renderSeoHead, replaceSeoBlock } from './seo-head.mjs'
import { renderOgImage } from './og-images.mjs'

const distDir = path.resolve('dist')

/** Catálogo de rutas y metadatos SEO (compartido con la aplicación). */
const routesFile = new URL('../src/front/data/routes.json', import.meta.url)
const { routes: ROUTES, aliases: ALIASES } = JSON.parse(await fs.readFile(routesFile, 'utf8'))

/** Rutas indexadas por su clave. */
const ROUTE_BY_KEY = Object.fromEntries(ROUTES.map((route) => [route.key, route]))

/** Fecha del último commit, como `lastmod` del sitemap. */
const getLastModified = () => {
  try {
    const date = execSync('git log -1 --format=%cI', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    }).trim()
    return date ? date.slice(0, 10) : new Date().toISOString().slice(0, 10)
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

/**
 * Etiquetas SEO de una ruta.
 *
 * `url` es la URL canónica absoluta y `image` la imagen Open Graph, que es
 * propia de cada ruta cuando la tiene (`dist/og/<fichero>.png`).
 */
const headFor = (route, origin) =>
  renderSeoHead({
    title: route.title,
    description: route.description,
    url: `${origin}${route.path}`,
    image: `${origin}${route.og ? `/og/${route.og.file}.png` : '/og-image.png'}`
  })

/**
 * Genera las imágenes Open Graph de las rutas que las tienen.
 *
 * Una tarjeta de 1200×630 por ruta (guía y artículos): sin esto, todos los
 * enlaces se verían igual en Slack, WhatsApp o X.
 */
const buildOgImages = async () => {
  const withOg = ROUTES.filter((route) => route.og)
  if (withOg.length === 0) return

  for (const route of withOg) {
    const file = path.join(distDir, 'og', `${route.og.file}.png`)
    await fs.mkdir(path.dirname(file), { recursive: true })
    const png = await renderOgImage({ title: route.title, kicker: route.og.kicker })
    await fs.writeFile(file, png)
  }
  console.log(`· dist/og/ — ${withOg.length} imágenes Open Graph`)
}

/**
 * `index.html` → `404.html` y a una carpeta por ruta.
 *
 * GitHub Pages no tiene rewrite de rutas: una URL interna que no exista como
 * fichero se sirve con el 404. Para que el crawler reciba un 200 (y no
 * descarte la URL del sitemap) cada ruta tiene su carpeta con su `index.html`,
 * que Pages sirve con un 200 y con barra final.
 *
 * Cada copia lleva las etiquetas SEO de su ruta: es el HTML que ven los
 * previews de las redes y los buscadores que no ejecutan JavaScript.
 */
const buildSpaFallback = async (origin) => {
  const html = await fs.readFile(path.join(distDir, 'index.html'), 'utf8')

  // La 404 no se indexa: no debe heredar la canonical de la home.
  const notFound = replaceSeoBlock(
    html,
    renderSeoHead({
      title: ROUTE_BY_KEY.home.title,
      description: ROUTE_BY_KEY.home.description,
      url: `${origin}${ROUTE_BY_KEY.home.path}`,
      image: `${origin}/og-image.png`,
      noindex: true
    })
  )
  await fs.writeFile(path.join(distDir, '404.html'), notFound, 'utf8')
  console.log('· dist/404.html — copia de index.html (fallback SPA, noindex)')

  for (const route of ROUTES) {
    const page = replaceSeoBlock(html, headFor(route, origin))
    if (route.path === '/') {
      // La home es el index original: sus etiquetas ya son las suyas.
      await fs.writeFile(path.join(distDir, 'index.html'), page, 'utf8')
      continue
    }
    const directory = path.join(distDir, route.path.replace(/^\/|\/$/g, ''))
    await fs.mkdir(directory, { recursive: true })
    await fs.writeFile(path.join(directory, 'index.html'), page, 'utf8')
    console.log(`· dist${route.path}index.html — ruta con respuesta 200`)
  }

  // Alias de URL: carpetas con `index.html` pero sin publicar en el sitemap.
  // Son redirecciones en el router (ver `ALIAS_ROUTES` en `src/front/router.tsx`).
  // La carpeta hace que Pages las sirva con un 200 en lugar del 404 del
  // fallback SPA, aunque el visitante acabe en la ruta canónica. Su HTML lleva
  // las etiquetas de la ruta canónica, para que no se cuelguen como duplicado.
  for (const alias of ALIASES) {
    const target = ROUTE_BY_KEY[alias.target]
    if (!target) throw new Error(`El alias "${alias.path}" apunta a una ruta inexistente`)
    const page = replaceSeoBlock(html, headFor(target, origin))
    const directory = path.join(distDir, alias.path.replace(/^\/|\/$/g, ''))
    await fs.mkdir(directory, { recursive: true })
    await fs.writeFile(path.join(directory, 'index.html'), page, 'utf8')
  }
  console.log(`· ${ALIASES.length} alias con respuesta 200 (no se publican)`)
}

const buildSitemap = async (origin) => {
  const lastmod = getLastModified()
  const urls = ROUTES.map(
    (route) => `  <url>
    <loc>${origin}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
  await fs.writeFile(path.join(distDir, 'sitemap.xml'), xml, 'utf8')
  console.log(`· dist/sitemap.xml — ${ROUTES.length} URLs — ${origin}`)
}

const buildRobots = async (origin) => {
  const txt = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`
  await fs.writeFile(path.join(distDir, 'robots.txt'), txt, 'utf8')
  console.log(`· dist/robots.txt — ${origin}/sitemap.xml`)
}

/**
 * `CNAME` con el dominio propio.
 *
 * GitHub Pages lo lee del artefacto publicado: es lo que hace que el sitio
 * se sirva en ese dominio (y que la URL `*.github.io` redireccione a él).
 *
 * Solo se escribe si hay dominio propio configurado: publicar un CNAME de un
 * dominio que no apunta a GitHub Pages hace que la verificación falle y el
 * sitio se quede sin servir.
 */
const buildCname = async () => {
  const domain = getCustomDomain()
  if (!domain) {
    console.log('· sin CNAME (el dominio lo define el hosting)')
    return
  }

  await fs.writeFile(path.join(distDir, 'CNAME'), `${domain}\n`, 'utf8')
  console.log(`· dist/CNAME — ${domain}`)
}

const main = async () => {
  const origin = getSiteOrigin()
  await buildOgImages()
  await buildSpaFallback(origin)
  await buildSitemap(origin)
  await buildRobots(origin)
  await buildCname()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
