/**
 * Artículos del blog.
 *
 * El blog cubre lo que no cabe en la guía: casos de uso concretos, flujos de
 * trabajo y errores reales. Cada artículo es una página con su URL, sus datos
 * estructurados (Article) y su entrada en el sitemap.
 */

/** Apartado de un artículo. */
export interface ArticleSection {
  heading: string
  paragraphs: string[]
}

/** Artículo del blog. */
export interface Article {
  /** Slug de la URL (sin `/blog/`), en minúsculas y con guiones. */
  slug: string
  /** URL interna del artículo. */
  path: string
  /** Título del artículo. */
  title: string
  /** Descripción de una frase (para buscadores y redes). */
  description: string
  /** Fecha de publicación (ISO, `YYYY-MM-DD`). */
  date: string
  /** Etiquetas del artículo. */
  tags: string[]
  /**
   * Bloques de la guía de los que habla el artículo.
   *
   * Son los slugs de `/guia/<bloque>/`: cada artículo enlaza con los bloques
   * que explica, para que la guía y el blog no sean dos silos.
   */
  blocks: string[]
  /** Minutos de lectura estimados. */
  minutes: number
  /** Apartados del artículo. */
  sections: ArticleSection[]
  /** Puntos clave (opcional). */
  takeaways?: string[]
}

/** Todos los artículos, del más reciente al más antiguo. */
export const ARTICLES: Article[] = [
  {
    slug: 'prompts-para-agentes-de-ia',
    path: '/blog/prompts-para-agentes-de-ia/',
    title: 'Prompts para agentes de IA: cómo se escriben',
    description:
      'Cómo escribir prompts para agentes de IA: qué herramienta usar, en qué orden, cómo limitar los pasos y qué formato debe devolver el agente.',
    date: '2026-09-22',
    tags: ['Agentes de IA'],
    blocks: ['rol', 'objetivo', 'datos', 'formato', 'validacion'],
    minutes: 4,
    sections: [
      {
        heading: 'Qué cambia cuando el modelo usa herramientas',
        paragraphs: [
          'Un chatbot responde a tu mensaje; un agente lee lo que pide, elige una herramienta, la ejecuta y vuelve a decidir con el resultado. Eso añade un bucle de pasos que no existe en una conversación normal, y es en ese bucle donde se cuelan los desvíos.',
          'El problema típico es que el prompt está escrito como una petición de resultado final. Pides “prepara un informe de ventas” y el modelo redacta el informe a partir de lo que inventa, sin haber consultado ninguna fuente. Con un agente, la instrucción tiene que incluir la ruta: qué datos son obligatorios, qué se hace si no existen y en qué orden.',
          'La segunda diferencia es el coste. Cada paso consume una llamada al modelo, así que un prompt que obliga a preguntar diez veces antes de responder es un prompt caro y lento. Las instrucciones que el agente puede leer de una vez (contexto, formato y límites) evitan idas y venidas.'
        ]
      },
      {
        heading: 'El prompt como contrato con las herramientas',
        paragraphs: [
          'Cada herramienta necesita tres cosas: un nombre, una descripción de lo que hace y una forma de escribir los argumentos. El prompt es el sitio donde se declara qué herramienta se usa para qué y con qué datos.',
          'Un bloque de herramientas para un agente con acceso a un CRM puede ser así:\n\n## Herramientas\n- buscar_contactos: busca en el CRM por empresa, sector o identificador, y es obligatoria antes de redactar cualquier correo.\n- obtener_facturacion: devuelve importes y fechas de un cliente, y solo se usa cuando el objetivo menciona facturación.\n- crear_borrador_email: genera el borrador en el CRM sin enviarlo.',
          'Fijar “obligatorio antes de” y “solo cuando” convierte decisiones que antes tomaba el modelo al azar en reglas explícitas. Y si hay dos herramientas que se solapan, conviene decir cuál es la predeterminada y cuál es la excepción.'
        ]
      },
      {
        heading: 'Límites de paso y criterio de parada',
        paragraphs: [
          'Un agente sin límite de pasos se queda en bucle: reintenta la misma búsqueda con variaciones de palabra, pregunta cosas que no necesita o amplía el plan sin llegar al resultado. Un límite explícito corta ese bucle.',
          'El formato es sencillo: un número máximo de intentos y una condición de salida. Por ejemplo, “máximo 5 llamadas a herramientas; si tras 2 búsquedas no hay resultados, detente y explica qué falta”. El objetivo no es que el agente complete siempre la tarea, sino que termine siempre con una respuesta: si no puede, que lo diga con datos.',
          'Añade también qué hacer ante un error de herramienta: “si una herramienta falla, reintenta una vez con argumentos más simples y, si vuelve a fallar, sigue sin ella y anota la limitación”. Sin esa instrucción, un fallo puntual se convierte en una tarea abandonada.'
        ]
      },
      {
        heading: 'Formato de salida y trazabilidad',
        paragraphs: [
          'El resultado de un agente suele ser un texto que alguien tiene que revisar y, a veces, una acción que se ha ejecutado sin supervisión. En los dos casos hace falta dejar por escrito qué se ha hecho.',
          'Un formato en dos partes funciona bien: primero el resultado y después la trazabilidad. Por ejemplo: “devuelve primero un resumen de cinco líneas; después, una tabla con las llamadas a herramientas que has hecho, con su resultado y con cualquier dato que no hayas podido obtener”.',
          'Esa segunda parte es la que evita las sorpresas. Si el agente no ha encontrado un dato, lo dirá en la tabla en lugar de rellenarlo con una suposición, y tú sabrás exactamente en qué punto se cortó el proceso.'
        ]
      },
      {
        heading: 'Probar el prompt de un agente',
        paragraphs: [
          'Probar un agente es más caro que probar un chat, porque cada ejecución puede tocar datos reales. Empieza con una prueba en un entorno de pruebas o con datos inventados, y con una única llamada a la herramienta de escritura.',
          'Guarda casos concretos: una petición normal, una petición con datos que no existen y una petición que debería rechazarse. Con esos tres casos ya se ven los desvíos más comunes.',
          'El generador de esta web monta el esqueleto del prompt con rol, objetivo, contexto, datos, restricciones, formato y validación; el analizador indica qué bloques faltan antes de gastar una prueba. Usa el generador para partir de cero y el analizador para revisar el prompt antes de cada ejecución.'
        ]
      }
    ],
    takeaways: [
      'Un prompt de agente describe un proceso (qué herramienta, en qué orden), no solo un resultado.',
      'Limita el número de pasos y define la condición de parada.',
      'Separa el resultado final de la trazabilidad de las llamadas.',
      'Prueba primero con un dato inexistente: así se ve si el agente se lo inventa.'
    ]
  },
  {
    slug: 'revisar-y-mejorar-un-prompt-que-no-funciona',
    path: '/blog/revisar-y-mejorar-un-prompt-que-no-funciona/',
    title: 'Revisar un prompt que ha dejado de funcionar',
    description:
      'Un prompt que empezó a fallar no se arregla reescribiéndolo entero. Método para localizar el bloque culpable, medirlo y corregirlo con criterio.',
    date: '2026-08-05',
    tags: ['Iteración'],
    blocks: ['objetivo', 'contexto', 'datos', 'restricciones', 'validacion'],
    minutes: 4,
    sections: [
      {
        heading: 'Por qué un prompt empieza a fallar',
        paragraphs: [
          'Un prompt funciona hasta que algo cambia: los datos de entrada, la versión del modelo, el criterio de quien lo revisa o el contexto en el que se usa. El prompt no se ha roto; el entorno ha dejado de encajar con él.',
          'La señal más clara de que toca revisarlo es una respuesta que llega medio bien. Si antes salía un informe de cinco puntos y ahora llega un texto sin apartados, el objetivo sigue ahí pero se ha diluido. Si la respuesta es más larga y más genérica, lo que falta es contexto.',
          'Conviene guardar la respuesta buena junto al prompt. Sin un ejemplo de lo que sí funcionó, cualquier corrección es una apuesta; con él, se puede comparar antes y después.'
        ]
      },
      {
        heading: 'Diagnosticar con el analizador',
        paragraphs: [
          'El analizador de esta web puntúa el prompt bloque a bloque: rol, objetivo, contexto, datos, restricciones, formato, ejemplos y validación. La puntuación indica qué falta, pero lo útil es la evidencia: el fragmento exacto con el que el analizador ha decidido si un bloque está o no.',
          'Con esa información el diagnóstico deja de ser una impresión. Si el bloque de datos aparece como no encontrado cuando en el prompt sí hay un texto pegado, el problema es de forma, no de fondo: el analizador detecta datos etiquetados, tablas o marcadores, y un párrafo suelto sin cabecera pasa desapercibido.',
          'Ojo con el falso positivo. Si un bloque se da por detectado porque una palabra suelta coincide con el patrón, la evidencia te dice cuál fue y puedes ver que ese bloque no está realmente escrito. La puntuación sube, el resultado no.'
        ]
      },
      {
        heading: 'Aislar el bloque que falla',
        paragraphs: [
          'Reparte el prompt en sus bloques y prueba cada uno por separado, empezando por los de entrada: datos, contexto y objetivo. Si el bloque de datos es ambiguo, todo lo que viene después arrastra ese error.',
          'Un método rápido es hacer la prueba inversa: deja solo el bloque sospechoso y una instrucción mínima, y mira qué devuelve. Un prompt de una línea delata los fallos enseguida; uno de ocho líneas los esconde entre el ruido.',
          'Anota en cada prueba qué has cambiado y qué ha mejorado. Un solo cambio por prueba es la regla: si cambias tres bloques a la vez y el resultado mejora, no sabes cuál de los tres era el culpable.'
        ]
      },
      {
        heading: 'Corregir sin reescribirlo todo',
        paragraphs: [
          'El arreglo suele ser local. Si el modelo se salta un requisito, ese requisito pasa de estar en un párrafo suelto a tener su propio bloque con título. Si se alarga de más, el límite va en el bloque de restricciones con un número concreto.',
          'Un bloque que funciona es este: “## Restricciones\n- Máximo 150 palabras.\n- No incluyas explicaciones del proceso.\n- Si falta un dato, escribe la palabra no disponible en lugar de estimarlo.”',
          'Añadir un ejemplo de la salida esperada suele ser el cambio con más efecto por línea escrita. Un ejemplo de dos o tres líneas enseña el formato, la longitud y el tono mejor que tres párrafos de instrucciones.'
        ]
      },
      {
        heading: 'Fijar el resultado con validación',
        paragraphs: [
          'Un prompt revisado debería incluir una comprobación que el propio modelo pueda hacer antes de entregar. Esa comprobación dice qué tiene que cumplir la respuesta y qué hacer si no lo cumple.',
          'Por ejemplo: “antes de entregar, comprueba que cada cifra aparece en los datos de entrada y que hay un apartado por cada riesgo detectado. Si alguna comprobación falla, rehaz la respuesta corrigiendo solo lo que falla”.',
          'Cierra con una prueba de regresión: vuelve a lanzar el prompt con los datos que ya usabas antes. Si la respuesta nueva es al menos tan buena como la guardada y además cumple los bloques nuevos, el cambio ha sido una mejora y no un experimento.'
        ]
      }
    ],
    takeaways: [
      'Un prompt que falla suele fallar en un bloque, no en todos.',
      'Guarda una respuesta buena como referencia antes de tocar nada.',
      'Prueba un solo cambio por iteración.',
      'Añade un criterio de validación para que el propio modelo revise su salida.'
    ]
  },
  {
    slug: 'un-mismo-prompt-con-varios-modelos',
    path: '/blog/un-mismo-prompt-con-varios-modelos/',
    title: 'Un mismo prompt para varios modelos',
    description:
      'Qué partes de un prompt funcionan igual en ChatGPT, Claude y Gemini, y qué conviene ajustar en cada uno para no perder calidad al cambiar de modelo.',
    date: '2026-06-18',
    tags: ['Comparativa'],
    blocks: ['rol', 'objetivo', 'datos', 'formato', 'ejemplos'],
    minutes: 4,
    sections: [
      {
        heading: 'Por qué el mismo prompt no rinde igual',
        paragraphs: [
          'Cada modelo tiene su propio estilo de respuesta y su propia forma de interpretar lo que se le pide. Con la misma instrucción, uno devuelve una tabla, otro devuelve cinco párrafos y un tercero añade una introducción que nadie ha pedido.',
          'La causa no suele ser la calidad del prompt, sino que la misma instrucción admite muchas formas válidas de respuesta. Cuando el formato no está fijado, cada modelo elige la que le resulta más natural.',
          'Hay una diferencia más sutil: cuánto se extiende la respuesta. Con el mismo prompt, unos modelos dan una tabla compacta y otros añaden una introducción y un resumen final, lo que en un flujo de trabajo puede duplicar el trabajo de lectura.'
        ]
      },
      {
        heading: 'El bloque común que aguanta en los tres',
        paragraphs: [
          'Hay una parte del prompt que se puede copiar tal cual a los tres modelos: rol, objetivo, datos de entrada, formato de salida y restricciones. Es la parte que define el trabajo y no depende del estilo de cada modelo.',
          'Los tres leen bien una estructura por bloques con títulos y los tres responden bien a un ejemplo de la salida esperada. Esa combinación (rol, objetivo, datos, formato, ejemplo y validación) es la base común sobre la que después se ajusta cada modelo.',
          'La ventaja de mantener esa base es práctica: solo cambias un archivo o una variable por modelo. Si el prompt depende del modelo en cada línea, los comparas mal y cada prueba cuesta el doble.'
        ]
      },
      {
        heading: 'Los ajustes que sí cambian',
        paragraphs: [
          'El primer ajuste es el formato. Cuando comparas modelos con un mismo prompt, conviene fijar la estructura dentro de la propia instrucción y no confiar en la respuesta por defecto de cada uno. Una línea como “responde solo con una tabla markdown de cuatro columnas, sin texto antes ni después” iguala el terreno.',
          'El segundo ajuste es el nivel de detalle. Si un modelo responde con dos párrafos y tú necesitas cinco puntos accionables, conviene pedirlo en el formato y no en un párrafo aparte: “cinco puntos, uno por línea, con la acción y el responsable”.',
          'El tercer ajuste es el material de entrada. Con un modelo de ventana de contexto grande compensa recortar lo irrelevante; con un modelo de ventana corta, los datos van al principio y el resto de instrucciones, al final.'
        ]
      },
      {
        heading: 'Comparar los tres con el mismo material',
        paragraphs: [
          'Para comparar, la variable tiene que ser una sola: el mismo material, la misma tarea y el mismo formato esperado. Cambia el modelo y nada más, y guarda las tres respuestas con su fecha y su nombre.',
          'El generador te da el prompt base con los bloques ya colocados; el analizador comprueba que no te falta ningún bloque antes de lanzarlo. Con el prompt listo, el trabajo consiste en enviarlo tres veces y comparar.',
          'Al comparar, fíjate en cuatro cosas: si respeta el formato, si inventa datos, cuánto texto añade de más y si cumple el criterio de validación. La respuesta más larga no es la mejor; la que cumple lo pactado es la mejor.'
        ]
      },
      {
        heading: 'Mantener un prompt que sirve para varios modelos',
        paragraphs: [
          'Un prompt que sirve para varios modelos se mantiene en un solo sitio, con los bloques comunes arriba y las variantes en un bloque final. La variante es lo único que tocas cuando cambias de modelo.',
          'Un patrón que funciona es terminar el prompt con “## Ajuste de estilo” y escribir ahí la instrucción específica de cada modelo. Así el resto del prompt no se toca y las diferencias quedan a la vista.',
          'Conviene revisar el prompt cada cierto tiempo. Los modelos cambian de versión y un prompt afinado para la anterior puede quedarse corto: vuelve a pasar el analizador y comprueba que sigue cubriendo los ocho bloques antes de darlo por bueno.'
        ]
      }
    ],
    takeaways: [
      'Rol, objetivo, datos, formato, ejemplo y validación son la base común entre modelos.',
      'Fija el formato en la instrucción: si no, cada modelo devuelve su estilo.',
      'Guarda la variante de cada modelo en un bloque final para poder compararlos.',
      'Revisa el prompt cuando cambias de versión del modelo.'
    ]
  }
]

/** Artículos indexados por su slug. */
export const ARTICLE_BY_SLUG: Record<string, Article> = Object.fromEntries(
  ARTICLES.map((article) => [article.slug, article])
)

/** Devuelve el artículo que corresponde a un slug. */
export const getArticle = (slug: string): Article | undefined => ARTICLE_BY_SLUG[slug]

/**
 * Etiqueta del blog con su versión en URL.
 */
export interface ArticleTag {
  /** Etiqueta tal y como se escribe («Agentes de IA»). */
  label: string
  /** Slug de la URL (`agentes-de-ia`). */
  slug: string
  /** Ruta de la página de la etiqueta. */
  path: string
  /** Artículos con esta etiqueta. */
  articles: Article[]
}

/** Convierte una etiqueta en el slug de su URL. */
export const tagSlug = (label: string): string =>
  label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Pone en minúscula la primera palabra de una etiqueta.
 *
 * Las siglas se quedan como están: «Agentes de IA» → «agentes de IA» (no
 * «agentes de ia»).
 */
export const lowerFirst = (label: string): string =>
  label.charAt(0).toLocaleLowerCase('es') + label.slice(1)

/** Todas las etiquetas del blog, con sus artículos. */
export const ARTICLE_TAGS: ArticleTag[] = Array.from(
  new Set(ARTICLES.flatMap((article) => article.tags))
)
  .map((label) => {
    const slug = tagSlug(label)
    return {
      label,
      slug,
      path: `/blog/etiqueta/${slug}/`,
      articles: ARTICLES.filter((article) => article.tags.includes(label))
    }
  })
  .sort((a, b) => a.label.localeCompare(b.label, 'es'))

/** Etiquetas indexadas por su slug. */
export const ARTICLE_TAG_BY_SLUG: Record<string, ArticleTag> = Object.fromEntries(
  ARTICLE_TAGS.map((tag) => [tag.slug, tag])
)

/** Devuelve la etiqueta que corresponde a un slug. */
export const getArticleTag = (slug: string): ArticleTag | undefined => ARTICLE_TAG_BY_SLUG[slug]
