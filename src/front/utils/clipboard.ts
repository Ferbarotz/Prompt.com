/**
 * Copiar texto al portapapeles.
 *
 * La API del portapapeles (`navigator.clipboard`) solo funciona en contexto
 * seguro (https) y en navegadores modernos. Si no está disponible —o si el
 * navegador la bloquea— se usa el método clásico: un `<textarea>` fuera de la
 * vista con el texto seleccionado y `document.execCommand('copy')`.
 *
 * Las dos herramientas de la web (el generador y el analizador) usan esta
 * misma función: antes solo el generador tenía el método de reserva, y el
 * analizador nunca copiaba en `http://`.
 */

/** Resultado de una copia. */
export type CopyResult = 'ok' | 'failed'

/**
 * Copia un texto al portapapeles.
 *
 * @returns `ok` si se ha copiado, `failed` si no ha sido posible.
 */
export const copyToClipboard = async (text: string): Promise<CopyResult> => {
  if (!text) return 'failed'

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return 'ok'
    }
  } catch {
    // El navegador ha bloqueado la API: se intenta el método de reserva.
  }

  return copyWithExecCommand(text)
}

/**
 * Copia con el método clásico (`document.execCommand`).
 *
 * Está obsoleto, pero es el único que funciona en navegadores antiguos y en
 * páginas servidas sin https.
 */
const copyWithExecCommand = (text: string): CopyResult => {
  if (typeof document === 'undefined') return 'failed'

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.top = '0'
    textarea.style.left = '0'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok ? 'ok' : 'failed'
  } catch {
    return 'failed'
  }
}
