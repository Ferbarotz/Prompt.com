import Navbar from '../Componente/Navbar'
import PromptGenerator from '../Componente/PromptGenerator'

const GeneratorPage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        color: '#eef2ff',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        backgroundImage: `linear-gradient(140deg, rgba(5, 8, 20, 0.84), rgba(6, 10, 24, 0.86)), radial-gradient(circle at 18% 14%, rgba(59,130,246,0.32), transparent 36%), radial-gradient(circle at 82% 0%, rgba(139,92,246,0.26), transparent 32%)`,
        backgroundSize: 'cover, cover, cover',
        backgroundPosition: 'center, center, center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Navbar />
      <main
        style={{
          padding: '2rem 1.2rem 3rem',
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'grid',
          gap: '1.5rem'
        }}
      >
        <section style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
              margin: '0 0 0.5rem',
              lineHeight: 1.15,
              textWrap: 'balance',
              background: 'linear-gradient(90deg, #9fd2ff 0%, #d4b7ff 50%, #ffa0de 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Generador de Prompts
          </h1>
          <p style={{ color: '#a5b4fc', fontSize: '1rem', margin: 0 }}>
            Describe tu idea y obtén un prompt profesional en segundos
          </p>
        </section>

        <PromptGenerator />
      </main>
    </div>
  )
}

export default GeneratorPage
