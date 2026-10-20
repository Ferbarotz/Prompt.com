import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Componente/Navbar'
import Footer from '../Componente/Footer'
import useSeo from '../hooks/useSeo'
import {
  CRITERIA,
  CRITERIA_POINTS,
  EXAMPLE_PROMPT,
  LENGTH_POINTS,
  STRUCTURE_POINTS,
  analyzePrompt,
  improvePrompt
} from '../data/promptLinter'
import { LINTER_JSON_LD } from '../data/seoData'
import { getRouteSeo } from '../data/routeMeta'
import usePersistentState from '../hooks/usePersistentState'
import { EVENTS, trackEvent } from '../utils/analytics'
import styles from './LinterPage.module.css'
import { PATHS } from '../data/paths'

const LinterPage = () => {
  useSeo({
    ...getRouteSeo(PATHS.linter),
    jsonLd: LINTER_JSON_LD
  })

  const [text, setText] = usePersistentState<string>('linter', '')
  const [copied, setCopied] = useState('')
  const [status, setStatus] = useState('')
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const uid = useId()
  const fieldId = `prompt-linter-${uid}`

  const analysis = useMemo(() => analyzePrompt(text), [text])
  const improved = useMemo(() => improvePrompt(text, analysis), [text, analysis])
  const hasImprovements = improved.trim() !== text.trim()

  useEffect(() => {
    return () => {
      if (copyTimeout.current) clearTimeout(copyTimeout.current)
    }
  }, [])

  const copy = async (value: string, label: string) => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
      setStatus(`${label} copiado al portapapeles`)
      trackEvent(label === 'Prompt mejorado' ? EVENTS.copyImproved : EVENTS.copyPrompt, {
        origen: 'analizador'
      })
    } catch {
      setStatus('No se pudo copiar. Selecciona el texto y cópialo manualmente.')
    }
    if (copyTimeout.current) clearTimeout(copyTimeout.current)
    copyTimeout.current = setTimeout(() => setCopied(''), 2000)
  }

  // El gauge se pinta con un conic-gradient: el color depende de la nota.
  const gaugeStyle = {
    background: `conic-gradient(${analysis.color} ${analysis.score * 3.6}deg, rgba(111, 137, 255, 0.15) 0)`
  } as CSSProperties

  const gaugeInnerStyle = { color: analysis.color } as CSSProperties

  return (
    <div className="site-bg">
      <Navbar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Analizador de prompts</h1>
          <p className={styles.subtitle}>
            Pega tu prompt y descubre qué le falta. Todo el análisis ocurre en tu
            navegador: el texto no se envía a ningún servidor.
          </p>
        </section>

        <p className="sr-only" role="status" aria-live="polite">
          {status}
        </p>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>Tu prompt</div>

          <div className={styles.panelBody}>
            <div>
              <label htmlFor={fieldId} className={styles.label}>
                Pega aquí el prompt que quieras analizar
              </label>
              <textarea
                id={fieldId}
                className={`field-input ${styles.textarea}`}
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Pega tu prompt…"
                rows={10}
              />
              <div className={styles.toolbar}>
                <button
                  type="button"
                  onClick={() => {
                    setText(EXAMPLE_PROMPT)
                    trackEvent(EVENTS.tryExample)
                  }}
                  className="btn btn-outline btn-xs"
                >
                  Probar con un ejemplo
                </button>
                {text && (
                  <button
                    type="button"
                    onClick={() => setText('')}
                    className="btn btn-outline btn-xs"
                  >
                    Borrar
                  </button>
                )}
              </div>
            </div>

            {text.trim() && (
              <div className={styles.panelBody}>
                <div className={styles.scoreBox}>
                  <div aria-hidden="true" className={styles.gauge} style={gaugeStyle}>
                    <div className={styles.gaugeInner} style={gaugeInnerStyle}>
                      <strong className={styles.gaugeValue}>{analysis.score}</strong>
                      <span className={styles.gaugeMax} style={gaugeInnerStyle}>
                        /100
                      </span>
                    </div>
                  </div>

                  <div className={styles.scoreText}>
                    <p className={styles.scoreLevel}>
                      {analysis.level} · {analysis.foundCount} de {analysis.totalCriteria}{' '}
                      criterios
                    </p>
                    <p className={styles.scoreMeta}>
                      {analysis.length} caracteres ·{' '}
                      {analysis.structure.structured
                        ? 'estructurado en bloques'
                        : 'sin estructura de bloques'}
                    </p>
                  </div>
                </div>

                <ul className={styles.criteria}>
                  {analysis.criteria.map((criterion) => (
                    <li
                      key={criterion.id}
                      className={
                        criterion.found ? styles.criterionFound : styles.criterionMissing
                      }
                    >
                      <div className={styles.criterionHead}>
                        <span
                          aria-hidden="true"
                          className={`${styles.criterionIcon} ${
                            criterion.found
                              ? styles.criterionIconFound
                              : styles.criterionIconMissing
                          }`}
                        >
                          {criterion.found ? '✓' : '✕'}
                        </span>
                        <span className={styles.criterionLabel}>{criterion.label}</span>
                        <span className={styles.criterionState}>
                          {criterion.found ? 'Detectado' : 'Falta'}
                        </span>
                      </div>
                      {criterion.evidence ? (
                        <p className={styles.evidence}>{criterion.evidence.context}</p>
                      ) : (
                        <p className={styles.criterionHint}>{criterion.hint}</p>
                      )}
                    </li>
                  ))}
                </ul>

                {analysis.issues.length > 0 && (
                  <div>
                    <h2 className={styles.sectionTitle}>Observaciones</h2>
                    <ul className={styles.issues}>
                      {analysis.issues.map((issue) => (
                        <li key={issue.text}>{issue.text}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {hasImprovements && (
                  <div className={styles.improved}>
                    <div className={styles.improvedHeader}>
                      <span className={styles.improvedTitle}>Versión mejorada</span>
                      <div className={styles.improvedActions}>
                        <button
                          type="button"
                          onClick={() => copy(improved, 'Prompt mejorado')}
                          className="btn btn-primary btn-sm"
                        >
                          {copied === 'Prompt mejorado' ? 'Copiado!' : 'Copiar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setText(improved)}
                          className="btn btn-outline btn-sm"
                        >
                          Usar esta versión
                        </button>
                      </div>
                    </div>
                    <p className={styles.improvedNote}>
                      Se han añadido los bloques que faltan. Rellena los huecos entre &lt; &gt;.
                    </p>
                    <pre className={styles.pre}>{improved}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <section className={styles.rubric}>
          <h2 className={styles.rubricTitle}>Los 8 criterios de la rúbrica</h2>
          <p className={styles.rubricText}>
            La puntuación es la suma del peso de los criterios que el prompt
            cumple: {CRITERIA_POINTS} puntos en total. Se suman {STRUCTURE_POINTS} más
            por usar bloques estructurados y {LENGTH_POINTS} más por una longitud
            equilibrada.
          </p>
          <ol className={styles.rubricList}>
            {CRITERIA.map((criterion) => (
              <li key={criterion.id}>
                <strong>
                  {criterion.label} ({criterion.weight} puntos)
                </strong>
                . {criterion.hint}{' '}
                <Link to={`${PATHS.guia}${criterion.id}/`} className={styles.rubricLink}>
                  Ver la guía del bloque →
                </Link>
              </li>
            ))}
          </ol>
          <p className={styles.rubricFooter}>
            ¿Prefieres empezar de cero?{' '}
            <Link to={PATHS.generator}>Genera un prompt profesional</Link> o vuelve a{' '}
            <Link to={PATHS.home}>la guía</Link>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default LinterPage
