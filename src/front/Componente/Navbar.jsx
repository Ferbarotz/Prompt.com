const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#1a1a1a',
      borderBottom: '1px solid #333'
    }}>
      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>Prompt.com</span>
      <button style={{
        backgroundColor: '#6366f1',
        color: '#fff',
        border: 'none',
        padding: '0.5rem 1.5rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold'
      }}>
        Prompt
      </button>
    </nav>
  )
}

export default Navbar
