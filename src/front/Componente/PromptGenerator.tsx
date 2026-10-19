import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { TASK_TYPES, TASK_TYPES_BY_ID } from '../data/taskTypes'
import styles from './PromptGenerator.module.css'
import { PATHS } from '../data/paths'

const STEPS = [
  { id: 1, name: 'Tarea' },
  { id: 2, name: 'Detalles' },
  { id: 3, name: 'Resultado' }
]

const PromptGenerator = () => {
  const [step, setStep] = useState(1)
  const [taskId, setTaskId] = useState(TASK_TYPES[0].id)
  const [idea, setIdea] = useState('')
  const [details, setDetails] = useState<Record<string, string>>({})
  const [extra, setExtra] = useState('')
  const [copied, setCopied] = useState(false)
  // Mensaje para la región live: es la única fuente de anuncios, para que el
  // contenido del prompt (que cambia en cada pulsación) no se lea entero.
  const [status, setStatus] = useState('')
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const statusTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // IDs únicos por instancia: durante las transiciones de React 18 pueden
  // convivir dos generadores (home y página de creación) en el mismo DOM.
  const uid = useId()
  const fieldIds = {
    task: `prompt-task-${uid}`,
    idea: `prompt-idea-${uid}`,
    extra: `prompt-extra-${uid}`,
    // La clave incluye el tipo de tarea: dos tipos distintos pueden usar el
    // mismo nombre de campo (por ejemplo "formato") y colisionarían.
    details: Object.fromEntries(
      TASK_TYPES.flatMap((task) =>
        task.fields.map((field) => [
          `${task.id}.${field.key}`,
          `prompt-${task.id}-${field.key}-${uid}`
        ])
      )
    )
  }

  const task = TASK_TYPES_BY_ID[taskId] ?? TASK_TYPES[0]

  const generatedPrompt = useMemo(() => {
    if (!idea.trim()) return ''
    return task.build({ idea, details, extra })
  }, [task, idea, details, extra])

  // Limpia los temporizadores al desmontar el componente.
  useEffect(() => {
    return () => {
      if (copyTimeout.current) clearTimeout(copyTimeout.current)
      if (statusTimeout.current) clearTimeout(statusTimeout.current)
    }
  }, [])

  // Anuncia los cambios de paso a los lectores de pantalla. Se hace en el
  // manejador del evento (y no en un efecto) para evitar renderizados en
  // cascada: el cambio de paso siempre proviene de una acción del usuario.
  const announce = (message: string, autoClear = false) => {
    setStatus(message)
    if (statusTimeout.current) clearTimeout(statusTimeout.current)
    if (autoClear) {
      statusTimeout.current = setTimeout(() => setStatus(''), 4000)
    }
  }

  const goToStep = (next: number) => {
    setStep(next)
    const stepInfo = STEPS.find((item) => item.id === next)
    announce(`Paso ${next} de ${STEPS.length}: ${stepInfo?.name ?? ''}`)
  }

  const showCopiedFeedback = () => {
    setCopied(true)
    if (copyTimeout.current) clearTimeout(copyTimeout.current)
    copyTimeout.current = setTimeout(() => setCopied(false), 2000)
  }

  const handleCopy = async () => {
    if (!generatedPrompt) return
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      showCopiedFeedback()
      announce('Prompt copiado al portapapeles', true)
    } catch {
      // Fallback para navegadores sin Clipboard API o sin contexto seguro (http).
      const textarea = document.createElement('textarea')
      textarea.value = generatedPrompt
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      if (ok) {
        showCopiedFeedback()
        announce('Prompt copiado al portapapeles', true)
      } else {
        announce('No se pudo copiar. Selecciona el texto y cópialo manualmente.', true)
      }
    }
  }

  const handleReset = () => {
    goToStep(1)
    setTaskId(TASK_TYPES[0].id)
    setIdea('')
    setDetails({})
    setExtra('')
    setCopied(false)
  }

  // Cambiar de tipo de tarea invalida los detalles: son específicos del tipo.
  const handleTaskChange = (id: string) => {
    setTaskId(id)
    setDetails({})
  }

  const handleDetailChange = (key: string, value: string) => {
    setDetails((previous) => ({ ...previous, [key]: value }))
  }

  return (
    <section
      // Id único por instancia: evita IDs duplicados si llega a coexistir más
      // de un generador en el DOM durante una transición de ruta.
      id={`prompt-generator-${uid}`}
      aria-label="Generador de prompts"
      className={styles.section}
    >
      <div className={styles.header}>
        Generador de Prompts
        <span className={styles.headerMeta}>
          {TASK_TYPES.length} tipos de tarea · 3 pasos
        </span>
      </div>

      <div className={styles.body}>
        <ol aria-label="Pasos del generador" className={styles.steps}>
          {STEPS.map((item) => {
            const isCurrent = step === item.id
            const isDone = step > item.id
            const className = [
              styles.step,
              isCurrent ? styles.stepCurrent : '',
              isDone ? styles.stepDone : ''
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <li key={item.id} aria-current={isCurrent ? 'step' : undefined} className={className}>
                {isDone ? '✓ ' : ''}Paso {item.id} · {item.name}
              </li>
            )
          })}
        </ol>

        {/* Región live: único punto donde se anuncian los cambios de estado. */}
        <p className="sr-only" role="status" aria-live="polite">
          {status}
        </p>

        {step === 1 && (
          <div className={styles.body}>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>1. ¿Qué tipo de tarea quieres resolver?</legend>
              <div className={styles.taskGrid}>
                {TASK_TYPES.map((option) => {
                  const selected = option.id === taskId
                  const className = `${styles.taskOption} ${
                    selected ? styles.taskOptionSelected : ''
                  }`

                  return (
                    <label key={option.id} className={className}>
                      <input
                        type="radio"
                        name={fieldIds.task}
                        value={option.id}
                        checked={selected}
                        onChange={() => handleTaskChange(option.id)}
                      />
                      <span className={styles.taskIcon} aria-hidden="true">
                        {option.icon}
                      </span>
                      <span className={styles.taskLabel}>{option.label}</span>
                      <span className={styles.taskHint}>{option.hint}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor={fieldIds.idea} className={styles.label}>
                2. Describe tu idea con tus palabras, aunque sea vaga
              </label>
              <textarea
                id={fieldIds.idea}
                className="field-input"
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                placeholder='Ej: "Una página para mi negocio de pasteles", "Un email para recuperar clientes que no compran hace meses"...'
                rows={3}
              />
              <div className={styles.exampleButton}>
                <button
                  type="button"
                  onClick={() => setIdea(task.exampleIdea)}
                  className="btn btn-outline btn-xs"
                >
                  Usar un ejemplo
                </button>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => idea.trim() && goToStep(2)}
                disabled={!idea.trim()}
                className="btn btn-primary"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.body}>
            <p className={styles.hint}>
              Estos detalles son opcionales: afinan el prompt para la tarea
              <strong> {task.label.toLowerCase()}</strong>.
            </p>

            {task.fields.map((field) => (
              <div key={field.key} className={styles.field}>
                <label htmlFor={fieldIds.details[`${task.id}.${field.key}`]} className={styles.label}>
                  {field.label} (opcional)
                </label>
                <select
                  id={fieldIds.details[`${task.id}.${field.key}`]}
                  className="field-input"
                  value={details[field.key] ?? ''}
                  onChange={(event) => handleDetailChange(field.key, event.target.value)}
                >
                  <option value="">Selecciona...</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className={styles.actions}>
              <button type="button" onClick={() => goToStep(1)} className="btn btn-outline">
                Anterior
              </button>
              <button type="button" onClick={() => goToStep(3)} className="btn btn-primary">
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.body}>
            <div className={styles.field}>
              <label htmlFor={fieldIds.extra} className={styles.label}>
                ¿Algo más que deba saber? (opcional)
              </label>
              <textarea
                id={fieldIds.extra}
                className="field-input"
                value={extra}
                onChange={(event) => setExtra(event.target.value)}
                placeholder='Ej: "Que tenga modo oscuro", "Que sea para niños", "Colores verde y blanco"...'
                rows={2}
              />
            </div>

            {generatedPrompt ? (
              <div className={styles.result}>
                <div className={styles.resultHeader}>
                  <span className={styles.resultTitle}>
                    Tu prompt profesional · {task.label}
                  </span>
                  <div className={styles.resultActions}>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="btn btn-primary btn-sm"
                    >
                      {copied ? 'Copiado!' : 'Copiar prompt'}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn btn-outline btn-sm"
                    >
                      Empezar de nuevo
                    </button>
                  </div>
                </div>
                <pre className={styles.pre}>{generatedPrompt}</pre>
                <p className={styles.crossLink}>
                  ¿Ya tienes un prompt escrito?{' '}
                  <Link to={PATHS.linter}>Púntualo y descubre qué le falta</Link>.
                </p>
              </div>
            ) : (
              <div className={styles.error}>
                Escribe primero tu idea en el Paso 1 para generar el prompt.
              </div>
            )}

            <div className={styles.actions}>
              <button type="button" onClick={() => goToStep(2)} className="btn btn-outline">
                Anterior
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default PromptGenerator
