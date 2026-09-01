import Navbar from "../Componente/Navbar.jsx";

const Home = () => {
  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f0f4ff",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: "#2d3550",
    },
    hero: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "96px 24px",
    },
    title: {
      fontSize: "3rem",
      fontWeight: 800,
      letterSpacing: "-1px",
      margin: 0,
      background: "linear-gradient(135deg, #6c8ef5 0%, #a67ef5 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    subtitle: {
      marginTop: "16px",
      fontSize: "1.15rem",
      color: "#6b7a9d",
      maxWidth: "620px",
      lineHeight: 1.6,
    },
    cta: {
      marginTop: "32px",
      background: "linear-gradient(135deg, #6c8ef5 0%, #a67ef5 100%)",
      color: "#ffffff",
      border: "none",
      borderRadius: "12px",
      padding: "14px 32px",
      fontSize: "1.05rem",
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "inherit",
      boxShadow: "0 4px 16px rgba(108, 142, 245, 0.35)",
    },
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <main>
        <section style={styles.hero}>
          <h1 style={styles.title}>Prompt.com</h1>
          <p style={styles.subtitle}>
            Bienvenido a Prompt.com, tu guía interactiva de Prompt Engineering.
            Descubre los mejores métodos para crear prompts efectivos y saca el
            máximo partido a cualquier modelo de inteligencia artificial.
          </p>
          <button style={styles.cta}>Comenzar</button>
        </section>
      </main>
    </div>
  );
};

export default Home;
