import Navbar from '../../Componente/Navbar'

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
    accent: '#06b6d4'
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
    accent: '#10b981'
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
                      margin: '0 0 0.7rem',
                      color: '#d5dbff',
                      lineHeight: 1.65,
                      fontSize: '0.98rem'
                    }}
                  >
                    {section.summary}
                  </p>

                  <ul style={{ margin: '0 0 0.8rem', paddingLeft: '1.1rem', color: '#d5dbff', lineHeight: 1.6, fontSize: '0.97rem' }}>
                    {section.details.map((detail) => (
                      <li key={detail} style={{ marginBottom: '0.45rem' }}>
                        {detail}
                      </li>
                    ))}
                  </ul>

                  <p
                    className="card-text"
                    style={{
                      margin: 0,
                      color: '#c9d6ff',
                      lineHeight: 1.65,
                      fontSize: '0.96rem',
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
