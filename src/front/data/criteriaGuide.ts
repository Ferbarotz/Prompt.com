/**
 * Guía de un criterio de la rúbrica.
 *
 * Cada bloque de un buen prompt tiene su propia página: es lo que la gente
 * busca ("cómo escribir el contexto de un prompt", "qué es el formato de
 * salida en un prompt") y, además, conecta cada página con la herramienta
 * que lo mide (el analizador) y con la que lo genera.
 *
 * El contenido explica el bloque: qué hace, cómo se escribe, qué falla
 * cuando falta y qué se escribe en su lugar.
 */

/** Bloque de la rúbrica explicado en detalle. */
export interface CriterionGuide {
  /** Identificador del criterio (el mismo que en `promptLinter.ts`). */
  criterionId: string
  /** Slug de la URL. */
  slug: string
  /** Título de la página. */
  title: string
  /** Descripción para buscadores y redes. */
  description: string
  /** Entradada de la página: qué es y para qué sirve. */
  summary: string
  /** Apartados de la página. */
  sections: Array<{ heading: string; paragraphs: string[] }>
  /** Cómo se escribe el bloque, listo para copiar. */
  template: string
  /** Ejemplo corto del bloque en uso. */
  example: string
  /** Errores frecuentes al escribirlo. */
  mistakes: string[]
  /** Slugs de las páginas relacionadas. */
  related: string[]
  /**
   * Slug del artículo del blog que habla de este bloque.
   *
   * Es el enlace inverso al que hace el artículo: la guía y el blog se
   * apuntan el uno al otro en lugar de ser dos silos.
   */
  post?: string
}

export const CRITERIA_GUIDE: CriterionGuide[] = [
  {
    criterionId: 'rol',
    slug: 'rol',
    title: 'El rol: por qué decide cómo responde el modelo',
    description:
      'Cómo definir el rol o la persona del modelo en un prompt: qué hace, cuándo funciona y los errores que más se repiten.',
    summary:
      'El rol no es un adorno: es la primera instrucción que lee el modelo y la que fija el tono, el vocabulario y el nivel de detalle de todo lo que viene después. Sin rol, el modelo responde con el promedio de todo lo que ha visto; con rol, responde como alguien concreto.',
    sections: [
      {
        heading: 'Qué hace el rol',
        paragraphs: [
          'Un modelo de lenguaje no "es" nadie: estima la siguiente palabra más probable. La instrucción "actúa como un redactor publicitario" no lo convierte en redactor, pero desplaza la distribución de la respuesta hacia el estilo, los ejemplos y el vocabulario que suele ver en textos de ese tipo.',
          'El efecto real es de tres cosas: el tono (formal o cercano), la terminología (qué palabras usa) y el criterio (qué considera importante). Un "analista de marketing B2B" mira conversiones y coste por lead; un "periodista" mira contexto y consecuencias.'
        ]
      },
      {
        heading: 'Cómo se escribe un buen rol',
        paragraphs: [
          'Un rol útil tiene tres partes: la función, la experiencia y, si aplica, el sector. "Actúa como un analista de marketing B2B especializado en SaaS para pymes en España" es mejor que "actúa como un experto" porque cada palabra acota un rango de respuestas.',
          'Conviene evitar los roles imposibles: "experto mundial en todo" no aporta nada porque el modelo optimiza la respuesta genérica. Cuando el rol describe a una persona concreta con su trabajo, la respuesta suena más natural.'
        ]
      }
    ],
    template: 'Actúa como un <rol> con experiencia en <especialidad>.',
    example: 'Actúa como un analista de marketing B2B especializado en SaaS para pymes en España.',
    mistakes: [
      'Usar roles demasiado amplios ("experto en todo") que no acotan nada.',
      'Cambiar de rol a mitad del prompt sin avisar: el modelo mezcla dos registros.',
      'Pedir un rol sin después pedir formato ni restricciones: el modelo entrega un texto genérico en el registro correcto.'
    ],
    related: ['contexto', 'objetivo', 'formato'],
    post: 'un-mismo-prompt-con-varios-modelos'
  },
  {
    criterionId: 'objetivo',
    slug: 'objetivo',
    title: 'El objetivo: la instrucción que no puede faltar',
    description:
      'Cómo escribir el objetivo de un prompt con un verbo claro en imperativo, con el alcance y el formato de la respuesta.',
    summary:
      'El objetivo es la respuesta a la pregunta "¿qué tiene que hacer el modelo?". Sin él, el modelo rellena el hueco con lo más habitual, y lo más habitual suele ser un texto largo y genérico que luego hay que editar a mano.',
    sections: [
      {
        heading: 'Qué es un buen objetivo',
        paragraphs: [
          'Un objetivo útil empieza por un verbo en imperativo y termina delimitando el alcance: "resume", "genera", "clasifica", "compara". El verbo decide el tipo de trabajo (extraer, crear, ordenar) y el alcance decide cuánto se entrega.',
          'Lo que no funciona es un objetivo que solo describe el tema. "Contrato" no es un objetivo; "resume este contrato en ocho riesgos citando cláusulas" sí lo es. La diferencia es que el segundo se puede evaluar cuando llega la respuesta.'
        ]
      },
      {
        heading: 'Un objetivo, una tarea',
        paragraphs: [
          'Un prompt con dos objetivos ("analiza y luego redacta un correo") suele devolver una de las dos cosas bien y la otra de pasada. Si son dos tareas de verdad, conviene dividirlas: primero pide el análisis, luego el correo, y encadenas las respuestas.',
          'La alternativa es declarar la prioridad: "analiza el contrato y redacta el correo; si solo puedes priorizar, prioriza el análisis". Es un matiz pequeño que evita resultados a medias.'
        ]
      }
    ],
    template: '<Verbo en imperativo> <qué hay que hacer> <sobre qué>.',
    example: 'Genera 5 hipótesis de mejora ordenadas por impacto esperado.',
    mistakes: [
      'Describir el tema en lugar de pedir una acción ("información sobre el GDPR").',
      'Meter tres objetivos en el mismo prompt y esperar que los tres salgan iguales.',
      'No decir en qué formato ni con qué extensión: el modelo decide por su cuenta.'
    ],
    related: ['rol', 'formato', 'restricciones'],
    post: 'revisar-y-mejorar-un-prompt-que-no-funciona'
  },
  {
    criterionId: 'contexto',
    slug: 'contexto',
    title: 'Contexto y audiencia: la respuesta cambia',
    description:
      'Cómo declarar el contexto, la audiencia y el nivel de conocimiento en un prompt para que la respuesta no sea genérica.',
    summary:
      'El mismo objetivo escrito para dos audiencias produce dos respuestas distintas: una puede ser un correo a un cliente y la otra, un tutorial para un equipo técnico. El contexto es el bloque que le dice al modelo a quién escribe.',
    sections: [
      {
        heading: 'Qué información aporta el contexto',
        paragraphs: [
          'El contexto cubre tres cosas: la situación (en qué momento se pide), el destinatario (quién lee) y el marco (sector, tamaño, marco regulatorio, herramientas). Con eso, el modelo puede elegir ejemplos, vocabulario y nivel de tecnicidad.',
          'También sirve para acotar lo que el modelo no sabe: si escribes "para el CEO de una empresa de 20 personas, sin conocimientos técnicos", evitas una respuesta llena de jerga.'
        ]
      },
      {
        heading: 'Contexto suficiente, sin ruido',
        paragraphs: [
          'El contexto no es un volcado de toda la información que tienes: es lo que cambia la respuesta. Añadir datos que no influyen en el resultado solo hace el prompt más largo y más caro.',
          'Una prueba rápida: si al leer el bloque de contexto te imaginas mentalmente a la persona que va a leer la respuesta, está bien. Si no te imaginas a nadie, sobra.'
        ]
      }
    ],
    template:
      '- Contexto: <sector, empresa o situación>\n- Audiencia: <quién lee y con qué nivel de conocimiento>',
    example:
      'Campaña de captación Q4 para el segmento de ecommerce. Audiencia: directores de marketing de empresas de 10-50 empleados.',
    mistakes: [
      'Copiar y pegar toda la documentación disponible en el bloque de contexto.',
      'Describir la audiencia sin decir qué sabe: "para clientes" no dice nada.',
      'Faltarse el contexto en prompts que ya parecen detallados: el detalle del formato no compensa la falta de destinatario.'
    ],
    related: ['rol', 'datos', 'objetivo'],
    post: 'revisar-y-mejorar-un-prompt-que-no-funciona'
  },
  {
    criterionId: 'datos',
    slug: 'datos',
    title: 'Datos de entrada: qué darle para que no invente',
    description:
      'Cómo pasar los datos de entrada a un prompt (texto, tabla, archivo) y qué hacer para que el modelo no se los invente.',
    summary:
      'Si el modelo no tiene los datos, se los inventa: y lo hace con una confianza que engaña. Declarar los datos de entrada es lo que separa una respuesta verificable de una que parece convincente y no lo es.',
    sections: [
      {
        heading: 'Dónde poner los datos',
        paragraphs: [
          'Hay tres formas, y todas funcionan: pegarlos después de una línea separadora ("a continuación: ..."), marcarlos entre etiquetas ("<datos>...</datos>") o adjuntar el archivo si el modelo lo admite. Lo importante es que el modelo distinga claramente qué es dato y qué es instrucción.',
          'Un formato muy usado es el de las secciones con títulos: "## Datos de entrada" seguido del contenido. Con eso, el prompt queda estructurado y el modelo sabe que ese bloque no es una orden.'
        ]
      },
      {
        heading: 'El modelo rellena lo que falta',
        paragraphs: [
          'Cuando faltan datos, el modelo no suele avisar: los completa con un valor plausible. La defensa es doble: decir explícitamente qué hacer con los huecos ("si falta un dato, déjalo como [pendiente]") y añadir un criterio de validación que lo compruebe.',
          'Un prompt que dice "no inventes datos que no estén en la tabla" funciona, pero funciona mejor si además el formato de salida no deja sitio para el dato inventado.'
        ]
      }
    ],
    template: '## Datos de entrada\n<texto, tabla o archivo a trabajar>',
    example:
      '## Datos de entrada\n<KPIs de los últimos 3 meses: visitas, leads, conversión y coste por lead>',
    mistakes: [
      'Pedir un análisis sin pasar los datos y esperar cifras reales.',
      'Pegar los datos sin separarlos de las instrucciones: el modelo los lee como parte de la tarea.',
      'No decir qué hacer con lo que falta, y acabar con números inventados.'
    ],
    related: ['validacion', 'restricciones', 'formato'],
    post: 'prompts-para-agentes-de-ia'
  },
  {
    criterionId: 'restricciones',
    slug: 'restricciones',
    title: 'Restricciones: acota y quita el relleno',
    description:
      'Cómo escribir las restricciones de un prompt: límites de extensión, cosas que no incluir y tono, para que la respuesta no se desvíe.',
    summary:
      'Sin restricciones, el modelo responde con todo lo que sabe sobre el tema, que suele ser bastante más de lo que necesitas. Las restricciones son el filtro: acotan la extensión, el tono y el formato.',
    sections: [
      {
        heading: 'Restricciones que funcionan',
        paragraphs: [
          'Las más útiles son las medibles: "máximo 120 palabras", "cinco viñetas", "tres columnas", "una sola frase por idea". Cuando el límite es numérico, el modelo lo puede contar; cuando es de opinión ("no te alargues"), no.',
          'Las de alcance también funcionan: "solo usa los datos de la tabla", "no menciones precios", "no inventes cifras". Negar explícitamente es más fiable que confiar en que el modelo no se desvíe.'
        ]
      },
      {
        heading: 'Restricciones y calidad',
        paragraphs: [
          'Un prompt sin restricciones suele devolver texto de más: párrafos de contexto, resúmenes de lo anterior y conclusiones que el usuario ya conoce. Recortar es tan importante como ampliar.',
          'Conviene comprobar que las restricciones no se contradicen entre sí: "máximo 50 palabras" junto con "explica el razonamiento paso a paso" es una orden imposible, y el modelo cumple la que le parezca.'
        ]
      }
    ],
    template:
      '## Restricciones\n- Máximo <N> palabras\n- No incluyas <lo que sobra>\n- <Otras restricciones>',
    example:
      '## Restricciones\nMáximo 120 palabras en el comentario de cada hipótesis. No inventes datos que no estén en la tabla de KPIs.',
    mistakes: [
      'Escribir restricciones que el modelo no puede medir ("sé breve").',
      'Acumular restricciones sin comprobar que encajan entre sí.',
      'Olvidar la restricción más importante: la extensión.'
    ],
    related: ['formato', 'objetivo', 'datos'],
    post: 'un-mismo-prompt-con-varios-modelos'
  },
  {
    criterionId: 'formato',
    slug: 'formato',
    title: 'Formato de salida: que la respuesta sea usable',
    description:
      'Cómo especificar el formato de salida de un prompt (JSON, tabla markdown, lista numerada) para poder usar la respuesta sin retocarla.',
    summary:
      'El formato decide si la respuesta se puede usar tal cual. Un texto correcto en párrafos hay que procesarlo a mano; la misma información en una tabla markdown o en JSON se puede pegar directamente en una hoja de cálculo o en una aplicación.',
    sections: [
      {
        heading: 'Formatos que se pueden usar',
        paragraphs: [
          'Hay cuatro que cubren casi todo: JSON (para máquinas), tabla markdown (para comparar), lista numerada (para pasos o puntos) y párrafos con encabezados (para leer). La elección depende de qué se hace con la respuesta después.',
          'Un JSON debe ir con el esquema de claves, porque el modelo inventa nombres de campo si no se los das: "devuelve un JSON con las claves titulo, resumen y etiquetas".'
        ]
      },
      {
        heading: 'Detalles que importan',
        paragraphs: [
          'Conviene especificar también las unidades, el orden y el idioma: "columnas: nombre, impacto, esfuerzo; ordenadas por impacto; en español". Cada detalle ahorra una corrección manual.',
          'Y si el formato es una tabla, hay que decir si quieres las cabeceras, cuántos decimales y qué hacer con los valores nulos. Un modelo que no tiene esa información elige por su cuenta.'
        ]
      }
    ],
    template: '## Formato de salida\n<JSON | tabla markdown | lista numerada | párrafos>',
    example:
      '## Formato de salida\nTabla markdown con las columnas Hipótesis, Impacto esperado, Esfuerzo y Métrica a vigilar.',
    mistakes: [
      'Pedir "un informe" sin decir en qué formato: llega un texto en párrafos.',
      'Pedir JSON sin indicar las claves: el modelo inventa la estructura.',
      'Fijar el formato y olvidarse del idioma o las unidades.'
    ],
    related: ['objetivo', 'restricciones', 'ejemplos'],
    post: 'prompts-para-agentes-de-ia'
  },
  {
    criterionId: 'ejemplos',
    slug: 'ejemplos',
    title: 'Ejemplos: la forma barata de fijar el estilo',
    description:
      'Cómo usar ejemplos (few-shot) en un prompt para fijar el estilo y la estructura de la respuesta, y cuándo no hacen falta.',
    summary:
      'Un ejemplo enseña con la muestra, no con la explicación: si le enseñas al modelo cómo debe ser una respuesta, la copiará. Es la técnica más barata para conseguir un formato y un tono exactos.',
    sections: [
      {
        heading: 'Por qué funciona un ejemplo',
        paragraphs: [
          'El modelo predice la siguiente parte a partir de lo anterior. Un ejemplo concreto convierte una instrucción abstracta ("responde como un editor") en un patrón que el modelo puede continuar. Por eso dos o tres ejemplos suelen superar a una descripción larga.',
          'El ejemplo también fija la longitud: el modelo tiende a imitar la extensión del ejemplo, no la que le pidas por escrito.'
        ]
      },
      {
        heading: 'Cuántos ejemplos y de qué tipo',
        paragraphs: [
          'Con uno basta para fijar el formato; con dos o tres que cubran casos distintos (un caso normal y un caso límite) se fija también cómo tratar las excepciones. Más de cuatro rara vez aporta y alarga el prompt.',
          'Los ejemplos deben ser representativos: si le das un ejemplo perfecto, el modelo no sabrá qué hacer con los casos raros. Y conviene que sean cortos: un ejemplo de dos líneas enseña más que uno de veinte.'
        ]
      }
    ],
    template: '## Ejemplo\n<Un ejemplo de la salida esperada>',
    example:
      '## Ejemplo\n| Hipótesis | Impacto | Esfuerzo | Métrica |\n| --- | --- | --- | --- |\n| Landing por vertical | Alto | Bajo | Conversión |',
    mistakes: [
      'Pegar un ejemplo enorme que ocupa más que el prompt.',
      'Dar un ejemplo sin el resto de la estructura: el modelo copia solo esa parte.',
      'Usar ejemplos que contradicen las instrucciones escritas.'
    ],
    related: ['formato', 'rol', 'validacion'],
    post: 'un-mismo-prompt-con-varios-modelos'
  },
  {
    criterionId: 'validacion',
    slug: 'validacion',
    title: 'Validación: cómo saber si la respuesta sirve',
    description:
      'Cómo escribir el criterio de validación de un prompt para comprobar que la respuesta cumple, y cómo pedir la revisión antes de entregarla.',
    summary:
      'Todo prompt debería decir cómo se comprueba que su respuesta es buena. Sin ese bloque no hay forma de iterar: si el resultado no sirve, no sabes qué parte corregir.',
    sections: [
      {
        heading: 'Un criterio que se pueda comprobar',
        paragraphs: [
          'Un buen criterio de validación es verificable por una persona (o por el propio modelo): "cada cifra aparece en la tabla de KPIs", "ninguna hipótesis repite la misma palanca", "el texto no supera 120 palabras".',
          'También sirve el formato de auto-revisión: "antes de responder, comprueba que has incluido las secciones X, Y y Z; si falta alguna, añádela". Es un bucle de control simple que el modelo puede seguir sin herramientas.'
        ]
      },
      {
        heading: 'Iterar con un criterio',
        paragraphs: [
          'Con criterio de validación, la segunda vuelta es precisa: no se reescribe el prompt entero, se corrige el bloque que falla. "La hipótesis 3 no aparece en los datos, rehazla" es una corrección concreta; "mejóralo" no lo es.',
          'Es también lo que hace que el prompt sea reutilizable: otra persona puede saber si el resultado cumple sin conocer el contexto original.'
        ]
      }
    ],
    template: '## Criterio de validación\n<Cómo comprobar que la respuesta cumple>',
    example:
      '## Criterio de validación\nVerifica que cada cifra citada aparece en los datos de entrada.',
    mistakes: [
      'Escribir un criterio que no se puede comprobar ("que sea de calidad").',
      'Validar el estilo en lugar del contenido: la forma es fácil, los datos no.',
      'No usar el criterio para iterar: si el resultado falla, el prompt debería cambiar.'
    ],
    related: ['datos', 'ejemplos', 'restricciones'],
    post: 'revisar-y-mejorar-un-prompt-que-no-funciona'
  }
]
