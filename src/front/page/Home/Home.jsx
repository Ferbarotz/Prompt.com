import Navbar from '../../Componente/Navbar'

const sections = [
  {
    title: '¿Qué es un prompt?',
    text:
      'Un prompt es la instrucción o mensaje que le escribes a una inteligencia artificial para indicarle qué tarea debe realizar. Es la forma en que te comunicas con la IA para obtener una respuesta específica.'
  },
  {
    title: '¿Para qué sirve un prompt?',
    text:
      'Un prompt sirve para guiar a la inteligencia artificial hacia la respuesta que necesitas. Con un buen prompt puedes obtener textos, ideas, resúmenes, código y mucho más, de forma clara y precisa.'
  },
  {
    title: 'Claves para un buen prompt',
    text:
      'Sé claro y específico: cuanto más detallada sea tu instrucción, mejor será la respuesta. Indica el contexto, el formato deseado y el tono que esperas.'
  }
]

const Home = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        color: '#fff',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}
    >
      <Navbar />

      <main style={{ padding: '4rem 1.5rem 5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <section style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>Bienvenido a Prompt.com</h1>
          <p style={{ fontSize: '1.1rem', color: '#b0b0b0', maxWidth: '680px', margin: '0 auto' }}>
            Tu guía para crear mejores prompts con inteligencia artificial.
          </p>
        </section>

        <section>
          <article
            className="card"
            style={{
              background: 'linear-gradient(180deg, #1a1a1a 0%, #151515 100%)',
              border: '1px solid #2b2b2b',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div
              className="card-header"
              style={{
                padding: '0.65rem 1rem',
                borderBottom: '1px solid #2b2b2b',
                color: '#8f96ff',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
            >
              prompt
            </div>

            <div
              className="card-body"
              style={{
                padding: '1.2rem',
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
              }}
            >
              {sections.map((section) => (
                <section
                  key={section.title}
                  style={{
                    border: '1px solid #2b2b2b',
                    borderRadius: '10px',
                    backgroundColor: '#181818',
                    padding: '1rem',
                    minHeight: '100%'
                  }}
                >
                  <h3
                    className="card-title"
                    style={{ margin: '0 0 0.65rem', fontSize: '1.15rem', lineHeight: 1.35, color: '#ffffff' }}
                  >
                    {section.title}
                  </h3>
                  <p className="card-text" style={{ margin: 0, color: '#c8c8c8', lineHeight: 1.6, fontSize: '0.98rem' }}>
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
