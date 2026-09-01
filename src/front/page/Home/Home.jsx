import Navbar from '../../Componente/Navbar'

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#fff', fontFamily: 'sans-serif' }}>
      <Navbar />
      <main style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Bienvenido a Prompt.com</h1>
        <p style={{ fontSize: '1.2rem', color: '#aaa', maxWidth: '600px', margin: '0 auto' }}>
          Tu guía para crear mejores prompts con inteligencia artificial.
        </p>
      </main>
    </div>
  )
}

export default Home
