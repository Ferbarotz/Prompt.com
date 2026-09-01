const Navbar = () => {
  const styles = {
    nav: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 32px",
      background: "linear-gradient(135deg, #6c8ef5 0%, #a67ef5 100%)",
      color: "#ffffff",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.12)",
    },
    brand: {
      fontSize: "1.4rem",
      fontWeight: 800,
      letterSpacing: "-0.5px",
    },
    links: {
      display: "flex",
      gap: "24px",
      listStyle: "none",
      margin: 0,
      padding: 0,
    },
    link: {
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "0.95rem",
      fontWeight: 600,
      opacity: 0.9,
    },
  };

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>✨ Prompt.com</span>
      <ul style={styles.links}>
        <li><a href="#metodos" style={styles.link}>Métodos</a></li>
        <li><a href="#comparativa" style={styles.link}>Comparativa</a></li>
        <li><a href="#generador" style={styles.link}>Generador</a></li>
        <li><a href="#agentes" style={styles.link}>Agentes</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
