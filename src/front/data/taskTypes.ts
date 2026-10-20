/**
 * Catálogo de tipos de tarea del generador de prompts.
 *
 * Antes el generador aplicaba siempre la misma plantilla (una web con navbar,
 * hero y footer) sea cual fuera la tarea, así que elegir "Video promocional"
 * devolvía un prompt para construir un sitio web. Aquí cada tipo de tarea
 * define sus propios campos de detalle y su propia plantilla, de forma que el
 * prompt generado se ajuste a lo que el usuario realmente quiere.
 *
 * La estructura de todas las plantillas sigue la guía de la home:
 * rol + objetivo + contexto + datos + restricciones + formato + validación.
 */

/** Campo de detalle que se muestra en el paso 2 del generador. */
export interface PromptField {
  /** Clave interna del valor dentro de `details`. */
  key: string
  /** Etiqueta visible del control. */
  label: string
  /** Opciones del desplegable. */
  options: string[]
}

/** Entrada que recibe la plantilla de cada tipo de tarea. */
export interface TaskBuildInput {
  /** Lo que el usuario ha escrito en el paso 1. */
  idea: string
  /** Valores de los campos del paso 2, indexados por `PromptField.key`. */
  details: Record<string, string>
  /** Aclaraciones libres del paso 3. */
  extra: string
}

/** Tipo de tarea del generador. */
export interface TaskType {
  id: string
  label: string
  icon: string
  hint: string
  exampleIdea: string
  fields: PromptField[]
  build: (input: TaskBuildInput) => string
}

/** Crea una línea de contexto del tipo `- Etiqueta: valor` si hay valor. */
const bullet = (label: string, value?: string): string =>
  value ? `- ${label}: ${value}` : ''

/**
 * Construye el bloque de contexto de una plantilla.
 * Si el usuario no ha rellenado ningún campo, se indica que el modelo debe
 * inferir y declarar sus supuestos (mejor que un bloque vacío).
 */
const contextBlock = (
  details: Record<string, string>,
  fields: Array<[string, string]>
): string => {
  const rows = fields
    .map(([key, label]) => bullet(label, details[key]))
    .filter(Boolean)
    .join('\n')

  return (
    rows ||
    '- Contexto no especificado: infiere lo más razonable a partir del objetivo y declara explícitamente los supuestos que asumas.'
  )
}

/** Añade el bloque final con las aclaraciones libres del usuario. */
const clarifications = (extra: string): string =>
  extra ? `## Aclaraciones adicionales\n${extra.trim()}\n\n` : ''

export const TASK_TYPES: TaskType[] = [
  {
    id: 'web',
    label: 'Sitio web o app',
    icon: '🖥️',
    hint: 'Landing, web, e-commerce o app',
    exampleIdea:
      'Una landing para una app que ayuda a transportistas a organizar sus rutas de reparto',
    fields: [
      {
        key: 'plataforma',
        label: 'Tipo de proyecto',
        options: [
          'Landing page de una sola página',
          'Sitio web multipágina',
          'Aplicación web (SaaS / panel de control)',
          'E-commerce / tienda online',
          'App móvil (iOS / Android)',
          'Portfolio personal'
        ]
      },
      {
        key: 'stack',
        label: 'Stack tecnológico',
        options: [
          'React + Tailwind CSS',
          'Next.js (App Router)',
          'Vue 3 + Nuxt',
          'Astro',
          'HTML, CSS y JavaScript puros',
          'WordPress / WooCommerce',
          'Sin preferencia: elige la opción más moderna'
        ]
      },
      {
        key: 'estilo',
        label: 'Estilo visual',
        options: [
          'Minimalista y elegante',
          'Moderno con gradientes y glassmorphism',
          'Corporativo y profesional',
          'Creativo y colorido',
          'Oscuro / dark mode',
          'Retro / vintage',
          'Futurista / sci-fi'
        ]
      }
    ],
    build: ({ idea, details, extra }: TaskBuildInput) => `Actúa como un diseñador de producto y desarrollador front-end senior, capaz de convertir una idea difusa en una interfaz clara y orientada a conversión.

## Objetivo
${idea.trim()}

## Contexto
${contextBlock(details, [
    ['plataforma', 'Tipo de proyecto'],
    ['stack', 'Stack tecnológico'],
    ['estilo', 'Estilo visual']
  ])}

## Requisitos técnicos
- Diseño moderno, limpio y profesional, con jerarquía visual evidente
- Responsive real (móvil, tablet y escritorio), no una simple reescala
- Escala tipográfica consistente y contraste mínimo AA en todos los textos
- Paleta armónica con un único color de acento definido y gradientes sutiles
- Espaciado basado en una escala de 4 u 8 px y radios de borde coherentes
- Estados de interacción definidos: hover, focus-visible, active y deshabilitado
- Animaciones y transiciones CSS suaves, respetando prefers-reduced-motion

## Estructura
1. Header con navegación clara y CTA visible
2. Hero con propuesta de valor y CTA principal
3. Bloque de beneficios o características
4. Bloque visual (capturas, galería, demostración o portafolio)
5. Bloque de confianza (testimonios, cifras o datos)
6. CTA de cierre destacado
7. Footer con enlaces, contacto y avisos legales

## Requisitos adicionales
- Accesibilidad WCAG 2.1 AA: navegación por teclado, roles ARIA y alt en imágenes
- SEO básico: meta tags, Open Graph, datos estructurados y URLs semánticas
- Performance: Lighthouse 90+ en móvil, imágenes optimizadas y carga diferida
- Código comentado explicando el propósito de cada sección

${clarifications(extra)}## Entregable
Código fuente completo, funcional y listo para ejecutar, con instrucciones de instalación y despliegue.`
  },

  {
    id: 'contenido',
    label: 'Contenido o redes sociales',
    icon: '✍️',
    hint: 'Posts, artículos, guiones, newsletters',
    exampleIdea:
      'Un post para LinkedIn que explique a empresas por qué automatizar la atención al cliente',
    fields: [
      {
        key: 'canal',
        label: 'Canal',
        options: [
          'Instagram',
          'LinkedIn',
          'TikTok',
          'X / Twitter',
          'Blog',
          'Newsletter por email',
          'YouTube (descripción y título)'
        ]
      },
      {
        key: 'tono',
        label: 'Tono',
        options: [
          'Profesional y cercano',
          'Divertido y desenfadado',
          'Técnico y autorizado',
          'Inspiracional y emocional',
          'Directo y sin rodeos',
          'Corporativo / institucional'
        ]
      },
      {
        key: 'formato',
        label: 'Formato',
        options: [
          'Carrusel para Instagram',
          'Publicación corta',
          'Artículo de blog (800-1200 palabras)',
          'Guion de vídeo corto',
          'Thread / serie de publicaciones',
          'Email de newsletter'
        ]
      }
    ],
    build: ({ idea, details, extra }: TaskBuildInput) => `Actúa como un redactor de contenido digital con experiencia en contenidos que consiguen retención y conversiones, no solo relleno.

## Objetivo
${idea.trim()}

## Contexto
${contextBlock(details, [
    ['canal', 'Canal'],
    ['tono', 'Tono'],
    ['formato', 'Formato']
  ])}

## Requisitos de redacción
- Abre con un gancho claro en las dos primeras líneas: una pregunta, un dato insólito o una tensión
- Estructura clara: una idea por párrafo, frases cortas, sin relleno ni muletillas
- Usa ejemplos concretos y verificables; evita afirmaciones grandilocuentes sin respaldo
- Longitud ajustada al formato elegido, sin repetir la misma idea en distintos párrafos
- Si el texto es en español de España, evita regionalismos que no se entiendan fuera del mercado local
- Cierra con una llamada a la acción clara y una sola

## Formato de salida
1. Tres variantes de gancho para testear
2. La pieza final, lista para publicar
3. Cinco hashtags relevantes (o ninguno, si el canal lo desaconseja)
4. Tres ideas de CTA alternativas
5. Una nota de qué aviso legal o etiquetado conviene revisar antes de publicar

${clarifications(extra)}## Criterio de validación
Antes de entregar, comprueba que la pieza se entiende con una sola lectura, que no contiene afirmaciones inventadas y que el gancho y el cierre conectan con el objetivo.

## Entregable
La pieza final en Markdown, seguida de las variantes y notas, sin explicaciones sobre tu propio proceso.`
  },

  {
    id: 'codigo',
    label: 'Código o desarrollo',
    icon: '⌨️',
    hint: 'Funciones, refactor, tests, debugging',
    exampleIdea:
      'Una función en Python que agrupe una lista de transacciones por cliente y detecte anomalías',
    fields: [
      {
        key: 'lenguaje',
        label: 'Lenguaje',
        options: [
          'JavaScript / TypeScript',
          'Python',
          'Java',
          'C# / .NET',
          'PHP',
          'Go',
          'Rust',
          'SQL',
          'Otro (indícalo en el objetivo)'
        ]
      },
      {
        key: 'framework',
        label: 'Framework o librería',
        options: [
          'React',
          'Node.js / Express',
          'Django / Flask',
          'Spring Boot',
          'Next.js',
          'Sin framework: librería estándar',
          'Sin preferencia: elige tú'
        ]
      },
      {
        key: 'tipoTarea',
        label: 'Tipo de tarea',
        options: [
          'Crear desde cero',
          'Refactorizar código existente',
          'Corregir un error',
          'Optimizar rendimiento',
          'Escribir tests',
          'Documentar código existente',
          'Revisar seguridad'
        ]
      }
    ],
    build: ({ idea, details, extra }: TaskBuildInput) => `Actúa como un ingeniero de software senior que prioriza código legible, mantenible y seguro por encima de la brevedad.

## Objetivo
${idea.trim()}

## Contexto
${contextBlock(details, [
    ['lenguaje', 'Lenguaje'],
    ['framework', 'Framework o librería'],
    ['tipoTarea', 'Tipo de tarea']
  ])}

## Requisitos técnicos
- Código limpio, idiomático y siguiendo las convenciones del lenguaje y del framework
- Nombres descriptivos y funciones cohesionadas, con una responsabilidad por función
- Gestión explícita de errores y de casos límite; nada de try/except vacío ni de Optional ignorado
- Tipado o anotaciones de tipos en la firma cuando el lenguaje lo permita
- Sin dependencias nuevas salvo que sean justifiable; si añades una, explica por qué
- Nada de código simulado, placeholders con "..." ni TODOs: el resultado debe ser ejecutable
- Comentarios solo donde expliquen el porqué, nunca el qué

## Pruebas
- Incluye casos de prueba para el camino feliz, los casos límite y los errores
- Cada test debe poder ejecutarse de forma aislada

${clarifications(extra)}## Formato de salida
1. Una breve explicación de las decisiones de diseño relevantes (máximo 5 líneas)
2. El código completo en un único bloque, listo para copiar y ejecutar
3. Un bloque de tests aparte
4. Cómo ejecutarlo y qué dependencias necesita

## Entregable
Código completo y funcional, con instrucciones de ejecución. Si falta información imprescindible, pregunta antes de inventar.`
  },

  {
    id: 'analisis',
    label: 'Análisis de datos',
    icon: '📊',
    hint: 'Excel, SQL, informes, insights',
    exampleIdea:
      'Analizar los datos de ventas del último trimestre y detectar qué productos generan margen',
    fields: [
      {
        key: 'fuenteDatos',
        label: 'Fuente de datos',
        options: [
          'CSV / Excel',
          'Base de datos SQL',
          'Hoja de cálculo',
          'API / JSON',
          'Texto plano o tabular',
          'Datos pegados directamente en el prompt'
        ]
      },
      {
        key: 'tipoAnalisis',
        label: 'Tipo de análisis',
        options: [
          'Descriptivo (resumir y describir)',
          'Diagnóstico (investigar una desviación)',
          'Comparativo (contrastar periodos o grupos)',
          'Predictivo (estimar o proyectar)',
          'Exploratorio (encontrar patrones)',
          'Prescriptivo (recomendar acciones)'
        ]
      },
      {
        key: 'formato',
        label: 'Formato de salida',
        options: [
          'Tabla markdown',
          'Informe con apartados',
          'Lista de hallazgos priorizados',
          'JSON estructurado',
          'Resumen ejecutivo de una página'
        ]
      }
    ],
    build: ({ idea, details, extra }: TaskBuildInput) => `Actúa como un analista de datos senior: riguroso, escéptico y capaz de distinguir un patrón real de una casualidad.

## Objetivo
${idea.trim()}

## Contexto
${contextBlock(details, [
    ['fuenteDatos', 'Fuente de datos'],
    ['tipoAnalisis', 'Tipo de análisis'],
    ['formato', 'Formato de salida']
  ])}

## Requisitos de análisis
- Trabaja solo con los datos proporcionados; si faltan datos, dilo explícitamente en lugar de rellenarlos
- Normaliza nombres de columnas, unidades y fechas antes de operar; indica cualquier supuesto de normalización
- Cuantifica siempre: porcentajes, deltas absolutos y relativos, y tamaño de muestra
- Distingue entre correlación y causalidad, y señala cuando una conclusión no está soportada por los datos
- Marca los valores atípicos, los nulos y los sesgos que puedan sesgar el resultado
- Si el volumen de datos es grande, describe el procedimiento y da los resultados representativos

${clarifications(extra)}## Formato de salida
1. Resumen ejecutivo (3-5 líneas con la conclusión principal)
2. Hallazgos detallados, cada uno con su evidencia numérica
3. Tabla o listado de resultados según el formato pedido
4. Limitaciones del análisis y qué datos adicionales serían útiles
5. Recomendaciones accionables, priorizadas por impacto

## Criterio de validación
Comprueba que cada cifra citada sea trazable a los datos de entrada y que ninguna afirmación exceda lo que los datos permiten concluir.

## Entregable
El análisis completo, con las tablas en markdown listas para copiar.`
  },

  {
    id: 'imagen',
    label: 'Imagen o diseño',
    icon: '🎨',
    hint: 'Midjourney, DALL·E, Flux, Stable Diffusion',
    exampleIdea:
      'Una ilustración para la portada de un artículo sobre cómo funciona la energía solar',
    fields: [
      {
        key: 'modelo',
        label: 'Modelo de generación',
        options: [
          'Midjourney v7',
          'DALL·E 3 (ChatGPT / API)',
          'Flux (Black Forest Labs)',
          'Stable Diffusion XL',
          'Leonardo AI',
          'Gemini / Imagen 3',
          'Sin preferencia: redacta para uso genérico'
        ]
      },
      {
        key: 'estiloVisual',
        label: 'Estilo visual',
        options: [
          'Fotorealista',
          'Ilustración editorial vectorial',
          '3D isométrico',
          'Acuarela / ilustración tradicional',
          'Cyberpunk / sci-fi',
          'Minimalista geométrico',
          'Estilo vintage / analógico'
        ]
      },
      {
        key: 'aspecto',
        label: 'Formato',
        options: [
          '1:1 (cuadrado)',
          '16:9 (panorámico)',
          '9:16 (vertical / stories)',
          '4:3',
          '3:2',
          '3:4 (vertical)'
        ]
      }
    ],
    build: ({ idea, details, extra }: TaskBuildInput) => `Actúa como un director de arte especialista en prompts para modelos de generación de imágenes.

## Objetivo
${idea.trim()}

## Contexto
${contextBlock(details, [
    ['modelo', 'Modelo de generación'],
    ['estiloVisual', 'Estilo visual'],
    ['aspecto', 'Formato']
  ])}

## Requisitos del prompt visual
- Describe en el orden en que debe "leerse" la imagen: sujeto principal, acción, entorno, composición, iluminación, estilo y acabado
- Especifica el sujeto con detalle concreto (edad, material, postura, expresión) en lugar de adjetivos vagos
- Define la iluminación de forma explícita: fuente, dirección, intensidad y temperatura de color
- Indica la composición y el encuadre: plano, punto de vista, profundidad de campo y espacio negativo
- Detalla el estilo y el acabado: medio, textura, grano, y referencias de décadas o movimientos cuando ayude
- Los parámetros técnicos (--ar, --style, --stylize, etc.) van al final, separados del texto descriptivo

${clarifications(extra)}## Formato de salida
1. Prompt principal, en un único bloque y optimizado para el modelo elegido
2. Negative prompt (solo si el modelo lo admite)
3. Tres variaciones cambiando un único eje cada una (encuadre, iluminación o paleta)
4. Los parámetros técnicos con una breve explicación de por qué esos valores
5. Dos consejos de cómo encuadrarlo en el diseño final

## Entregable
Solo el prompt y sus variaciones, listos para pegar, sin preámbulo.`
  },

  {
    id: 'video',
    label: 'Vídeo o guion',
    icon: '🎬',
    hint: 'Guiones, shorts, UGC, tutoriales',
    exampleIdea:
      'Un vídeo corto para redes explicando en 30 segundos qué es el GDPR',
    fields: [
      {
        key: 'formatoVideo',
        label: 'Formato',
        options: [
          'Short / Reel / TikTok (vertical)',
          'Vídeo de YouTube (horizontal)',
          'Clip UGC para anuncios',
          'Podcast / entrevista',
          'Videocorporativo de empresa',
          'Tutorial en pantalla'
        ]
      },
      {
        key: 'duracion',
        label: 'Duración',
        options: [
          '15 segundos',
          '30 segundos',
          '60 segundos',
          '3-5 minutos',
          '8-12 minutos',
          'La que haga falta'
        ]
      },
      {
        key: 'tono',
        label: 'Tono',
        options: [
          'Dinámico y rápido',
          'Divertido y con humor',
          'Profesional y sereno',
          'Emocional y narrativo',
          'Informativo y técnico',
          'Conversacional, como si hablaras a una persona'
        ]
      }
    ],
    build: ({ idea, details, extra }: TaskBuildInput) => `Actúa como un guionista audiovisual y director de contenido con criterio de ritmo y atención.

## Objetivo
${idea.trim()}

## Contexto
${contextBlock(details, [
    ['formatoVideo', 'Formato'],
    ['duracion', 'Duración'],
    ['tono', 'Tono']
  ])}

## Requisitos del guion
- El primer segundo define si el espectador se queda: abre con un gancho visual o verbal
- Estructura clara: gancho, desarrollo, cierre con llamada a la acción
- Reparte el guion en planos con su duración estimada, respetando el tiempo total
- Los textos en pantalla son cortos (máximo 7 palabras) y complementan, no duplican, la locución
- Marca el ritmo y las pausas, y sugiere la música o el sonido ambiente en el momento adecuado
- El tono se mantiene constante de principio a fin; el humor, si lo hay, es del guion y no un remate forzado
- Evita frases de relleno y cualquier afirmación que no puedas sostener

${clarifications(extra)}## Formato de salida
1. Título de trabajo y un gancho alternativo
2. Guion plano: tiempo, plano, locución, texto en pantalla, sonido
3. Notas de producción: material necesario, localizaciones y B-roll
4. Tres variaciones de gancho para testear
5. Una lista de verificación de lo que hay que grabar o editar

## Entregable
El guion completo, con los tiempos sumados y sin ambigüedad sobre lo que hay que grabar.`
  },

  {
    id: 'email',
    label: 'Email o CRM',
    icon: '✉️',
    hint: 'Ventas, onboarding, reactivación',
    exampleIdea:
      'Un email para recuperar a clientes que no compran desde hace más de seis meses',
    fields: [
      {
        key: 'objetivoEmail',
        label: 'Objetivo',
        options: [
          'Vender o generar ingresos',
          'Reactivar clientes inactivos',
          'Onboarding: primer uso del producto',
          'Retener y reducir churn',
          'Anunciar una novedad',
          'Pedir una acción concreta (demo, encuesta, cita)'
        ]
      },
      {
        key: 'tono',
        label: 'Tono',
        options: [
          'Cercano y conversacional (tú)',
          'Profesional (ustedes)',
          'Urgente pero no agresivo',
          'Cálido y empático',
          'Corporativo e institucional',
          'Divertido y con personalidad'
        ]
      },
      {
        key: 'longitud',
        label: 'Longitud',
        options: [
          'Muy breve (50-80 palabras)',
          'Corto (100-150 palabras)',
          'Medio (200-300 palabras)',
          'Extenso (400+ palabras)'
        ]
      }
    ],
    build: ({ idea, details, extra }: TaskBuildInput) => `Actúa como un especialista en email marketing y copywriting, con foco en la entregabilidad y en un único objetivo por email.

## Objetivo
${idea.trim()}

## Contexto
${contextBlock(details, [
    ['objetivoEmail', 'Objetivo del email'],
    ['tono', 'Tono'],
    ['longitud', 'Longitud']
  ])}

## Requisitos del email
- Un único objetivo por email y un único CTA visible, repetido como máximo dos veces
- El asunto es específico y promete algo real; nunca usa mayúsculas excesivas ni signos de exclamación múltiples
- El preheader amplía el asunto sin repetirlo
- La primera frase del cuerpo justifica por qué ese lector recibe ese email ahora
- Un párrafo por idea, frases cortas y sin jerga corporativa
- Incluye el remitente, la información legal mínima y la forma de baja
- Evita adjuntos, links con parámetros que rompan el tracking y enlaces poco legibles en móvil

${clarifications(extra)}## Formato de salida
1. Cinco asuntos alternativos, ordenados de mejor a peor, con una nota de por qué funcionan
2. Preheader
3. El cuerpo del email, listo para pegar en el gestor de contenidos
4. CTA: texto del botón y destino
5. La versión en texto plano
6. Variante A/B del primer párrafo

## Criterio de validación
El email debe entenderse en móvil, con una sola acción clara y sin que sobre ni falte información.

## Entregable
El email completo y listo para enviar, en ambos formatos.`
  },

  {
    id: 'seo',
    label: 'SEO',
    icon: '🔍',
    hint: 'Keywords, metadatos, contenido, clusters',
    exampleIdea:
      'Estrategia de contenido para una web de software de gestión de inventario para pymes',
    fields: [
      {
        key: 'tipoSeo',
        label: 'Tipo de trabajo',
        options: [
          'Investigación de keywords',
          'Metadatos (title, description, OG)',
          'Optimización de una página existente',
          'Crear contenido SEO de fondo',
          'Arquitectura de cluster temático',
          'Datos estructurados (schema.org)'
        ]
      },
      {
        key: 'sector',
        label: 'Sector',
        options: [
          'Tecnología y software',
          'E-commerce y consumo',
          'Servicios profesionales',
          'Salud y bienestar',
          'Educación y formación',
          'Finanzas y seguros',
          'Turismo y restauración',
          'Generalista'
        ]
      },
      {
        key: 'pagina',
        label: 'Página objetivo',
        options: [
          'Página de servicio',
          'Página de producto',
          'Blog',
          'Página de precios',
          'Página corporativa',
          'Página de categoría'
        ]
      }
    ],
    build: ({ idea, details, extra }: TaskBuildInput) => `Actúa como un consultor SEO senior que se apoya en la intención de búsqueda y no en la densidad de keywords.

## Objetivo
${idea.trim()}

## Contexto
${contextBlock(details, [
    ['tipoSeo', 'Tipo de trabajo'],
    ['sector', 'Sector'],
    ['pagina', 'Página objetivo']
  ])}

## Requisitos SEO
- Detecta la intención de búsqueda real de cada término (informacional, comercial, transaccional o navegacional) antes de recomendarlo
- Prioriza por intención y oportunidad, no por volumen: distingue los términos principales de los secundarios
- Usa variantes semánticas y sinónimos naturales en lugar de repetir la keyword
- El title y la meta description deben describir la página con precisión, con longitud adecuada y sin clichés
- El contenido debe responder a las preguntas del usuario y aportar algo que la competencia no cubre
- Incluye entidades y relaciones semánticas relevantes, no solo cadenas de keywords
- No prometas posiciones ni resultados de rankings; entrega estrategia y trabajo aplicable

${clarifications(extra)}## Formato de salida
1. Keyword principal e intención de búsqueda, con el tipo de página que la satisface
2. Tabla de keywords secundarias: término, intención, volumen estimado, dificultad y prioridad
3. Title tag, meta description y etiquetas Open Graph listas para copiar
4. Estructura de encabezados H1-H3 recomendada
5. Datos estructurados schema.org propuestos, con el JSON
6. Cluster temático: pillar y páginas de apoyo
7. Lista de acciones priorizadas por impacto y esfuerzo

## Entregable
Una hoja de ruta de SEO accionable, con los textos finales incluidos.`
  },

  {
    id: 'resumen',
    label: 'Resumen o estudio',
    icon: '📄',
    hint: 'Contratos, informes, artículos, PDFs',
    exampleIdea:
      'Resumir un contrato de servicios de 12 páginas para el equipo comercial',
    fields: [
      {
        key: 'tipoMaterial',
        label: 'Tipo de material',
        options: [
          'Contrato o documento legal',
          'Informe trimestral',
          'Artículo o paper',
          'Transcripción de reunión',
          'Manual o documentación',
          'Texto genérico'
        ]
      },
      {
        key: 'longitud',
        label: 'Longitud del resumen',
        options: [
          '5 líneas (TL;DR)',
          'Un párrafo (150 palabras)',
          'Resumen ejecutivo (500 palabras)',
          'Detallado por secciones',
          'Ampliado con viñetas por secciones'
        ]
      },
      {
        key: 'enfoque',
        label: 'Enfoque',
        options: [
          'Neutral e informativo',
          'Destacando riesgos y problemas',
          'Destacando oportunidades y puntos fuertes',
          'Orientado a una decisión concreta',
          'Orientado a la toma de decisiones'
        ]
      }
    ],
    build: ({ idea, details, extra }: TaskBuildInput) => `Actúa como un analista documentalista que resume sin perder lo que importa y sin añadir nada que no esté en el texto.

## Objetivo
${idea.trim()}

## Contexto
${contextBlock(details, [
    ['tipoMaterial', 'Tipo de material'],
    ['longitud', 'Longitud del resumen'],
    ['enfoque', 'Enfoque']
  ])}

## Requisitos del resumen
- Resume el contenido real del documento; si el material no está incluido en el prompt, indícalo y pide el texto
- Conserva las cifras, fechas, nombres propios y condiciones exactas; no redondees ni parafrasees los importes
- Cita o referencia las secciones del documento cuando sea posible, para que quien lo lea pueda verificar
- Separa explícitamente los hechos del documento de tus propias inferencias
- No inventes datos que falten: señala los huecos y lo que convendría consultar
- Prioriza la información accionable por encima de los resúmenes genéricos

${clarifications(extra)}## Formato de salida
1. TL;DR de 3-5 líneas
2. Resumen principal según la longitud pedida
3. Puntos clave en viñetas, cada uno con su evidencia
4. Datos, cifras y plazos destacados
5. Conclusiones o próximos pasos
6. Aspectos no cubiertos o que necesitan verificación

## Criterio de validación
Cada afirmación del resumen debe poder rastrearse hasta un fragmento concreto del material original.

## Entregable
El resumen en Markdown, con las secciones claramente separadas.`
  },

  {
    id: 'traduccion',
    label: 'Traducción',
    icon: '🌍',
    hint: 'Fidelidad, tono, adaptación cultural',
    exampleIdea:
      'Traducir la web de una tienda de cerámica artesana al inglés para vender en el extranjero',
    fields: [
      {
        key: 'idiomaOrigen',
        label: 'Idioma de origen',
        options: [
          'Español (España)',
          'Español (Latinoamérica)',
          'Inglés',
          'Francés',
          'Alemán',
          'Portugués',
          'Italiano',
          'Otro'
        ]
      },
      {
        key: 'idiomaDestino',
        label: 'Idioma de destino',
        options: [
          'Inglés (US)',
          'Inglés (UK)',
          'Español (España)',
          'Español (Latinoamérica)',
          'Francés',
          'Alemán',
          'Portugués (BR)',
          'Italiano',
          'Otro'
        ]
      },
      {
        key: 'registro',
        label: 'Registro',
        options: [
          'Formal / corporativo',
          'Neutro y profesional',
          'Cercano y comercial',
          'Coloquial / informal',
          'Técnico y especializado',
          'Legal / técnico-jurídico'
        ]
      }
    ],
    build: ({ idea, details, extra }: TaskBuildInput) => `Actúa como un traductor profesional y localizador, con la precisión de un nativo y la disciplina de un revisor.

## Objetivo
${idea.trim()}

## Contexto
${contextBlock(details, [
    ['idiomaOrigen', 'Idioma de origen'],
    ['idiomaDestino', 'Idioma de destino'],
    ['registro', 'Registro']
  ])}

## Requisitos de traducción
- Fidelidad al sentido original: no inventes, no suavices y no exageres
- Respeeta el registro y la intención comunicativa del texto de origen
- Adapta expresiones idiomáticas y referencias culturales en lugar de traducirlas literalmente
- Mantén el formato, las marcas, los enlaces y los marcadores de posición (%s, {nombre}, etc.)
- Conserva el tono profesional del original y evita el "traducido" forzado
- Usa terminología coherente en todo el texto y respeta el glosario que se indique

${clarifications(extra)}## Formato de salida
1. La traducción final, con el formato original conservado
2. Notas de traducción para los pasajes ambiguos o con doble sentido, breves y justificadas
3. Una versión adaptada culturalmente cuando aporte una diferencia clara (por ejemplo, para marketing)
4. Sugerencias opcionales para mejorar el texto de origen

## Criterio de validación
La traducción debe sonar nativa, conservar toda la información del original y no introducir afirmaciones nuevas.

## Entregable
La traducción final lista para usar, seguida de las notas.`
  }
]

/** Tipos de tarea indexados por id, para buscar rápido. */
export const TASK_TYPES_BY_ID: Record<string, TaskType> = Object.fromEntries(
  TASK_TYPES.map((task) => [task.id, task])
)
