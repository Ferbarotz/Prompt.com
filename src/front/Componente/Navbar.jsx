const Navbar = () => {
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'linear-gradient(90deg, rgba(15,23,42,0.95) 0%, rgba(17,24,39,0.92) 60%, rgba(30,27,75,0.9) 100%)',
        borderBottom: '1px solid rgba(99,102,241,0.45)',
        boxShadow: '0 6px 18px rgba(59,130,246,0.14)'
      }}
    >
      <span
        style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          letterSpacing: '0.02em',
          background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 38%, #8b5cf6 72%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}
      >
        Prompt.com
      </span>

      <button
        style={{
          background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 55%, #ec4899 100%)',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.25)',
          padding: '0.55rem 1.55rem',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '700',
          boxShadow: '0 8px 22px rgba(139,92,246,0.3)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
      >
        Prompt
      </button>
    </nav>
  )
}

export default Navbar
