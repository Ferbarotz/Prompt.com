import Navbar from '../../Componente/Navbar'

const sections = [
  {
    title: '¿Qué es un prompt?',
    text:
      'Un prompt es la instrucción o mensaje que le escribes a una inteligencia artificial para indicarle qué tarea debe realizar. Es la forma en que te comunicas con la IA para obtener una respuesta específica.',
    accent: '#06b6d4'
  },
  {
    title: '¿Para qué sirve un prompt?',
    text:
      'Un prompt sirve para guiar a la inteligencia artificial hacia la respuesta que necesitas. Con un buen prompt puedes obtener textos, ideas, resúmenes, código y mucho más, de forma clara y precisa.',
    accent: '#10b981'
  },
  {
    title: 'Claves para un buen prompt',
    text:
      'Sé claro y específico: cuanto más detallada sea tu instrucción, mejor será la respuesta. Indica el contexto, el formato deseado y el tono que esperas.',
    accent: '#f59e0b'
  }
]

const Home = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        color: '#eef2ff',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        background:
          'radial-gradient(circle at 10% 10%, rgba(59,130,246,0.18), transparent 35%), radial-gradient(circle at 90% 0%, rgba(139,92,246,0.2), transparent 30%), radial-gradient(circle at 80% 80%, rgba(6,182,212,0.16), transparent 35%), #0a0a0f'
      }}
    >
      <Navbar />

      <main style={{ padding: '4rem 1.5rem 5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <section style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              marginBottom: '1rem',
              background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 45%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Bienvenido a Prompt.com
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#c4ccf9', maxWidth: '680px', margin: '0 auto' }}>
            Tu guía para crear mejores prompts con inteligencia artificial.
          </p>
        </section>

        <section>
          <article
            className="card"
            style={{
              background: 'linear-gradient(180deg, rgba(17,24,39,0.88) 0%, rgba(15,23,42,0.94) 100%)',
              border: '1px solid rgba(99,102,241,0.42)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 14px 42px rgba(59,130,246,0.16), 0 6px 20px rgba(139,92,246,0.2)'
            }}
          >
            <div
              className="card-header"
              style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid rgba(6,182,212,0.35)',
                background: 'linear-gradient(90deg, rgba(59,130,246,0.22), rgba(139,92,246,0.22), rgba(6,182,212,0.22))',
                color: '#e9e7ff',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.78rem',
                fontWeight: 800
              }}
            >
              prompt
            </div>

            <div
              className="card-body"
              style={{
                padding: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              {sections.map((section) => (
                <section
                  key={section.title}
                  style={{
                    border: `1px solid ${section.accent}66`,
                    borderRadius: '12px',
                    background:
                      'linear-gradient(145deg, rgba(15,23,42,0.96) 0%, rgba(30,41,59,0.9) 100%)',
                    padding: '1rem',
                    minHeight: '100%',
                    boxShadow: `0 8px 24px ${section.accent}22`
                  }}
                >
                  <h3
                    className="card-title"
                    style={{
                      margin: '0 0 0.65rem',
                      fontSize: '1.15rem',
                      lineHeight: 1.35,
                      background: `linear-gradient(90deg, ${section.accent} 0%, #8b5cf6 100%)`,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent'
                    }}
                  >
                    {section.title}
                  </h3>
                  <p
                    className="card-text"
                    style={{
                      margin: 0,
                      color: '#d5dbff',
                      lineHeight: 1.6,
                      fontSize: '0.98rem'
                    }}
                  >
                    {section.text}
                  </p>
                </section>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

export default Home
