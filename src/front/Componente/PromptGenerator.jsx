import { useState } from 'react'

const PromptGenerator = () => {
  const [step, setStep] = useState(1)
  const [idea, setIdea] = useState('')
  const [platform, setPlatform] = useState('')
  const [style, setStyle] = useState('')
  const [extra, setExtra] = useState('')
  const [copied, setCopied] = useState(false)

  const generatePrompt = () => {
    if (!idea) return ''

    const platformText = platform ? `\n- Plataforma: ${platform}` : ''
    const styleText = style ? `\n- Estilo visual: ${style}` : ''
    const extraText = extra ? `\n- Detalles adicionales: ${extra}` : ''

    return `Actúa como un experto en el área correspondiente según el siguiente proyecto.

## Objetivo
${idea}

## Especificaciones
${platformText}${styleText}${extraText}

## Requisitos técnicos
- Diseño moderno, limpio y profesional
- Responsive (móvil, tablet, desktop)
- Tipografía clara con jerarquía visual
- Colores armoniosos con gradientes sutiles
- Espaciado consistente y bordes redondeados
- Animaciones suaves y transiciones CSS

## Estructura
1. Header/Navbar con navegación clara
2. Sección principal (hero) con propuesta de valor
3. Sección de características o beneficios
4. Sección visual (galería, portafolio o demostración)
5. Sección de confianza (testimonios o datos)
6. Llamado a la acción (CTA) destacado
7. Footer con información de contacto

## Detalles adicionales
- Accesibilidad WCAG 2.1
- SEO básico (meta tags)
- Performance optimizada (Lighthouse 90+)
- Comentarios en el código explicando cada sección

## Entregable
Código fuente completo, organizado y listo para usar.`
  }

  const generatedPrompt = generatePrompt()

  const handleCopy = async () => {
    if (!generatedPrompt) return
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = generatedPrompt
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleReset = () => {
    setStep(1)
    setIdea('')
    setPlatform('')
    setStyle('')
    setExtra('')
  }

  const inputStyle = {
    background: 'rgba(11,17,34,0.9)',
    border: '1px solid rgba(111,137,255,0.35)',
    borderRadius: '8px',
    color: '#eaf1ff',
    padding: '0.7rem 0.9rem',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    width: '100%'
  }

  const labelStyle = {
    color: '#a5b4fc',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '0.4rem',
    display: 'block'
  }

  const buttonStyle = {
    background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 55%, #ec4899 100%)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.25)',
    padding: '0.5rem 1.2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: 'transform 0.15s ease'
  }

  const outlineBtnStyle = {
    background: 'transparent',
    color: '#a5b4fc',
    border: '1px solid rgba(111,137,255,0.35)',
    padding: '0.5rem 1.2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600
  }

  return (
    <section
      id="prompt-generator"
      style={{
        marginTop: '2rem',
        background: 'linear-gradient(180deg, rgba(13,18,35,0.9) 0%, rgba(10,14,28,0.94) 100%)',
        border: '1px solid rgba(157, 177, 255, 0.3)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 16px 44px rgba(8, 12, 28, 0.55), 0 6px 22px rgba(99,102,241,0.18)',
        backdropFilter: 'blur(6px)'
      }}
    >
      <div
        style={{
          padding: '0.8rem 1.2rem',
          borderBottom: '1px solid rgba(111, 137, 255, 0.28)',
          background: 'linear-gradient(90deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2), rgba(59,130,246,0.2))',
          color: '#eaf1ff',
          textTransform: 'uppercase',
          letterSpacing: '0.11em',
          fontSize: '0.8rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        Generador de Prompts
      </div>

      <div style={{ padding: '1.2rem', display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: step >= s ? 'linear-gradient(90deg, #3b82f6, #8b5cf6)' : 'rgba(111,137,255,0.15)',
                color: step >= s ? '#fff' : '#a5b4fc',
                border: `1px solid ${step >= s ? 'rgba(139,92,246,0.5)' : 'rgba(111,137,255,0.25)'}`
              }}
            >
              Paso {s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            <label style={labelStyle}>
              ¿Qué quieres crear? Descríbelo con tus palabras, aunque sea vago.
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder='Ej: "Una página para mi negocio de pasteles", "Una app para llevar el gimnasio", "Un video para vender cursos online"...'
              rows={3}
              style={inputStyle}
            />
            <div>
              <button
                onClick={() => idea.trim() && setStep(2)}
                style={{
                  ...buttonStyle,
                  opacity: idea.trim() ? 1 : 0.5,
                  cursor: idea.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              <label style={labelStyle}>
                ¿Para qué plataforma? (opcional)
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">Selecciona...</option>
                <option value="Página web / Landing page">Página web / Landing page</option>
                <option value="App móvil (iOS/Android)">App móvil (iOS/Android)</option>
                <option value="Aplicación web (SaaS)">Aplicación web (SaaS)</option>
                <option value="E-commerce / Tienda online">E-commerce / Tienda online</option>
                <option value="Redes sociales">Redes sociales</option>
                <option value="Video promocional">Video promocional</option>
                <option value="Imágenes para marketing">Imágenes para marketing</option>
              </select>
            </div>

            <div style={{ display: 'grid', gap: '0.6rem' }}>
              <label style={labelStyle}>
                ¿Qué estilo visual prefieres? (opcional)
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">Selecciona...</option>
                <option value="Minimalista y elegante">Minimalista y elegante</option>
                <option value="Moderno con gradientes y glassmorphism">Moderno con gradientes y glassmorphism</option>
                <option value="Corporativo y profesional">Corporativo y profesional</option>
                <option value="Creativo y colorido">Creativo y colorido</option>
                <option value="Oscuro / Dark mode">Oscuro / Dark mode</option>
                <option value="Retro / Vintage">Retro / Vintage</option>
                <option value="Futurista / Sci-fi">Futurista / Sci-fi</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setStep(1)} style={outlineBtnStyle}>
                Anterior
              </button>
              <button onClick={() => setStep(3)} style={buttonStyle}>
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              <label style={labelStyle}>
                ¿Algo más que deba saber? (opcional)
              </label>
              <textarea
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                placeholder='Ej: "Que tenga modo oscilo", "Que sea para niños", "Colores verde y blanco"...'
                rows={2}
                style={inputStyle}
              />
            </div>

            {generatedPrompt && (
              <div
                style={{
                  background: 'rgba(11,17,34,0.85)',
                  border: '1px solid rgba(111,137,255,0.3)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'grid',
                  gap: '0.8rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Tu prompt profesional
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={handleCopy}
                      style={{
                        ...buttonStyle,
                        background: copied
                          ? 'linear-gradient(90deg, #10b981, #059669)'
                          : 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                        fontSize: '0.85rem',
                        padding: '0.4rem 1rem'
                      }}
                    >
                      {copied ? 'Copiado!' : 'Copiar prompt'}
                    </button>
                    <button onClick={handleReset} style={{ ...outlineBtnStyle, fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
                      Empezar de nuevo
                    </button>
                  </div>
                </div>
                <pre
                  style={{
                    margin: 0,
                    color: '#eaf1ff',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'inherit',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}
                >
                  {generatedPrompt}
                </pre>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setStep(2)} style={outlineBtnStyle}>
                Anterior
              </button>
            </div>
          </div>
        )}

        {step === 3 && !generatedPrompt && (
          <div
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px',
              padding: '0.8rem 1rem',
              color: '#fca5a5',
              fontSize: '0.9rem'
            }}
          >
            Escribe primero tu idea en el Paso 1 para generar el prompt.
          </div>
        )}
      </div>
    </section>
  )
}

export default PromptGenerator
