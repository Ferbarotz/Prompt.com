/**
 * Pipeline de assets estáticos.
 *
 *   node scripts/build-assets.mjs
 *
 * Qué hace:
 *  1. Convierte las imágenes PNG de la home a WebP en dos anchos (1x y 2x)
 *     y borra el PNG original. WebP pesa ~10 veces menos que el PNG de origen
 *     para estas ilustraciones.
 *  2. Genera los iconos PWA (favicon, apple-touch-icon e iconos de manifest).
 *  3. Genera la imagen Open Graph (1200x630) usada en las previews de redes.
 *
 * La fuente Inter se embebe en el SVG como base64, de modo que el resultado no
 * depende de las fuentes instaladas en la máquina (CI incluido).
 *
 * Los ficheros generados se versionan en git: el script solo hace falta cuando
 * se añaden imágenes nuevas.
 */

import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const homeAssets = path.join(root, 'src/front/assets/home')
const publicDir = path.join(root, 'public')
const fontsDir = path.join(publicDir, 'fonts')

const BRAND = {
  bg: '#050814',
  blue: '#3b82f6',
  violet: '#8b5cf6',
  pink: '#ec4899',
  cyan: '#06b6d4',
  text: '#eef2ff',
  muted: '#a5b4fc'
}

/** Anchos generados para las imágenes responsivas de la home. */
const IMAGE_WIDTHS = [640, 1280]

/** Tamaños de icono que necesita el manifest y iOS. */
const ICON_SIZES = [32, 180, 192, 512]

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`

const readFont = async () => {
  const buffer = await fs.readFile(path.join(fontsDir, 'inter-latin.woff2'))
  return buffer.toString('base64')
}

/**
 * Icono base: cuadrado con el monograma "P" y degradado de marca.
 * @param {number} size Lado del icono en píxeles.
 * @param {number} scale Factor de escala del monograma (1 = normal).
 */
const iconSvg = (size, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BRAND.blue}"/>
      <stop offset="55%" stop-color="${BRAND.violet}"/>
      <stop offset="100%" stop-color="${BRAND.pink}"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="${BRAND.bg}"/>
  <text x="50" y="${50 + 20 * scale}" font-family="InterLocal, DejaVu Sans, sans-serif" font-size="${58 * scale}" font-weight="800" text-anchor="middle" fill="url(#g)">P</text>
</svg>`

/**
 * Imagen Open Graph: 1200x630 con el estilo de la web.
 * @param {string} fontBase64 Inter en base64 para embeber en el SVG.
 */
const ogSvg = (fontBase64) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style type="text/css">
      @font-face {
        font-family: 'InterLocal';
        src: url(data:font/woff2;base64,${fontBase64}) format('woff2');
        font-weight: 100 900;
      }
    </style>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#9fd2ff"/>
      <stop offset="50%" stop-color="#d4b7ff"/>
      <stop offset="100%" stop-color="#ffa0de"/>
    </linearGradient>
    <linearGradient id="mark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BRAND.blue}"/>
      <stop offset="55%" stop-color="${BRAND.violet}"/>
      <stop offset="100%" stop-color="${BRAND.pink}"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.16" cy="0.12" r="0.62">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.86" cy="0.04" r="0.55">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowC" cx="0.62" cy="1" r="0.6">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#9fd2ff" stroke-opacity="0.07" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="${BRAND.bg}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glowA)"/>
  <rect width="1200" height="630" fill="url(#glowB)"/>
  <rect width="1200" height="630" fill="url(#glowC)"/>

  <g transform="translate(80 74)">
    <rect width="72" height="72" rx="18" fill="#0b1122" stroke="url(#mark)" stroke-width="2"/>
    <text x="36" y="52" font-family="InterLocal, DejaVu Sans, sans-serif" font-size="42" font-weight="800" text-anchor="middle" fill="url(#mark)">P</text>
    <text x="96" y="47" font-family="InterLocal, DejaVu Sans, sans-serif" font-size="36" font-weight="800" fill="${BRAND.text}">Prompt.com</text>
  </g>

  <text x="80" y="286" font-family="InterLocal, DejaVu Sans, sans-serif" font-size="72" font-weight="800" fill="url(#brand)">Gu&#xED;a y generador</text>
  <text x="80" y="374" font-family="InterLocal, DejaVu Sans, sans-serif" font-size="72" font-weight="800" fill="url(#brand)">de prompts</text>

  <text x="80" y="432" font-family="InterLocal, DejaVu Sans, sans-serif" font-size="27" font-weight="500" fill="${BRAND.muted}">10 tipos de tarea &#183; 3 pasos &#183; prompts profesionales en segundos</text>

  <g transform="translate(80 486)">
    ${['C&#xF3;digo', 'Contenido', 'SEO', 'Imagen', 'V&#xED;deo', 'Email']
      .map(
        (label, index) =>
          `<g transform="translate(${index * 168} 0)">
             <rect width="152" height="52" rx="26" fill="#0b1122" fill-opacity="0.9" stroke="#9fd2ff" stroke-opacity="0.28"/>
             <text x="76" y="34" font-family="InterLocal, DejaVu Sans, sans-serif" font-size="22" font-weight="600" text-anchor="middle" fill="${BRAND.text}">${label}</text>
           </g>`
      )
      .join('\n    ')}
  </g>

  <text x="80" y="590" font-family="InterLocal, DejaVu Sans, sans-serif" font-size="22" font-weight="600" fill="#6b7aa8">Escribe mejores prompts. Escribe menos, pero mejor.</text>
</svg>`

/** Convierte las PNG de la home a WebP responsivo y borra los originales. */
const convertHomeImages = async () => {
  const files = (await fs.readdir(homeAssets)).filter((file) => file.endsWith('.png'))
  if (!files.length) {
    console.log('· No hay PNG que convertir (ya están en WebP).')
    return
  }

  for (const file of files) {
    const source = path.join(homeAssets, file)
    const base = file.replace(/\.png$/, '')
    const metadata = await sharp(source).metadata()
    const widths = [...new Set(IMAGE_WIDTHS.map((w) => Math.min(w, metadata.width)))]

    for (const width of widths) {
      const target = path.join(homeAssets, `${base}-${width}.webp`)
      await sharp(source)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toFile(target)
      const { size } = await fs.stat(target)
      console.log(`· ${path.basename(target)} — ${width}px — ${kb(size)}`)
    }

    await fs.unlink(source)
    console.log(`· Eliminado el original ${file} (${kb(metadata.size ?? 0)})`)
  }
}

/** Genera los iconos PNG que needs el manifest y iOS. */
const buildIcons = async (fontBase64) => {
  const withFont = (svg) =>
    svg.replace(
      '<defs>',
      `<defs><style type="text/css">@font-face { font-family: 'InterLocal'; src: url(data:font/woff2;base64,${fontBase64}) format('woff2'); font-weight: 100 900; }</style>`
    )

  for (const size of ICON_SIZES) {
    const name =
      size === 32 ? 'favicon-32.png' : size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`
    const target = path.join(publicDir, name)
    await sharp(Buffer.from(withFont(iconSvg(size)))).png({ compressionLevel: 9 }).toFile(target)
    const { size: bytes } = await fs.stat(target)
    console.log(`· public/${name} — ${size}px — ${kb(bytes)}`)
  }

  // Icono "maskable": Android recorta los bordes, así que el monograma va
  // reducido para staying dentro de la zona segura (80% central).
  const maskable = path.join(publicDir, 'icon-maskable-512.png')
  await sharp(Buffer.from(withFont(iconSvg(512, 0.66))))
    .png({ compressionLevel: 9 })
    .toFile(maskable)
  const { size: maskableSize } = await fs.stat(maskable)
  console.log(`· public/icon-maskable-512.png — 512px — ${kb(maskableSize)}`)
}

/** Genera la imagen Open Graph de 1200x630. */
const buildOgImage = async (fontBase64) => {
  const target = path.join(publicDir, 'og-image.png')
  await sharp(Buffer.from(ogSvg(fontBase64)))
    .png({ compressionLevel: 9, quality: 90 })
    .toFile(target)
  const { size } = await fs.stat(target)
  console.log(`· public/og-image.png — 1200x630 — ${kb(size)}`)
}

const main = async () => {
  const fontBase64 = await readFont()
  console.log('Optimizando imágenes de la home...')
  await convertHomeImages()
  console.log('Generando iconos...')
  await buildIcons(fontBase64)
  console.log('Generando imagen Open Graph...')
  await buildOgImage(fontBase64)
  console.log('Listo.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
