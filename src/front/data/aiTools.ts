/**
 * Catálogo de herramientas de IA por tipo de tarea.
 *
 * El generador no llama a ningún modelo: solo escribe un prompt. Para cerrar
 * el ciclo, este catálogo dice dónde pegar ese prompt (con enlace directo) y
 * por qué cada herramienta encaja con la tarea elegida.
 *
 * La primera herramienta de cada lista es la recomendada: suele ser la que
 * mejor sigue el formato de salida que pide la plantilla del tipo de tarea.
 *
 * Aviso: los enlaces y las condiciones de acceso cambian según el proveedor.
 * Prompt.com no está afiliado a ninguna de estas herramientas.
 */

/** Herramienta de IA recomendada para un tipo de tarea. */
export interface AiTool {
  /** Nombre visible. */
  name: string
  /** Enlace oficial a la herramienta. */
  url: string
  /** Motivo en una línea: por qué encaja con esta tarea. */
  note: string
  /** Si es la opción destacada de la lista. */
  recommended?: boolean
}

/** Recomendación completa para un tipo de tarea. */
export interface AiToolsSuggestion {
  /** Texto introductorio del bloque. */
  intro: string
  /** Herramientas sugeridas, con la recomendada en primera posición. */
  tools: AiTool[]
}

/** Lista genérica cuando un tipo de tarea no tiene recomendación propia. */
const GENERAL_TOOLS: AiTool[] = [
  {
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    note: 'Opción generalista: sigue bien los formatos largos y permite iterar.',
    recommended: true
  },
  {
    name: 'Claude',
    url: 'https://claude.ai',
    note: 'Alternativa fuerte para textos extensos y trabajo por secciones.'
  },
  {
    name: 'Gemini',
    url: 'https://gemini.google.com',
    note: 'Útil si trabajas dentro del ecosistema de Google.'
  }
]

const INTRO =
  'El generador solo escribe el prompt: quien produce el resultado es el modelo que elijas. Estas son las herramientas que mejor encajan con esta tarea.'

/** Recomendaciones indexadas por id de tipo de tarea. */
export const AI_TOOLS_BY_TASK: Record<string, AiToolsSuggestion> = {
  web: {
    intro: INTRO,
    tools: [
      {
        name: 'Claude Code',
        url: 'https://claude.ai/code',
        note: 'Escribe el proyecto en tu máquina, ejecuta los comandos y entrega el código listo.',
        recommended: true
      },
      {
        name: 'v0 (Vercel)',
        url: 'https://v0.dev',
        note: 'Convierte la descripción en una interfaz funcional y editable en el navegador.'
      },
      {
        name: 'Lovable',
        url: 'https://lovable.dev',
        note: 'App completa con base de datos y despliegue, sin montar entorno.'
      },
      {
        name: 'Cursor',
        url: 'https://cursor.com',
        note: 'Para refinar el código dentro del editor, con contexto de todo el repositorio.'
      },
      {
        name: 'ChatGPT',
        url: 'https://chatgpt.com',
        note: 'Alternativa generalista con análisis de código y pestañas de Canvas.'
      }
    ]
  },

  contenido: {
    intro: INTRO,
    tools: [
      {
        name: 'ChatGPT',
        url: 'https://chatgpt.com',
        note: 'Muy fiable variando tonos y formatos; rápido para probar tres ganchos.',
        recommended: true
      },
      {
        name: 'Claude',
        url: 'https://claude.ai',
        note: 'Muy bueno en textos largos con estructura (artículos, newsletters) y sin sobrevender.'
      },
      {
        name: 'Gemini',
        url: 'https://gemini.google.com',
        note: 'Cómodo si editas después en Google Docs o publicas desde el ecosistema de Google.'
      },
      {
        name: 'Predis',
        url: 'https://predis.ai',
        note: 'Genera publicaciones y carruseles con imágenes, listo para publicar.'
      }
    ]
  },

  codigo: {
    intro: INTRO,
    tools: [
      {
        name: 'Claude Code',
        url: 'https://claude.ai/code',
        note: 'Trabaja en tu repositorio, ejecuta los tests y refactoriza siguiendo el estilo del proyecto.',
        recommended: true
      },
      {
        name: 'GitHub Copilot',
        url: 'https://github.com/features/copilot',
        note: 'Autocompletado y chat dentro del IDE, para escribir en flujo.'
      },
      {
        name: 'Cursor',
        url: 'https://cursor.com',
        note: 'Editor con IA que entiende todo el proyecto y permite revisar cambios.'
      },
      {
        name: 'ChatGPT',
        url: 'https://chatgpt.com',
        note: 'Para revisar un fragmento, encontrar el error o pedir los tests aparte.'
      }
    ]
  },

  analisis: {
    intro: INTRO,
    tools: [
      {
        name: 'ChatGPT (análisis de datos)',
        url: 'https://chatgpt.com',
        note: 'Sube el CSV y usa su intérprete de Python para calcular y tabular los resultados.',
        recommended: true
      },
      {
        name: 'Claude',
        url: 'https://claude.ai',
        note: 'Excelente revisando el razonamiento: separa hechos, inferencias y supuestos.'
      },
      {
        name: 'Julius AI',
        url: 'https://julius.ai',
        note: 'Análisis de CSV con gráficos automáticos, sin escribir código.'
      },
      {
        name: 'Google Colab',
        url: 'https://colab.research.google.com',
        note: 'Notebooks reproducibles para dejar el cálculo documentado.'
      }
    ]
  },

  imagen: {
    intro: INTRO,
    tools: [
      {
        name: 'Midjourney',
        url: 'https://www.midjourney.com',
        note: 'La calidad estética más alta en fotografía e ilustración; ideal para portadas.',
        recommended: true
      },
      {
        name: 'ChatGPT (generación de imágenes)',
        url: 'https://chatgpt.com',
        note: 'Genera y edita la imagen dentro de la conversación, sin salir del chat.'
      },
      {
        name: 'Ideogram',
        url: 'https://ideogram.ai',
        note: 'El mejor cuando el texto tiene que aparecer legible dentro de la imagen.'
      },
      {
        name: 'Leonardo AI',
        url: 'https://leonardo.ai',
        note: 'Control de estilo, prompts negativos y variaciones para series coherentes.'
      },
      {
        name: 'Flux (fal.ai)',
        url: 'https://fal.ai/models/fal-ai/flux',
        note: 'Modelos abiertos, con control fino de la semilla y de los parámetros.'
      }
    ]
  },

  video: {
    intro: INTRO,
    tools: [
      {
        name: 'ChatGPT',
        url: 'https://chatgpt.com',
        note: 'Redacta el guion plano a plano y luego itera cada plano por separado.',
        recommended: true
      },
      {
        name: 'Claude',
        url: 'https://claude.ai',
        note: 'Muy estable en guiones largos con tabla de tiempos y locución.'
      },
      {
        name: 'Sora',
        url: 'https://sora.com',
        note: 'Convierte el guion en vídeo; úsalo para validar el concepto antes de grabar.'
      },
      {
        name: 'Runway',
        url: 'https://runwayml.com',
        note: 'Generación y edición de vídeo con control de plano y movimiento de cámara.'
      },
      {
        name: 'Kling',
        url: 'https://klingai.com',
        note: 'Buena continuidad entre planos y en planos de acción con movimiento.'
      }
    ]
  },

  email: {
    intro: INTRO,
    tools: [
      {
        name: 'ChatGPT',
        url: 'https://chatgpt.com',
        note: 'Genera cinco asuntos, preheader y cuerpo; con el mismo prompt salen variantes.',
        recommended: true
      },
      {
        name: 'Claude',
        url: 'https://claude.ai',
        note: 'Mantiene el registro formal o cercano que pidas, sin pasarse de subido.'
      },
      {
        name: 'Gemini',
        url: 'https://gemini.google.com',
        note: 'Práctico si después redactas y envías desde Gmail.'
      },
      {
        name: 'Lavender',
        url: 'https://www.lavender.ai',
        note: 'Revisa el email antes de enviarlo y estima la probabilidad de respuesta.'
      },
      {
        name: 'Brevo',
        url: 'https://www.brevo.com',
        note: 'Envío, plantillas y automatización de campañas cuando ya tienes la lista.'
      }
    ]
  },

  seo: {
    intro: INTRO,
    tools: [
      {
        name: 'Perplexity',
        url: 'https://www.perplexity.ai',
        note: 'Investiga con fuentes y citas: ideal para la parte de búsqueda e intención.',
        recommended: true
      },
      {
        name: 'ChatGPT',
        url: 'https://chatgpt.com',
        note: 'Escribe las meta tags, la estructura de encabezados y el schema.org en JSON.'
      },
      {
        name: 'Claude',
        url: 'https://claude.ai',
        note: 'Redacta contenidos de fondo con buena densidad semántica y sin relleno.'
      },
      {
        name: 'Ahrefs',
        url: 'https://ahrefs.com',
        note: 'Datos reales de keywords, dificultad y backlinks para priorizar de verdad.'
      },
      {
        name: 'Surfer SEO',
        url: 'https://surferseo.com',
        note: 'Optimiza el texto comparándolo con la SERP de la keyword objetivo.'
      }
    ]
  },

  resumen: {
    intro: INTRO,
    tools: [
      {
        name: 'Claude',
        url: 'https://claude.ai',
        note: 'Fiel al original y con las cifras y condiciones exactas, sin inventar nada.',
        recommended: true
      },
      {
        name: 'ChatGPT',
        url: 'https://chatgpt.com',
        note: 'Sube el PDF y resume por secciones, con opción de comparar documentos.'
      },
      {
        name: 'Gemini',
        url: 'https://gemini.google.com',
        note: 'Contexto largo: mejor para contratos o informes de muchas páginas.'
      },
      {
        name: 'NotebookLM',
        url: 'https://notebooklm.google.com',
        note: 'Interroga tus propias fuentes y responde con citas a la página exacta.'
      }
    ]
  },

  traduccion: {
    intro: INTRO,
    tools: [
      {
        name: 'DeepL',
        url: 'https://www.deepl.com',
        note: 'La calidad de la traducción de español a inglés es más natural, y conserva el formato original.',
        recommended: true
      },
      {
        name: 'ChatGPT',
        url: 'https://chatgpt.com',
        note: 'Mejor para adaptar el tono comercial o mantener un glosario de marca.'
      },
      {
        name: 'Claude',
        url: 'https://claude.ai',
        note: 'Fiel al sentido original y con notas de traducción justificadas.'
      },
      {
        name: 'Lokalise',
        url: 'https://lokalise.com',
        note: 'Gestiona la traducción de un producto con control de calidad por idioma.'
      }
    ]
  }
}

/**
 * Devuelve la recomendación de herramientas para un tipo de tarea.
 * Si el tipo no tiene lista propia, cae en la generalista.
 */
export const getAiTools = (taskId: string): AiToolsSuggestion =>
  AI_TOOLS_BY_TASK[taskId] ?? { intro: INTRO, tools: GENERAL_TOOLS }
