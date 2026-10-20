import { describe, expect, it } from 'vitest'
import {
  MAX_QUERY_LENGTH,
  buildShareUrl,
  decodeGeneratorState,
  encodeGeneratorState,
  hasGeneratorState
} from './generatorLink'

const STATE = {
  taskId: 'video',
  idea: 'Un guion para explicar el GDPR',
  details: { formato: 'Short / Reel / TikTok (vertical)', duracion: '60 segundos' },
  extra: 'Tono cercano'
}

describe('enlace del generador', () => {
  it('codifica el estado completo en el query', () => {
    const query = encodeGeneratorState(STATE)

    expect(query).toContain('t=video')
    expect(query).toContain(`i=${encodeURIComponent(STATE.idea).replace(/%20/g, '+')}`)
    expect(query).toContain('d=')
    expect(query).toContain('x=')
  })

  it('decodifica lo que ha codificado', () => {
    const decoded = decodeGeneratorState(encodeGeneratorState(STATE))

    expect(decoded.taskId).toBe('video')
    expect(decoded.idea).toBe(STATE.idea)
    expect(decoded.details).toEqual(STATE.details)
    expect(decoded.extra).toBe('Tono cercano')
  })

  it('omite lo que está vacío', () => {
    const query = encodeGeneratorState({ taskId: 'web', idea: '', details: {}, extra: '' })

    expect(query).toBe('t=web')
    expect(hasGeneratorState(decodeGeneratorState(query))).toBe(true)
  })

  it('un query vacío no aporta nada', () => {
    expect(hasGeneratorState(decodeGeneratorState(''))).toBe(false)
    expect(hasGeneratorState(decodeGeneratorState('?otro=1'))).toBe(false)
  })

  it('ignora los detalles manipulados en lugar de romperse', () => {
    const decoded = decodeGeneratorState('?t=web&d=no-es-json')
    expect(decoded.taskId).toBe('web')
    expect(decoded.details).toBeUndefined()
  })

  it('descarta los detalles que no son texto', () => {
    const decoded = decodeGeneratorState(`?d=${encodeURIComponent('{"a":"texto","b":42}')}`)
    expect(decoded.details).toEqual({ a: 'texto' })
  })

  it('el enlace apunta a la página del generador', () => {
    const url = buildShareUrl(STATE)

    expect(url).toContain('/generar-prompt/')
    expect(url).toContain('t=video')
    expect(url.startsWith('http')).toBe(true)
  })

  it('un enlace demasiado largo se recorta', () => {
    const largo = {
      taskId: 'web',
      idea: 'a'.repeat(5000),
      details: { tipo: 'x'.repeat(2000) },
      extra: 'b'.repeat(500)
    }
    const query = encodeGeneratorState(largo)

    // El query no puede crecer sin límite: algunos navegadores lo cortan.
    expect(query.length).toBeLessThanOrEqual(MAX_QUERY_LENGTH)
  })

  it('al recortar se conservan el tipo y el principio de la idea', () => {
    const query = encodeGeneratorState({
      taskId: 'web',
      idea: 'a'.repeat(5000),
      details: {},
      extra: ''
    })
    const decodificado = decodeGeneratorState(query)

    expect(decodificado.taskId).toBe('web')
    expect(decodificado.idea?.startsWith('aaa')).toBe(true)
  })
})
