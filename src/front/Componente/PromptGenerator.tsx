import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { TASK_TYPES, TASK_TYPES_BY_ID } from '../data/taskTypes'
import { getAiTools } from '../data/aiTools'
import {
  buildShareUrl,
  decodeGeneratorState,
  encodeGeneratorState,
  hasGeneratorState
} from '../data/generatorLink'
import usePersistentState from '../hooks/usePersistentState'
import { EVENTS, trackEvent } from '../utils/analytics'
import { copyToClipboard } from '../utils/clipboard'
import ScrollableCode from './ScrollableCode'
import styles from './PromptGenerator.module.css'
import { PATHS } from '../data/paths'

const STEPS = [
  { id: 1, name: 'Tarea' },
  { id: 2, name: 'Detalles' },
  { id: 3, name: 'Resultado' }
]

/** Estado del generador: lo que el visitante ha escrito hasta ahora. */
interface GeneratorState {
  step: number
  taskId: string
  idea: string
  details: Record<string, string>
  extra: string
}

/** Estado de partida: la primera tarea y los tres pasos en blanco. */
const INITIAL_STATE: GeneratorState = {
  step: 1,
  taskId: TASK_TYPES[0].id,
  idea: '',
  details: {},
  extra: ''
}

/**
 * Estado inicial a partir de la URL.
 *
 * Un enlace compartido llega con el prompt dentro: si trae idea, se abre
 * directamente en el paso 3 con el resultado a la vista. Un tipo de tarea
 * desconocido se ignora (el enlace puede estar manipulado o ser antiguo).
 */
const stateFromSearch = (search: string): GeneratorState => {
  const fromUrl = decodeGeneratorState(search)
  const taskId =
    fromUrl.taskId && TASK_TYPES_BY_ID[fromUrl.taskId] ? fromUrl.taskId : INITIAL_STATE.taskId

  return {
    step: fromUrl.idea ? 3 : INITIAL_STATE.step,
    taskId,
    idea: fromUrl.idea ?? INITIAL_STATE.idea,
    details: fromUrl.details ?? INITIAL_STATE.details,
    extra: fromUrl.extra ?? INITIAL_STATE.extra
  }
}

const PromptGenerator = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  // Lo que llega en la URL manda sobre lo guardado en el navegador: un enlace
  // compartido se abre con el prompt de quien lo envió.
  const [search] = useState(location.search)
  const [state, setState] = usePersistentState<GeneratorState>(
    'generator',
    () => stateFromSearch(search),
    { preferInitial: hasGeneratorState(decodeGeneratorState(search)) }
  )
  const { step, taskId, idea, details, extra } = state

  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  // Error del campo obligatorio: se muestra al pulsar "Siguiente" sin idea.
  const [ideaError, setIdeaError] = useState('')
  // Mensaje para la región live: es la única fuente de anuncios, para que el
  // contenido del prompt (que cambia en cada pulsación) no se lea entero.
  const [status, setStatus] = useState('')
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const linkTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const statusTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  /** Aplica un cambio al estado del generador. */
  const update = (patch: Partial<GeneratorState>) =>
    setState((previous) => ({ ...previous, ...patch }))

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

  // Solo en la página del generador la URL refleja el estado: en la home el
  // generador es una demostración y ensuciar la URL del visitante molesta.
  const isGeneratorPage =
    location.pathname.replace(/\/+$/, '') === PATHS.generator.replace(/\/+$/, '')

  // Herramientas de IA recomendadas para este tipo de tarea: el generador no
  // llama a ningún modelo, así que le decimos al usuario dónde pegar el prompt.
  const aiSuggestion = useMemo(() => getAiTools(task.id), [task.id])

  const generatedPrompt = useMemo(() => {
    if (!idea.trim()) return ''
    return task.build({ idea, details, extra })
  }, [task, idea, details, extra])

  // Limpia los temporizadores al desmontar el componente.
  useEffect(() => {
    return () => {
      if (copyTimeout.current) clearTimeout(copyTimeout.current)
      if (linkTimeout.current) clearTimeout(linkTimeout.current)
      if (statusTimeout.current) clearTimeout(statusTimeout.current)
    }
  }, [])

  // Mantiene la URL al día con el prompt: así el visitante puede copiar la
  // barra de direcciones y compartir su prompt con un enlace.
  useEffect(() => {
    if (!isGeneratorPage) return
    const query = encodeGeneratorState(state)
    if (query === searchParams.toString()) return
    setSearchParams(new URLSearchParams(query), { replace: true })
  }, [state, isGeneratorPage, searchParams, setSearchParams])

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
    update({ step: next })
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
    const resultado = await copyToClipboard(generatedPrompt)
    if (resultado === 'ok') {
      showCopiedFeedback()
      announce('Prompt copiado al portapapeles', true)
      trackEvent(EVENTS.copyPrompt, { tipo: task.id })
    } else {
      announce('No se pudo copiar. Selecciona el texto y cópialo manualmente.', true)
    }
  }

  /**
   * Copia el enlace del prompt.
   *
   * El enlace lleva el prompt dentro, así que quien lo abre ve exactamente lo
   * mismo que ve quien lo envía.
   */
  const handleCopyLink = async () => {
    const url = buildShareUrl(state)
    const resultado = await copyToClipboard(url)
    if (resultado === 'ok') {
      setLinkCopied(true)
      if (linkTimeout.current) clearTimeout(linkTimeout.current)
      linkTimeout.current = setTimeout(() => setLinkCopied(false), 2000)
      announce('Enlace del prompt copiado al portapapeles', true)
      trackEvent(EVENTS.copyLink, { tipo: task.id })
    } else {
      announce('No se pudo copiar el enlace. Cópialo de la barra de direcciones.', true)
    }
  }

  const handleReset = () => {
    goToStep(1)
    update({
      step: 1,
      taskId: TASK_TYPES[0].id,
      idea: '',
      details: {},
      extra: ''
    })
    setCopied(false)
    setLinkCopied(false)
  }

  // Cambiar de tipo de tarea invalida los detalles: son específicos del tipo.
  const handleTaskChange = (id: string) => {
    update({ taskId: id, details: {} })
  }

  const handleDetailChange = (key: string, value: string) => {
    update({ details: { ...details, [key]: value } })
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
                onChange={(event) => {
                  setIdeaError('')
                  update({ idea: event.target.value })
                }}
                placeholder='Ej: "Una página para mi negocio de pasteles", "Un email para recuperar clientes que no compran hace meses"...'
                rows={3}
                required
                aria-required="true"
                aria-invalid={ideaError ? true : undefined}
                aria-describedby={ideaError ? `${fieldIds.idea}-error` : undefined}
              />
              {ideaError ? (
                <p className={styles.errorText} id={`${fieldIds.idea}-error`} role="alert">
                  {ideaError}
                </p>
              ) : null}
              <div className={styles.exampleButton}>
                <button
                  type="button"
                  onClick={() => {
                    setIdeaError('')
                    update({ idea: task.exampleIdea })
                    trackEvent(EVENTS.useExample, { tipo: task.id })
                  }}
                  className="btn btn-outline btn-xs"
                >
                  Usar un ejemplo
                </button>
              </div>
            </div>

            <div>
              {/*
                El botón no se deshabilita: un botón deshabilitado no explica
                por qué no se puede avanzar. Al pulsarlo sin idea, se avisa
                (WCAG 3.3.1).
              */}
              <button
                type="button"
                onClick={() => {
                  if (!idea.trim()) {
                    setIdeaError('Escribe tu idea para continuar: es el único paso obligatorio.')
                    return
                  }
                  setIdeaError('')
                  goToStep(2)
                }}
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
                onChange={(event) => update({ extra: event.target.value })}
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
                      onClick={handleCopyLink}
                      className="btn btn-outline btn-sm"
                    >
                      {linkCopied ? 'Enlace copiado!' : 'Copiar enlace'}
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
                <ScrollableCode className={styles.pre} label="Prompt generado">
                  {generatedPrompt}
                </ScrollableCode>

                <section
                  className={styles.aiBlock}
                  aria-labelledby={`ai-tools-${uid}`}
                >
                  <h2 className={styles.aiTitle} id={`ai-tools-${uid}`}>
                    Dónde pegar este prompt
                  </h2>
                  <p className={styles.aiIntro}>{aiSuggestion.intro}</p>
                  <ul className={styles.aiList}>
                    {aiSuggestion.tools.map((tool) => (
                      <li className={styles.aiItem} key={tool.name}>
                        <a
                          className={styles.aiLink}
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {tool.name}
                          <span className={styles.aiExternal} aria-hidden="true">
                            ↗
                          </span>
                          <span className="sr-only"> (se abre en una pestaña nueva)</span>
                        </a>
                        {tool.recommended ? (
                          <span className={styles.aiBadge}>Recomendada</span>
                        ) : null}
                        <p className={styles.aiNote}>{tool.note}</p>
                      </li>
                    ))}
                  </ul>
                  <p className={styles.aiDisclaimer}>
                    Enlaces externos: las condiciones y el acceso a cada herramienta
                    pueden cambiar. Prompt.com no está afiliado a ellas.
                  </p>
                </section>

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
