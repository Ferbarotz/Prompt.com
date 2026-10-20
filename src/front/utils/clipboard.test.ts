import { describe, expect, it, vi, afterEach } from 'vitest'
import { copyToClipboard } from './clipboard'

/** Simula un navegador sin API del portapapeles (o sin contexto seguro). */
const sinClipboardApi = () => {
  Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })
}

/** Simula el método de reserva (`document.execCommand`). */
const conExecCommand = (resultado: boolean) => {
  const execCommand = vi.fn().mockReturnValue(resultado)
  Object.defineProperty(document, 'execCommand', { value: execCommand, configurable: true })
  return execCommand
}

describe('portapapeles', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('copia con la API del portapapeles cuando está disponible', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })

    expect(await copyToClipboard('hola')).toBe('ok')
    expect(writeText).toHaveBeenCalledWith('hola')
  })

  it('usa el método de reserva cuando no hay API del portapapeles', async () => {
    sinClipboardApi()
    const execCommand = conExecCommand(true)

    expect(await copyToClipboard('hola')).toBe('ok')
    expect(execCommand).toHaveBeenCalledWith('copy')
  })

  it('usa el método de reserva cuando la API falla (http, permisos)', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('no permitido'))
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const execCommand = conExecCommand(true)

    expect(await copyToClipboard('hola')).toBe('ok')
    expect(writeText).toHaveBeenCalled()
    expect(execCommand).toHaveBeenCalledWith('copy')
  })

  it('avisa cuando no se ha podido copiar', async () => {
    sinClipboardApi()
    conExecCommand(false)

    expect(await copyToClipboard('hola')).toBe('failed')
  })

  it('no hace nada con un texto vacío', async () => {
    const writeText = vi.fn()
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })

    expect(await copyToClipboard('')).toBe('failed')
    expect(writeText).not.toHaveBeenCalled()
  })
})
