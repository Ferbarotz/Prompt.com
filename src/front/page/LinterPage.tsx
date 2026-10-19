import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Componente/Navbar'
import Footer from '../Componente/Footer'
import useSeo from '../hooks/useSeo'
import { CRITERIA, EXAMPLE_PROMPT, analyzePrompt, improvePrompt } from '../data/promptLinter'
import styles from './LinterPage.module.css'

const LINTER_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Analizador de prompts de Prompt.com',
  url: 'https://prompt.com/analizar-prompt',
  description:
    'Pega tu prompt y obtén una puntuación con el desglose de lo que le falta: rol, objetivo, contexto, datos, restricciones, formato, ejemplos y validación.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requiere un navegador con JavaScript habilitado',
  inLanguage: 'es-ES',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }
}

const LinterPage = () => {
  useSeo({
    title: 'Analizador de prompts: puntúa y mejora el tuyo',
    description:
      'Pega tu prompt y obtén una puntuación de 0 a 100 con el desglose de lo que le falta: rol, objetivo, contexto, datos, restricciones, formato, ejemplos y criterio de validación.',
    path: '/analizar-prompt',
    jsonLd: LINTER_JSON_LD
  })

  const [text, setText] = useState('')
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
                  onClick={() => setText(EXAMPLE_PROMPT)}
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
            La puntuación es la suma de los criterios que el prompt cumple. Cada uno
            aporta 10 puntos, y se suman 10 más por usar bloques estructurados y 10
            más por una longitud equilibrada.
          </p>
          <ol className={styles.rubricList}>
            {CRITERIA.map((criterion) => (
              <li key={criterion.id}>
                <strong>{criterion.label}</strong>. {criterion.hint}
              </li>
            ))}
          </ol>
          <p className={styles.rubricFooter}>
            ¿Prefieres empezar de cero?{' '}
            <Link to="/generar-prompt">Genera un prompt profesional</Link> o vuelve a{' '}
            <Link to="/">la guía</Link>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default LinterPage
