import { Link } from 'react-router-dom'
import { CRITERIA } from '../data/promptLinter'
import { PATHS } from '../data/paths'
import styles from './PromptAnatomy.module.css'

/**
 * Anatomía de un prompt: los ocho bloques de la rúbrica, con el de esta
 * página resaltado.
 *
 * Es el diagrama que faltaba en las páginas de cada bloque: en lugar de una
 * imagen decorativa, muestra dónde encaja el bloque que se está explicando.
 * Se dibuja con HTML y CSS (no con una imagen) para que se vea nítido en
 * cualquier pantalla, siga al tema claro u oscuro y no pese nada.
 */
const PromptAnatomy = ({ current }: { current: string }) => {
  return (
    <figure className={styles.anatomy}>
      <figcaption className={styles.caption}>Los ocho bloques de un prompt</figcaption>

      <ol className={styles.blocks}>
        {CRITERIA.map((criterion, index) => {
          const isCurrent = criterion.id === current
          return (
            <li key={criterion.id} className={isCurrent ? styles.blockCurrent : styles.block}>
              <span className={styles.index} aria-hidden="true">
                {index + 1}
              </span>
              <span className={styles.name}>{criterion.label}</span>
              {isCurrent ? (
                <span className={styles.here}>estás aquí</span>
              ) : (
                <span className={styles.weight}>{criterion.weight} pts</span>
              )}
            </li>
          )
        })}
      </ol>

      <p className={styles.foot}>
        Cada bloque tiene su página en la <Link to={PATHS.guia}>guía de prompts</Link>.
      </p>
    </figure>
  )
}

export default PromptAnatomy
