import { describe, expect, it } from 'vitest'
import { AI_TOOLS_BY_TASK, getAiTools } from './aiTools'
import { TASK_TYPES } from './taskTypes'

describe('aiTools', () => {
  it('cubre todos los tipos de tarea del generador', () => {
    for (const task of TASK_TYPES) {
      expect(AI_TOOLS_BY_TASK[task.id]).toBeDefined()
    }
  })

  it('la primera herramienta de cada lista es la recomendada', () => {
    for (const suggestion of Object.values(AI_TOOLS_BY_TASK)) {
      expect(suggestion.tools.length).toBeGreaterThan(0)
      expect(suggestion.tools[0].recommended).toBe(true)
      expect(suggestion.tools.filter((tool) => tool.recommended)).toHaveLength(1)
    }
  })

  it('todas las herramientas tienen enlace https, nombre y nota', () => {
    for (const suggestion of Object.values(AI_TOOLS_BY_TASK)) {
      for (const tool of suggestion.tools) {
        expect(tool.name.length).toBeGreaterThan(0)
        expect(tool.note.length).toBeGreaterThan(0)
        expect(tool.url).toMatch(/^https:\/\//)
      }
    }
  })

  it('no repite la misma herramienta dentro de una lista', () => {
    for (const suggestion of Object.values(AI_TOOLS_BY_TASK)) {
      const names = suggestion.tools.map((tool) => tool.name)
      expect(new Set(names).size).toBe(names.length)
    }
  })

  it('cae en una lista generalista para un tipo desconocido', () => {
    const suggestion = getAiTools('tipo-inexistente')
    expect(suggestion.tools.length).toBeGreaterThan(0)
    expect(suggestion.tools[0].name).toBe('ChatGPT')
  })

  it('devuelve la lista específica del tipo de tarea', () => {
    expect(getAiTools('video').tools[0].name).toBe('ChatGPT')
    expect(getAiTools('imagen').tools[0].name).toBe('Midjourney')
  })
})
