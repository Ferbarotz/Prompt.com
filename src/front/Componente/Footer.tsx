import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

interface Column {
  title: string
  links: Array<{ label: string; to: string }>
}

const columns: Column[] = [
  {
    title: 'Herramientas',
    links: [
      { label: 'Generador de prompts', to: '/generar-prompt' },
      { label: 'Analizador de prompts', to: '/analizar-prompt' },
      { label: 'Guía de prompts', to: '/' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Aviso legal', to: '/aviso-legal' },
      { label: 'Política de privacidad', to: '/privacidad' },
      { label: 'Política de cookies', to: '/cookies' }
    ]
  }
]

type FormState = 'idle' | 'sending' | 'done' | 'error' | 'unconfigured'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const endpoint = import.meta.env.VITE_NEWSLETTER_ENDPOINT

    if (!endpoint) {
      setState('unconfigured')
      return
    }

    setState('sending')
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email })
      })
      setState(response.ok ? 'done' : 'error')
      if (response.ok) setEmail('')
    } catch {
      setState('error')
    }
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div>
          <p className={styles.brand}>Prompt.com</p>
          <p className={styles.tagline}>
            Aprende a escribir mejores prompts y llévalos a cualquier modelo de
            lenguaje: ChatGPT, Claude, Gemini, Copilot o un LLM local.
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className={styles.columnTitle}>{column.title}</h2>
            <ul className={styles.linkList}>
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className={styles.columnTitle}>Boletín</h2>
          <p className={styles.newsletterText}>
            Un correo al mes con plantillas y técnicas de prompt engineering. Sin
            spam y puedes darte de baja cuando quieras.
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="newsletter-email" className="sr-only">
              Tu correo electrónico
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              autoComplete="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field-input"
            />
            <button type="submit" className="btn btn-primary" disabled={state === 'sending'}>
              {state === 'sending' ? 'Enviando…' : 'Suscribirme'}
            </button>
            <p role="status" className={styles.status}>
              {state === 'done' && '¡Listo! Revisa tu correo para confirmar la suscripción.'}
              {state === 'error' && 'No se pudo completar la suscripción. Inténtalo de nuevo.'}
              {state === 'unconfigured' && 'El boletín aún no está disponible en esta instalación.'}
            </p>
          </form>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Prompt.com</span>
        <span>
          Hecho con <span aria-label="amor">♥</span> para quienes escriben prompts
        </span>
      </div>
    </footer>
  )
}

export default Footer
