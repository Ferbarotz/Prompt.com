/**
 * Imágenes Open Graph por ruta.
 *
 * Una sola imagen para todas las rutas hace que todos los enlaces se vean
 * iguales en Slack, WhatsApp o X: el visitor no distingue el generador de
 * la guía. Aquí se genera una tarjeta de 1200×630 por ruta con su título.
 *
 * Se dibuja con SVG y se convierte a PNG con sharp, que ya es una dependencia
 * del proyecto (la usa `scripts/build-assets.mjs`).
 */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** Carpeta con las fuentes que usa el build (la Inter del proyecto). */
const fontsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fonts')

/** Tamaño de la imagen Open Graph. */
export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

/** Caracteres por línea del título, según el ancho y el tamaño de la fuente. */
const CHARS_PER_LINE = 26

/** Número máximo de líneas del título. */
const MAX_LINES = 3

/** Tamaño de la fuente del título, según cuántas líneas occupancy. */
const FONT_SIZES = { 1: 68, 2: 60, 3: 50 }

/**
 * Prepara fontconfig para que librsvg (el motor de SVG de sharp) encuentre la
 * Inter del proyecto en vez de la fuente del sistema.
 *
 * La web usa Inter, pero en el navegador solo se sirve el `.woff2`, que
 * librsvg no sabe leer. Aquí se apunta fontconfig a la copia en TTF de
 * `scripts/fonts/`, de modo que las tarjetas se ven con la tipografía de la
 * marca. Si el TTF no está o fontconfig no existe, se usa la fuente del
 * sistema y no pasa nada.
 */
export const useProjectFont = () => {
  if (process.env.FONTCONFIG_FILE) return
  const font = path.join(fontsDir, 'Inter-Bold.ttf')
  if (!fs.existsSync(font)) return

  try {
    const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'promptcom-fonts-'))
    const conf = `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${fontsDir}</dir>
  <cachedir>${cacheDir}</cachedir>
  <include ignore_missing="yes">/etc/fonts/fonts.conf</include>
</fontconfig>
`
    const confPath = path.join(cacheDir, 'fonts.conf')
    fs.writeFileSync(confPath, conf)
    process.env.FONTCONFIG_FILE = confPath
  } catch {
    // Sin fontconfig se dibuja con la fuente del sistema.
  }
}

/** Familia tipográfica de las tarjetas: la del proyecto, con respaldo. */
const FONT_FAMILY = 'Inter, DejaVu Sans, Verdana, Geneva, sans-serif'

/** Escapa el texto para poder insertarlo en el SVG. */
const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Parte un texto en líneas de un máximo de caracteres. */
export const wrapTitle = (title, charsPerLine = CHARS_PER_LINE, maxLines = MAX_LINES) => {
  const words = String(title).split(/\s+/).filter(Boolean)
  const lines = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length <= charsPerLine || !current) {
      current = candidate
      continue
    }
    lines.push(current)
    current = word
    if (lines.length === maxLines) break
  }
  if (current && lines.length < maxLines) lines.push(current)

  // Si no cabía todo, se avisa con puntos suspensivos en la última línea.
  const placed = lines.join(' ').split(/\s+/).filter(Boolean).length
  if (placed < words.length && lines.length > 0) {
    const last = lines[lines.length - 1]
    lines[lines.length - 1] = `${last.slice(0, Math.max(0, last.length - 1)).trimEnd()}…`
  }

  return lines
}

/**
 * Genera el SVG de la tarjeta.
 *
 * @param {{title: string, kicker?: string, siteName?: string}} options
 * @returns {string} SVG con la tarjeta.
 */
export const renderOgSvg = ({
  title,
  kicker = 'Prompt.com',
  siteName = 'Prompt.com'
}) => {
  const lines = wrapTitle(title)
  const fontSize = FONT_SIZES[lines.length] ?? FONT_SIZES[3]
  const lineHeight = fontSize + 18
  const startY = 300 - ((lines.length - 1) * lineHeight) / 2

  const titleMarkup = lines
    .map(
      (line, index) =>
        `<text x="80" y="${startY + index * lineHeight}" font-family="${FONT_FAMILY}" font-size="${fontSize}" font-weight="bold" fill="#ffffff">${escapeXml(line)}</text>`
    )
    .join('\n    ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0f24"/>
      <stop offset="100%" stop-color="#050814"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.85" cy="0.1" r="0.6">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.12" cy="0.85" r="0.55">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="55%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
  </defs>

  <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#bg)"/>
  <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#glowA)"/>
  <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#glowB)"/>

  <text x="80" y="134" font-family="${FONT_FAMILY}" font-size="28" font-weight="bold" letter-spacing="4" fill="#a5b4fc">${escapeXml(
    kicker.toUpperCase()
  )}</text>

  <g>
    ${titleMarkup}
  </g>

  <rect x="80" y="470" width="260" height="8" rx="4" fill="url(#brand)"/>
  <text x="80" y="540" font-family="${FONT_FAMILY}" font-size="34" font-weight="bold" fill="#eaf1ff">${escapeXml(
    siteName
  )}</text>
  <text x="1120" y="540" text-anchor="end" font-family="${FONT_FAMILY}" font-size="26" fill="#7f8fbc">prompt engineering</text>
</svg>`
}

/**
 * Genera la imagen Open Graph de una ruta y la devuelve como PNG.
 *
 * @param {{title: string, kicker?: string, siteName?: string}} options
 * @returns {Promise<Buffer>} PNG de 1200×630.
 */
export const renderOgImage = async (options) => {
  const { default: sharp } = await import('sharp')
  useProjectFont()
  const svg = renderOgSvg(options)
  // PNG con paleta: las tarjetas tienen pocos colores y el degradado se
  // mantiene bien. Pesa la mitad que el PNG de 32 bits.
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toBuffer()
}
