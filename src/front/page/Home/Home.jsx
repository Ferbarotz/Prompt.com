import Navbar from '../../Componente/Navbar'
import promptNeonImg from '../../assets/home/prompt-neon.png'
import promptBrainImg from '../../assets/home/prompt-brain.png'

const backgroundImageUrl =
  'https://images.unsplash.com/photo-1756908992154-c8a89f5e517f?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8'

const sections = [
  {
    title: '¿Qué es un prompt?',
    summary:
      'En términos técnicos, un prompt es la especificación de entrada que condiciona cómo un LLM (Large Language Model) interpreta una tarea y genera su salida token por token. No es solo una pregunta: es una interfaz de control del comportamiento del modelo.',
    details: [
      'Estructura recomendada: 1) instrucción principal (qué debe hacer), 2) contexto (para quién y con qué objetivo), 3) datos de entrada (texto, tabla o caso), 4) formato de salida (JSON, lista, pasos, tabla, etc.).',
      'Los modelos no “entienden” como un humano; estiman la siguiente palabra probable según patrones aprendidos. Por eso, la redacción del prompt influye directamente en precisión, tono y nivel de detalle.',
      'Cuanto mejor delimitas cada bloque (instrucción, contexto y datos), menor ambigüedad y menos respuestas genéricas o fuera de foco.'
    ],
    example:
      'Ejemplo breve: “Actúa como analista de marketing B2B. Contexto: campaña SaaS para pymes en España. Entrada: métricas Q3 (CTR 1,8%, CPC 0,62€). Salida: 5 hipótesis priorizadas en tabla con impacto y esfuerzo”.',
    accent: '#06b6d4',
    image: promptNeonImg,
    imageAlt: 'Texto prompt en azul neón sobre circuito tecnológico con nodos y conexiones'
  },
  {
    title: '¿Para qué sirve un prompt?',
    summary:
      'Un prompt sirve para transformar la capacidad general de un LLM en resultados útiles para una tarea concreta. Es el mecanismo que alinea al modelo con tu intención, tus restricciones y tu caso de uso.',
    details: [
      'Productividad de contenido: redactar borradores, resumir documentos largos, adaptar tono (formal, técnico, divulgativo) y extraer ideas clave para presentaciones o reportes.',
      'Trabajo técnico: generar o refactorizar código, explicar errores, proponer casos de prueba y documentar funciones con criterios definidos.',
      'Análisis y operación: clasificar tickets, estructurar información no tabular, traducir, comparar opciones, sintetizar evidencia y apoyar decisiones con formatos reutilizables.',
      'En todos los casos, el prompt actúa como “guía de comportamiento”: define qué prioriza el modelo, qué evita y cómo debe entregar la respuesta.'
    ],
    example:
      'Ejemplo práctico: con un prompt bien definido puedes pedir “resume este contrato en 8 riesgos legales, cita cláusulas y sugiere mitigación en viñetas”, en lugar de obtener un resumen superficial.',
    accent: '#10b981',
    image: promptBrainImg,
    imageAlt: 'Mano tocando un cerebro de circuitos con la palabra PROMPT en un fondo azul y púrpura'
  },
  {
    title: 'Claves para un buen prompt',
    summary:
      'Las mejores prácticas de prompt engineering combinan claridad operativa, contexto suficiente y validación iterativa. Un buen prompt reduce la variabilidad y mejora la consistencia de resultados.',
    details: [
      'Sé específico y medible: define longitud, idioma, audiencia, criterios de calidad y formato exacto de salida (por ejemplo: “máximo 120 palabras + tabla de 3 columnas”).',
      'Incluye contexto relevante y elimina ruido: sector, objetivo, restricciones y datos mínimos para resolver la tarea sin suposiciones innecesarias.',
      'Usa ejemplos (few-shot) cuando necesites estilo o estructura constante; mostrar 1–3 ejemplos suele mejorar la adherencia del modelo.',
      'Divide tareas complejas en pasos (prompt chaining): investigar → sintetizar → validar. Esto suele aumentar precisión frente a “hacer todo en una sola instrucción”.',
      'Itera y refina: revisa la primera salida, corrige ambigüedades y añade criterios faltantes. Prompting eficaz = diseño + prueba + ajuste continuo.'
    ],
    example:
      'Checklist rápido: rol + objetivo + contexto + datos + restricciones + formato + ejemplo + criterio de validación.',
    accent: '#f59e0b',
    image: promptBrainImg,
    imageAlt: 'Mano tocando un cerebro de circuitos con la palabra PROMPT en un fondo azul y púrpura'
  }
]

const Home = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        color: '#eef2ff',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        backgroundImage: `linear-gradient(140deg, rgba(5, 8, 20, 0.84), rgba(6, 10, 24, 0.86)), radial-gradient(circle at 18% 14%, rgba(59,130,246,0.32), transparent 36%), radial-gradient(circle at 82% 0%, rgba(139,92,246,0.26), transparent 32%), url(${backgroundImageUrl})`,
        backgroundSize: 'cover, cover, cover, cover',
        backgroundPosition: 'center, center, center, center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Navbar />

      <main
        style={{
          padding: '1.2rem 1rem 2rem',
          maxWidth: '1320px',
          margin: '0 auto',
          display: 'grid',
          gap: '1rem'
        }}
      >
        <section style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
          <h1
            style={{
              fontSize: 'clamp(1.85rem, 4.2vw, 2.95rem)',
              margin: '0',
              lineHeight: 1.12,
              textWrap: 'balance',
              background: 'linear-gradient(90deg, #9fd2ff 0%, #d4b7ff 50%, #ffa0de 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 10px 32px rgba(59, 130, 246, 0.22)'
            }}
          >
            Bienvenido a Prompt.com
          </h1>
        </section>

        <section>
          <article
            className="card"
            style={{
              background: 'linear-gradient(180deg, rgba(13,18,35,0.86) 0%, rgba(10,14,28,0.92) 100%)',
              border: '1px solid rgba(157, 177, 255, 0.34)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 16px 44px rgba(8, 12, 28, 0.55), 0 6px 22px rgba(99,102,241,0.2)',
              backdropFilter: 'blur(6px)'
            }}
          >
            <div
              className="card-header"
              style={{
                padding: '0.62rem 1rem',
                borderBottom: '1px solid rgba(111, 137, 255, 0.28)',
                background: 'linear-gradient(90deg, rgba(59,130,246,0.24), rgba(139,92,246,0.22), rgba(6,182,212,0.2))',
                color: '#eaf1ff',
                textTransform: 'uppercase',
                letterSpacing: '0.11em',
                fontSize: '0.78rem',
                fontWeight: 800
              }}
            >
              prompt
            </div>

            <div
              className="card-body"
              style={{
                padding: '1rem',
                display: 'grid',
                gap: '0.95rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))'
              }}
            >
              {sections.map((section) => (
                <section
                  key={section.title}
                  style={{
                    border: `1px solid ${section.accent}66`,
                    borderRadius: '12px',
                    background: 'linear-gradient(150deg, rgba(11,17,34,0.94) 0%, rgba(24,31,52,0.88) 100%)',
                    padding: '1rem',
                    boxShadow: `0 8px 22px ${section.accent}1f`,
                    display: 'grid',
                    gap: '0.8rem',
                    alignContent: 'start'
                  }}
                >
                  <img
                    src={section.image}
                    alt={section.imageAlt}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      border: `1px solid ${section.accent}77`,
                      boxShadow: `0 8px 18px ${section.accent}28`
                    }}
                  />

                  <h3
                    className="card-title"
                    style={{
                      margin: 0,
                      fontSize: '1.28rem',
                      lineHeight: 1.35,
                      background: `linear-gradient(90deg, ${section.accent} 0%, #b690ff 100%)`,
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
                      color: '#edf3ff',
                      lineHeight: 1.72,
                      fontSize: '1.08rem'
                    }}
                  >
                    {section.summary}
                  </p>

                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#e2eaff', lineHeight: 1.68, fontSize: '1.03rem' }}>
                    {section.details.map((detail) => (
                      <li key={detail} style={{ marginBottom: '0.48rem' }}>
                        {detail}
                      </li>
                    ))}
                  </ul>

                  <p
                    className="card-text"
                    style={{
                      margin: 0,
                      color: '#d6e3ff',
                      lineHeight: 1.68,
                      fontSize: '1.01rem',
                      fontStyle: 'italic'
                    }}
                  >
                    {section.example}
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
