import { describe, expect, it } from 'vitest'
import {
  CRITERIA,
  CRITERIA_POINTS,
  EXAMPLE_PROMPT,
  LENGTH_POINTS,
  STRUCTURE_POINTS,
  analyzePrompt,
  improvePrompt
} from './promptLinter'
import type { PromptAnalysis } from './promptLinter'

const idsOf = (analysis: PromptAnalysis) =>
  analysis.criteria.filter((c) => c.found).map((c) => c.id)

describe('analyzePrompt', () => {
  it('devuelve la puntuación dentro de rango', () => {
    const analysis = analyzePrompt(EXAMPLE_PROMPT)

    expect(analysis.score).toBeGreaterThanOrEqual(0)
    expect(analysis.score).toBeLessThanOrEqual(100)
  })

  it('un prompt vacío no puntúa', () => {
    const analysis = analyzePrompt('')

    expect(analysis.score).toBe(0)
    expect(analysis.foundCount).toBe(0)
    expect(analysis.issues[0].level).toBe('info')
  })

  it('detecta los ocho criterios en el prompt de ejemplo', () => {
    const analysis = analyzePrompt(EXAMPLE_PROMPT)

    expect(idsOf(analysis).sort()).toEqual(
      ['contexto', 'datos', 'ejemplos', 'formato', 'objetivo', 'restricciones', 'rol', 'validacion'].sort()
    )
    expect(analysis.score).toBe(100)
  })

  it('detecta el rol', () => {
    expect(idsOf(analyzePrompt('Actúa como un abogado mercantilista.'))).toContain('rol')
  })

  it('detecta el objetivo por el verbo en imperativo', () => {
    expect(idsOf(analyzePrompt('Resume este contrato en cinco puntos.'))).toContain('objetivo')
  })

  it('detecta el contexto por la audiencia', () => {
    expect(idsOf(analyzePrompt('Escribe para una audiencia de seniority.'))).toContain('contexto')
  })

  it('detecta los datos de entrada', () => {
    expect(idsOf(analyzePrompt('Analiza el siguiente archivo: <contenido>'))).toContain('datos')
  })

  it('detecta las restricciones', () => {
    expect(idsOf(analyzePrompt('Máximo 100 palabras, no incluyas conclusiones.'))).toContain(
      'restricciones'
    )
  })

  it('detecta el formato de salida', () => {
    expect(idsOf(analyzePrompt('Devuelve el resultado en formato JSON.'))).toContain('formato')
  })

  it('detecta los ejemplos', () => {
    expect(idsOf(analyzePrompt('Por ejemplo: "Buenos días, le informamos…"'))).toContain('ejemplos')
  })

  it('detecta el criterio de validación', () => {
    expect(idsOf(analyzePrompt('Verifica que cada cifra aparece en la tabla.'))).toContain(
      'validacion'
    )
  })

  it('un prompt mínimo no detecta ningún criterio', () => {
    const analysis = analyzePrompt('Hola')

    expect(analysis.foundCount).toBe(0)
    expect(analysis.issues.some((issue) => issue.level === 'error')).toBe(true)
  })

  it('penaliza los prompts demasiado cortos', () => {
    const analysis = analyzePrompt('Resume esto')

    expect(analysis.issues.some((issue) => issue.text.includes('muy corto'))).toBe(true)
  })

  it('penaliza los prompts demasiado largos', () => {
    const analysis = analyzePrompt('x'.repeat(3200))

    expect(analysis.issues.some((issue) => issue.text.includes('muy largo'))).toBe(true)
  })

  it('avisa de los marcadores sin completar', () => {
    const analysis = analyzePrompt('Genera un informe TODO con los datos de entrada.')

    expect(analysis.issues.some((issue) => issue.text.includes('marcadores'))).toBe(true)
  })

  it('recompensa la estructura con títulos', () => {
    const conTitulos = analyzePrompt(
      '## Objetivo\nGenera un informe.\n\n## Contexto\nPara un equipo de ventas.'
    )
    const sinTitulos = analyzePrompt(
      'Genera un informe para un equipo de ventas con los datos del trimestre.'
    )

    expect(conTitulos.structure.structured).toBe(true)
    expect(sinTitulos.structure.structured).toBe(false)
    expect(conTitulos.score).toBeGreaterThan(sinTitulos.score)
  })

  it('incluye la evidencia encontrada en cada criterio', () => {
    const analysis = analyzePrompt('Actúa como un redactor publicitario.')
    const rol = analysis.criteria.find((criterion) => criterion.id === 'rol')
    expect(rol).toBeDefined()
    expect(rol?.evidence).not.toBeNull()

    expect(rol?.found).toBe(true)
    expect(rol?.evidence?.text).toMatch(/Actúa como/i)
    expect(rol?.evidence?.context).toContain('redactor')
  })

  it('el nivel acompaña a la puntuación', () => {
    expect(analyzePrompt(EXAMPLE_PROMPT).level).toBe('Excelente')
    expect(analyzePrompt('Hola').level).toBe('Débil')
  })

  it('todos los criterios tienen peso y metadatos', () => {
    for (const criterion of CRITERIA) {
      expect(criterion.weight).toBeGreaterThan(0)
      expect(criterion.hint.length).toBeGreaterThan(20)
      expect(criterion.template.length).toBeGreaterThan(10)
      expect(criterion.patterns.length).toBeGreaterThan(0)
    }
  })

  it('los pesos de los criterios completan los 80 puntos de la rúbrica', () => {
    expect(CRITERIA_POINTS).toBe(80)
    expect(CRITERIA_POINTS + STRUCTURE_POINTS + LENGTH_POINTS).toBe(100)
  })

  it('un prompt con los criterios importantes puntúa más', () => {
    // Mismo número de criterios, pero el objetivo pesa más que el rol.
    const conObjetivo = analyzePrompt('Genera un informe de ventas con los datos del trimestre.')
    const conRol = analyzePrompt('Actúa como un redactaor: escribe un informe con los datos.')

    expect(conObjetivo.score).toBeGreaterThan(conRol.score)
  })
})

describe('improvePrompt', () => {
  it('añade los bloques que faltan', () => {
    const original = 'Genera un informe de ventas.'
    const analysis = analyzePrompt(original)
    const improved = improvePrompt(original, analysis)

    expect(improved).toContain(original)
    for (const criterion of analysis.criteria.filter((c) => !c.found)) {
      expect(improved).toContain(`## ${criterion.blockTitle}`)
    }
  })

  it('no toca un prompt que ya cumple todos los criterios', () => {
    const improved = improvePrompt(EXAMPLE_PROMPT, analyzePrompt(EXAMPLE_PROMPT))

    expect(improved).toBe(EXAMPLE_PROMPT)
  })

  it('el prompt mejorado puntúa más que el original', () => {
    const original = 'Resume el contrato.'
    const improved = improvePrompt(original, analyzePrompt(original))

    expect(analyzePrompt(improved).score).toBeGreaterThan(analyzePrompt(original).score)
  })
})
