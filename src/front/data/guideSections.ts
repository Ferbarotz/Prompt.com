import promptNeonSmall from '../assets/home/prompt-neon-640.webp'
import promptNeonLarge from '../assets/home/prompt-neon-686.webp'
import promptRobotSmall from '../assets/home/prompt-robot-640.webp'
import promptRobotLarge from '../assets/home/prompt-robot-659.webp'
import promptBrainSmall from '../assets/home/prompt-brain-640.webp'
import promptBrainLarge from '../assets/home/prompt-brain-731.webp'

/** Imagen responsiva de una sección de la guía. */
export interface GuideImage {
  /** URL de la versión de mayor resolución. */
  src: string
  /** Candidatos para `srcset`, con su descriptor de anchura. */
  srcSet: string
  width: number
  height: number
}

/** Sección de la guía de prompts. */
export interface GuideSection {
  /** Ancla de la sección dentro de la página. */
  id: string
  title: string
  summary: string
  /**
   * Descripción para buscadores y redes.
   *
   * Va escrita a mano y no se recorta del resumen: un recorte a media frase
   * ("…que alinea al modelo con tu…") se lee como texto roto en el resultado
   * del buscador.
   */
  description: string
  details: string[]
  example: string
  /** Color de acento de la sección (hexadecimal). */
  accent: string
  /**
   * Color de acento para texto (hexadecimal).
   *
   * Es la variante oscura del acento: en el tema claro el color vivo no
   * llega al contraste que necesita un texto (WCAG AA).
   */
  accentText: string
  image: GuideImage
  imageAlt: string
}

/**
 * Contenido de la guía de prompts de la home.
 *
 * Vive aquí (y no dentro del componente) para que la misma fuente de verdad
 * alimente la interfaz y los datos estructurados `FAQPage` que usan los
 * buscadores para mostrar preguntas y respuestas directamente en los
 * resultados.
 */
export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'que-es-un-prompt',
    title: '¿Qué es un prompt?',
    summary:
      'En términos técnicos, un prompt es la especificación de entrada que condiciona cómo un LLM (Large Language Model) interpreta una tarea y genera su salida token por token. No es solo una pregunta: es una interfaz de control del comportamiento del modelo.',
    description:
      'Qué es un prompt: la especificación de entrada que condiciona cómo un LLM interpreta una tarea y genera su salida. No es solo una pregunta.',
    details: [
      'Estructura recomendada: 1) instrucción principal (qué debe hacer), 2) contexto (para quién y con qué objetivo), 3) datos de entrada (texto, tabla o caso), 4) formato de salida (JSON, lista, pasos, tabla, etc.).',
      'Los modelos no “entienden” como un humano; estiman la siguiente palabra probable según patrones aprendidos. Por eso, la redacción del prompt influye directamente en precisión, tono y nivel de detalle.',
      'Cuanto mejor delimitas cada bloque (instrucción, contexto y datos), menor ambigüedad y menos respuestas genéricas o fuera de foco.'
    ],
    example:
      'Ejemplo breve: “Actúa como analista de marketing B2B. Contexto: campaña SaaS para pymes en España. Entrada: métricas Q3 (CTR 1,8%, CPC 0,62€). Salida: 5 hipótesis priorizadas en tabla con impacto y esfuerzo”.',
    accent: '#06b6d4',
    accentText: '#0e7490',
    image: {
      src: promptNeonLarge,
      srcSet: `${promptNeonSmall} 640w, ${promptNeonLarge} 686w`,
      width: 686,
      height: 400
    },
    imageAlt: 'Texto prompt en azul neón sobre circuito tecnológico con nodos y conexiones'
  },
  {
    id: 'para-que-sirve-un-prompt',
    title: '¿Para qué sirve un prompt?',
    summary:
      'Un prompt sirve para transformar la capacidad general de un LLM en resultados útiles para una tarea concreta. Es el mecanismo que alinea el modelo con tu intención, tus restricciones y tu caso de uso.',
    description:
      'Un prompt sirve para transformar la capacidad general de un LLM en resultados útiles: es lo que alinea el modelo con tu intención y tus restricciones.',
    details: [
      'Productividad de contenido: redactar borradores, resumir documentos largos, adaptar tono (formal, técnico, divulgativo) y extraer ideas clave para presentaciones o reportes.',
      'Trabajo técnico: generar o refactorizar código, explicar errores, proponer casos de prueba y documentar funciones con criterios definidos.',
      'Análisis y operación: clasificar tickets, estructurar información no tabular, traducir, comparar opciones, sintetizar evidencia y apoyar decisiones con formatos reutilizables.',
      'En todos los casos, el prompt actúa como “guía de comportamiento”: define qué prioriza el modelo, qué evita y cómo debe entregar la respuesta.'
    ],
    example:
      'Ejemplo práctico: con un prompt bien definido puedes pedir “resume este contrato en 8 riesgos legales, cita cláusulas y sugiere mitigación en viñetas”, en lugar de obtener un resumen superficial.',
    accent: '#10b981',
    accentText: '#047857',
    image: {
      src: promptRobotLarge,
      srcSet: `${promptRobotSmall} 640w, ${promptRobotLarge} 659w`,
      width: 659,
      height: 367
    },
    imageAlt: 'Robot pensativo en tonos azules con la palabra prompt flotando en un entorno digital púrpura'
  },
  {
    id: 'claves-para-un-buen-prompt',
    title: 'Claves para un buen prompt',
    summary:
      'Las mejores prácticas de prompt engineering combinan claridad operativa, contexto suficiente y validación iterativa. Un buen prompt reduce la variabilidad y mejora la consistencia de resultados.',
    description:
      'Las claves de un buen prompt: claridad operativa, contexto suficiente, ejemplos y validación iterativa para reducir la variabilidad de la respuesta.',
    details: [
      'Sé específico y medible: define longitud, idioma, audiencia, criterios de calidad y formato exacto de salida (por ejemplo: “máximo 120 palabras + tabla de 3 columnas”).',
      'Incluye contexto relevante y elimina ruido: sector, objetivo, restricciones y datos mínimos para resolver la tarea sin suposiciones innecesarias.',
      'Usa ejemplos (few-shot) cuando necesites estilo o estructura constante; mostrar 1–3 ejemplos suele mejorar la adherencia del modelo.',
      'Divide tareas complejas en pasos (prompt chaining): investigar » sintetizar » validar. Esto suele aumentar precisión frente a “hacer todo en una sola instrucción”.',
      'Itera y refina: revisa la primera salida, corrige ambigüedades y añade criterios faltantes. Prompting eficaz = diseño + prueba + ajuste continuo.'
    ],
    example:
      'Checklist rápido: rol + objetivo + contexto + datos + restricciones + formato + ejemplo + criterio de validación.',
    accent: '#f59e0b',
    accentText: '#b45309',
    image: {
      src: promptBrainLarge,
      srcSet: `${promptBrainSmall} 640w, ${promptBrainLarge} 731w`,
      width: 731,
      height: 371
    },
    imageAlt: 'Mano tocando un cerebro de circuitos con la palabra PROMPT en un fondo azul y púrpura'
  }
]
