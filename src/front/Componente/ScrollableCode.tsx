/**
 * Bloque de código que se puede desplazar con el teclado.
 *
 * Un contenedor con `overflow` no se puede desplazar con el teclado si no es
 * enfocable: el foco nunca entra en la zona desplazable y el contenido largo
 * queda fuera del alcance (WCAG 2.1.1). Con `tabIndex` y un nombre
 * accesible, el bloque se puede recorrer con las flechas y los lectores de
 * pantalla lo anuncian como lo que es.
 */
export interface ScrollableCodeProps {
  /** Texto del bloque. */
  children: string
  /** Clase CSS del bloque. */
  className?: string
  /** Nombre accesible: qué contiene el bloque. */
  label: string
}

const ScrollableCode = ({ children, className, label }: ScrollableCodeProps) => (
  <pre className={className} tabIndex={0} role="region" aria-label={label}>
    {children}
  </pre>
)

export default ScrollableCode
