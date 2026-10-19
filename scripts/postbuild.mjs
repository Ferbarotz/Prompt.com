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
 *  2. Genera `sitemap.xml` y `robots.txt` con la URL real del sitio.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { getSiteOrigin } from './site-url.mjs'

const distDir = path.resolve('dist')

/** Fecha del último commit, como `lastmod` del sitemap. */
const getLastModified = () => {
  try {
    const date = execSync('git log -1 --format=%cI', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
    return date ? date.slice(0, 10) : new Date().toISOString().slice(0, 10)
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

const ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/generar-prompt', changefreq: 'monthly', priority: '0.8' },
  { path: '/analizar-prompt', changefreq: 'monthly', priority: '0.8' },
  { path: '/aviso-legal', changefreq: 'yearly', priority: '0.3' },
  { path: '/privacidad', changefreq: 'yearly', priority: '0.3' },
  { path: '/cookies', changefreq: 'yearly', priority: '0.3' }
]

/** `index.html` → `404.html`: la SPA arranca ya en la URL solicitada. */
const buildSpaFallback = async () => {
  const html = await fs.readFile(path.join(distDir, 'index.html'), 'utf8')
  await fs.writeFile(path.join(distDir, '404.html'), html, 'utf8')
  console.log('· dist/404.html — copia de index.html (fallback SPA)')
}

const buildSitemap = async (origin) => {
  const lastmod = getLastModified()
  const urls = ROUTES.map(
    (route) => `  <url>
    <loc>${origin}${route.path === '/' ? '/' : route.path}</loc>
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
  console.log(`· dist/robots.txt — ${origin}/sitemap.txt`)
}

const main = async () => {
  await buildSpaFallback()
  const origin = getSiteOrigin()
  await buildSitemap(origin)
  await buildRobots(origin)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
