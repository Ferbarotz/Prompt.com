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
    button: {
      background: "#ffffff",
      color: "#6c8ef5",
      border: "none",
      borderRadius: "999px",
      padding: "10px 24px",
      fontSize: "0.95rem",
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "inherit",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      transition: "transform 0.15s ease, opacity 0.15s ease",
    },
  };

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>✨ Prompt.com</span>
      <button
        style={styles.button}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.opacity = "0.92";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.opacity = "1";
        }}
      >
        Prompt
      </button>
    </nav>
  );
};

export default Navbar;
