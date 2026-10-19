import { describe, expect, it } from 'vitest'
import { TASK_TYPES, TASK_TYPES_BY_ID, type TaskBuildInput, type TaskType } from './taskTypes'

const buildWith = (
  task: TaskType,
  { idea = 'Una idea', details = {}, extra = '' }: Partial<TaskBuildInput> = {}
) => task.build({ idea, details, extra })

describe('catálogo de tipos de tarea', () => {
  it('expone al menos 10 tipos con identificador único', () => {
    expect(TASK_TYPES.length).toBeGreaterThanOrEqual(10)
    const ids = TASK_TYPES.map((task) => task.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('cada tipo tiene los campos obligatorios', () => {
    for (const task of TASK_TYPES) {
      expect(task.id).toMatch(/^[a-z]+$/)
      expect(task.label.length).toBeGreaterThanOrEqual(3)
      expect(task.hint.length).toBeGreaterThan(3)
      expect(task.exampleIdea.length).toBeGreaterThan(10)
      expect(task.fields.length).toBeGreaterThanOrEqual(2)
      expect(typeof task.build).toBe('function')
    }
  })

  it('las claves de campo son únicas dentro de cada tipo', () => {
    for (const task of TASK_TYPES) {
      const keys = task.fields.map((field) => field.key)
      expect(new Set(keys).size).toBe(keys.length)
    }
  })

  it('el índice por id cubre todos los tipos', () => {
    for (const task of TASK_TYPES) {
      expect(TASK_TYPES_BY_ID[task.id]).toBe(task)
    }
  })
})

describe('construcción del prompt', () => {
  it.each(TASK_TYPES)('el tipo "$id" genera un prompt completo', (task: TaskType) => {
    const prompt = buildWith(task)

    expect(prompt).toContain('Una idea')
    expect(prompt.length).toBeGreaterThan(500)
    // Estructura mínima: rol, objetivo, contexto y entrega.
    expect(prompt).toMatch(/^Actúa como/i)
    expect(prompt).toContain('## Objetivo')
    expect(prompt).toContain('## Contexto')
    expect(prompt).toContain('## Entregable')
  })

  it.each(TASK_TYPES)('el tipo "$id" no deja valores sin resolver', (task: TaskType) => {
    const details = Object.fromEntries(task.fields.map((field) => [field.key, field.options[0]]))
    const prompt = buildWith(task, { details, extra: 'Una aclaración' })

    expect(prompt).not.toMatch(/undefined/)
    expect(prompt).not.toMatch(/\[object Object\]/)
    expect(prompt).not.toMatch(/NaN/)
    expect(prompt).toContain('Una aclaración')
  })

  it('omite los campos que el usuario no ha rellenado', () => {
    const prompt = buildWith(TASK_TYPES_BY_ID.seo, { details: { sector: 'Tecnología y software' } })

    expect(prompt).toContain('- Sector: Tecnología y software')
    expect(prompt).not.toContain('- Página objetivo:')
  })

  it('avisa cuando no hay contexto y pide declarar los supuestos', () => {
    const prompt = buildWith(TASK_TYPES_BY_ID.web, { details: {} })

    expect(prompt).toContain('Contexto no especificado')
    expect(prompt).toContain('supuestos')
  })

  it('los tipos distintos producen prompts distintos', () => {
    const web = buildWith(TASK_TYPES_BY_ID.web)
    const video = buildWith(TASK_TYPES_BY_ID.video)

    expect(web).not.toBe(video)
    // El bug original: una plantilla web para una tarea de vídeo.
    expect(video).not.toContain('Header/Navbar')
    expect(video).toContain('guionista')
  })

  it('el tipo web conserva la estructura de la web', () => {
    const prompt = buildWith(TASK_TYPES_BY_ID.web)

    expect(prompt).toContain('Header con navegación clara')
    expect(prompt).toContain('Footer')
    expect(prompt).toContain('Responsive')
  })

  it('recorta la idea y las aclaraciones', () => {
    const prompt = buildWith(TASK_TYPES_BY_ID.codigo, { idea: ' idea con espacios  ', extra: '  extra  ' })

    expect(prompt).toContain('\nidea con espacios\n')
    expect(prompt).toContain('extra')
    expect(prompt).not.toContain('  extra  ')
  })
})
