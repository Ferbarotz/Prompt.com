/**
 * Analizador de prompts.
 *
 * Evalúa un prompt contra la misma rúbrica que usa la guía de la web
 * (rol + objetivo + contexto + datos + restricciones + formato + ejemplo +
 * criterio de validación) y devuelve una puntuación, el desglose por criterio
 * y una lista de problemas.
 *
 * Todo es local: no hay peticiones ni almacenamiento. El texto del usuario
 * nunca sale del navegador.
 */

/** Gravedad de una observación sobre el prompt. */
export type IssueLevel = 'info' | 'warn' | 'error'

/** Criterio de la rúbrica con su metadatos de evaluación. */
export interface LinterCriterion {
  id: string
  label: string
  weight: number
  hint: string
  blockTitle: string
  template: string
  patterns: RegExp[]
}

/** Fragmento del prompt que ha activado un criterio. */
export interface CriterionEvidence {
  /** Texto exacto que coincidió. */
  text: string
  /** El mismo texto con su contexto inmediato. */
  context: string
}

/** Resultado de evaluar un criterio concreto. */
export interface CriterionAnalysis extends LinterCriterion {
  found: boolean
  evidence: CriterionEvidence | null
}

/** Observación sobre el prompt analizado. */
export interface PromptIssue {
  level: IssueLevel
  text: string
}

/** Análisis completo de un prompt. */
export interface PromptAnalysis {
  /** Puntuación de 0 a 100. */
  score: number
  /** Etiqueta cualitativa: Excelente, Bueno, Mejorable o Débil. */
  level: string
  /** Color de la etiqueta, en hexadecimal. */
  color: string
  criteria: CriterionAnalysis[]
  foundCount: number
  totalCriteria: number
  structure: {
    /** Número de títulos o bloques detectados. */
    headings: number
    /** Si el prompt está dividido en bloques. */
    structured: boolean
    /** Si la longitud está en el rango recomendado. */
    lengthOk: boolean
  }
  issues: PromptIssue[]
  /** Longitud del prompt en caracteres. */
  length: number
}

/** Criterios de la rúbrica, con su peso en la puntuación final. */
export const CRITERIA: LinterCriterion[] = [
  {
    id: 'rol',
    label: 'Rol o persona',
    weight: 10,
    hint: 'Define quién es la IA. Sin rol, el modelo elige el tono y el nivel de detalle.',
    blockTitle: 'Rol',
    template: 'Actúa como un <rol> con experiencia en <especialidad>.',
    patterns: [
      /\bact[uú]a como\b/i,
      /\bact[uú]a como si\b/i,
      /\b(asume|adopta) el rol de\b/i,
      /\beres un[ao]?\b/i,
      /\btu rol es\b/i,
      /\bimagina que eres\b/i,
      /\bcomo (?:un |una )?(?:experto|especialista|profesional|redactor|analista|ingeniero|consultor|asistente)\b/i
    ]
  },
  {
    id: 'objetivo',
    label: 'Objetivo claro',
    weight: 10,
    hint: 'Qué tiene que hacer, con un verbo concreto. "Resume el contrato" es un objetivo; "Contrato" no.',
    blockTitle: 'Objetivo',
    template: '<Verbo en imperativo> <qué hay que hacer> <sobre qué>.',
    patterns: [
      /(?<!no )\b(genera|generar|crea|crear|resumen|resume|redacta|redactar|analiza|analizar|clasifica|clasificar|traduce|traducir|optimiza|optimizar|extrae|extraer|compara|comparar|ordena|ordenar|produce|producir|reescribe|reescribir|convierte|convertir|evalua|evaluar|selecciona|seleccionar)\b/i,
      /\b-tu objetivo es\b/i,
      /\bqueremos que\b/i,
      /\bnecesito que\b/i
    ]
  },
  {
    id: 'contexto',
    label: 'Contexto y audiencia',
    weight: 10,
    hint: 'Para quién es y en qué situación. Sin contexto, la respuesta será genérica.',
    blockTitle: 'Contexto',
    template: '- Contexto: <sector, empresa o situación>\n- Audiencia: <quién lee y con qué nivel de conocimiento>',
    patterns: [
      /\baudiencia\b/i,
      /\bp[uú]blico\b/i,
      /\bdestinatari/i,
      /\bcontexto\b/i,
      /\bsector\b/i,
      /\bempresa\b/i,
      /\bequipo\b/i,
      /\bcliente/i,
      /\bsegmento\b/i,
      /\bnicho\b/i,
      /\bpara (?:un|una) (?:equipo|startup|negocio|tienda|empresa|cliente|blog)\b/i,
      /\bpara (?:que|puedan|puedas|se)\b/i
    ]
  },
  {
    id: 'datos',
    label: 'Datos de entrada',
    weight: 10,
    hint: 'Sobre qué material trabaja. Si el modelo no tiene datos, tendrá que inventarlos.',
    blockTitle: 'Datos de entrada',
    template: '## Datos de entrada\n<texto, tabla o archivo a trabajar>',
    patterns: [
      /\b(entrada|entradas|datos de entrada)\b/i,
      /\bdatos\b/i,
      /\b(archivo|documento|texto|art[ií]culo|contrato|informe|ticket|transcripci[oó]n)\b/i,
      /\bcon el siguiente\b/i,
      /\bpega\b/i,
      /\badjunt[oa]\b/i,
      /\ba continuaci[oó]n\b/i,
      /<[^<>\n]{3,}>/,
      /\{\{[^}\n]+\}\}/,
      /\[[^\]\n]{3,}\]/
    ]
  },
  {
    id: 'restricciones',
    label: 'Restricciones y límites',
    weight: 10,
    hint: 'Lo que el modelo NO debe hacer. Acota la respuesta y evita el relleno.',
    blockTitle: 'Restricciones',
    template: '## Restricciones\n- Máximo <N> palabras\n- No incluyas <lo que sobra>\n- <Otras restricciones>',
    patterns: [
      /\bm[aá]xim[oa]\b/i,
      /\bm[ií]nim[oa]\b/i,
      /\bno (?:debes|puedas|puede|incluyas|uses|añadas|añade|generes|must|se\s)\b/i,
      /\bevita\b/i,
      /\bsin (?:que|mayor|exceso|sensaci[oó]n)\b/i,
      /\blimita\b/i,
      /\brestringe\b/i,
      /\b(solo|únicamente|exclusivamente)\b/i,
      /\bno inventes?\b/i,
      /\b\d+\s*(palabras|caracteres|l[ií]neas|oraciones|apartados|elementos|puntos)\b/i,
      /\bno m[aá]s de\b/i
    ]
  },
  {
    id: 'formato',
    label: 'Formato de salida',
    weight: 10,
    hint: 'Cómo debe entregarse la respuesta. Sin formato, cada respuesta viene de una manera.',
    blockTitle: 'Formato de salida',
    template: '## Formato de salida\n<JSON | tabla markdown | lista numerada | párrafos>',
    patterns: [
      /\bjson\b/i,
      /\btabla\b/i,
      /\blista\b/i,
      /\bmarkdown\b/i,
      /\bcsv\b/i,
      /\byaml\b/i,
      /\bhtml\b/i,
      /\bformato de (salida|entrada|respuesta)\b/i,
      /\b(responde|devuelve|devu[ée]lvelo|salida) (con|en|como)\b/i,
      /\ben (?:columnas|filas|secciones|puntos|vinetas|bloques)\b/i,
      /\b(paso a paso|pasos numerados|en pasos)\b/i,
      /\bp[aá]rrafos?\b/i,
      /\bc[aá]psulas?\b/i,
      /\bformato\b/i
    ]
  },
  {
    id: 'ejemplos',
    label: 'Ejemplos o referencias',
    weight: 10,
    hint: 'Una muestra del resultado esperado. Es lo que más controla el estilo y la estructura.',
    blockTitle: 'Ejemplo',
    template: '## Ejemplo\n<Un ejemplo de la salida esperada>',
    patterns: [
      /\bejemplos?\b/i,
      /\bpor ejemplo\b/i,
      /\bmuestra\b/i,
      /\bdemuestra\b/i,
      /\breferencia/i,
      /\bas[ií] (?:este|esta|el siguiente)\b/i,
      /\bfew-?shot\b/i,
      /\bformato de ejemplo\b/i
    ]
  },
  {
    id: 'validacion',
    label: 'Criterio de validación',
    weight: 10,
    hint: 'Cómo se comprueba que la respuesta es buena. Sin esto, no hay forma de iterar.',
    blockTitle: 'Criterio de validación',
    template: '## Criterio de validación\n<Cómo comprobar que la respuesta cumple>',
    patterns: [
      /\bvalida(?:r|ción|cion)?\b/i,
      /\bverifica(?:r|ción|cion)?\b/i,
      /\bcomprueba(?:r)?\b/i,
      /\bcriterio/i,
      /\bcalidad\b/i,
      /\bno inventes?\b/i,
      /\bfidelidad\b/i,
      /\brevis(?:a|ar|ar[eó]n|ión)\b/i,
      /\bchecks?\b/i,
      /\bse (?:asegura|debe asegurar|garantiza)\b/i,
      /\bantes de (?:entregar|responder|devolver)\b/i,
      /\btest(?:ea|ear|earse)\b/i
    ]
  }
]

/** Encuentra la primera coincidencia y devuelve el fragmento como evidencia. */
const findEvidence = (text: string, patterns: RegExp[]): CriterionEvidence | null => {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (!match) continue
    const index = match.index ?? 0
    const start = Math.max(0, index - 24)
    const end = Math.min(text.length, index + match[0].length + 24)
    return {
      text: match[0],
      context: `${start > 0 ? '…' : ''}${text.slice(start, end).replace(/\s+/g, ' ').trim()}${
        end < text.length ? '…' : ''
      }`
    }
  }
  return null
}

/** Detecta si el prompt usa bloques separados por títulos o etiquetas. */
const detectStructure = (text: string) => {
  const headings = text.match(/^\s*(#{1,4}\s+.+|\*\*[^*]+\*\*\s*$|---+\s*$)/gm) ?? []
  // Bloques con etiqueta al principio de línea: "Contexto: …", "Datos: …".
  const labeled = text.match(/^\s*[A-ZÁÉÍÓÚÑ][\w\sáéíóúñ]{2,30}:\s*\S/gm) ?? []
  return { headings: headings.length, structured: headings.length + labeled.length >= 2 }
}

const LEVELS: Array<{ min: number; label: string; color: string }> = [
  { min: 80, label: 'Excelente', color: '#10b981' },
  { min: 60, label: 'Bueno', color: '#06b6d4' },
  { min: 40, label: 'Mejorable', color: '#f59e0b' },
  { min: 0, label: 'Débil', color: '#f87171' }
]

/**
 * Analiza un prompt y devuelve la puntuación y el desglose.
 * @param {string} text Texto del prompt a analizar.
 */
export const analyzePrompt = (text: string): PromptAnalysis => {
  const clean = (text ?? '').trim()

  const criteria: CriterionAnalysis[] = CRITERIA.map((criterion) => {
    const evidence = clean ? findEvidence(clean, criterion.patterns) : null
    return {
      ...criterion,
      found: Boolean(evidence),
      evidence
    }
  })

  const found = criteria.filter((criterion) => criterion.found)
  const structure = detectStructure(clean)
  const lengthOk = clean.length >= 150 && clean.length <= 2000

  const score = Math.min(
    100,
    found.length * 10 + (structure.structured ? 10 : 0) + (lengthOk ? 10 : 0)
  )

  const issues: PromptIssue[] = []
  if (!clean) {
    issues.push({
      level: 'info',
      text: 'Pega un prompt para analizarlo.'
    })
  } else {
    if (clean.length < 80) {
      issues.push({
        level: 'warn',
        text: 'El prompt es muy corto. Unas pocas líneas no suelen bastar para fijar el resultado que buscas.'
      })
    }
    if (clean.length > 3000) {
      issues.push({
        level: 'warn',
        text: 'El prompt es muy largo. Los modelos se distraen con exceso de instrucciones: divide la tarea en pasos encadenados.'
      })
    }
    if (found.length === 0) {
      issues.push({
        level: 'error',
        text: 'No se detecta ninguna instrucción reconocible. Empieza por un verbo claro: "Resume…", "Genera…", "Analiza…".'
      })
    }
    if (!structure.structured && clean.length > 400) {
      issues.push({
        level: 'warn',
        text: 'El prompt es largo pero no está estructurado. Sepáralo con títulos (## Objetivo, ## Contexto, ## Formato) para que cada bloque se lea por separado.'
      })
    }
    if (/\[(?:por completar|todo|tbd|pendiente)[^\]]*\]|\bTODO\b|\bFIXME\b/i.test(clean)) {
      issues.push({
        level: 'warn',
        text: 'Quedan marcadores sin completar (TODO o similar). Rellénalos antes de usar el prompt.'
      })
    }
    if (found.length >= 6 && clean.length > 1200) {
      issues.push({
        level: 'info',
        text: 'Cumple casi todos los criterios. Revisa si todos los bloques siguen siendo necesarios: la concisión también mejora el resultado.'
      })
    }
  }

  const level = LEVELS.find((item) => score >= item.min) ?? LEVELS[LEVELS.length - 1]

  return {
    score,
    level: level.label,
    color: level.color,
    criteria,
    foundCount: found.length,
    totalCriteria: criteria.length,
    structure: { ...structure, lengthOk },
    issues,
    length: clean.length
  }
}

/**
 * Devuelve una versión mejorada del prompt, añadiendo los bloques que faltan.
 * Los huecos se dejan marcados con `<...>` para que el usuario los rellene.
 * @param {string} text Prompt original.
 * @param {object} analysis Resultado de `analyzePrompt`.
 */
export const improvePrompt = (text: string, analysis: PromptAnalysis): string => {
  const base = (text ?? '').trim()
  const missing = analysis.criteria.filter((criterion) => !criterion.found)

  if (!missing.length) {
    return base
  }

  const blocks = missing.map((criterion) => `## ${criterion.blockTitle}\n${criterion.template}`)

  return [base, ...blocks].join('\n\n')
}

/** Prompt de ejemplo para probar el analizador sin escribir nada. */
export const EXAMPLE_PROMPT = `Actúa como un analista de marketing B2B especializado en SaaS para pymes en España.

## Contexto
Campaña de captación Q4 para el segmento de ecommerce. Audiencia: directores de marketing de empresas de 10-50 empleados.

## Datos de entrada
<KPIs de los últimos 3 meses: visitas, leads, conversión y coste por lead>

## Objetivo
Genera 5 hipótesis de mejora ordenadas por impacto esperado.

## Formato de salida
Tabla markdown con las columnas Hipótesis, Impacto esperado, Esfuerzo y Métrica a vigilar.

## Ejemplo
| Hipótesis | Impacto | Esfuerzo | Métrica |
| --- | --- | --- | --- |
| Landing por vertical | Alto | Bajo | Conversión |

## Restricciones
Máximo 120 palabras en el comentario de cada hipótesis. No inventes datos que no estén en la tabla de KPIs.

## Criterio de validación
Verifica que cada cifra citada aparece en los datos de entrada.`
