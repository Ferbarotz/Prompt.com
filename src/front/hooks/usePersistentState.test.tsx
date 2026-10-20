import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import usePersistentState, { clearPersistedState } from './usePersistentState'

/** Componente de prueba: expone el valor y un botón para cambiarlo. */
const Probe = ({ storageKey, initial }: { storageKey: string; initial: string }) => {
  const [value, setValue] = usePersistentState<string>(storageKey, initial)
  return (
    <>
      <span data-testid="value">{value}</span>
      <button type="button" onClick={() => setValue((previous) => `${previous}!`)}>
        añadir
      </button>
    </>
  )
}

describe('usePersistentState', () => {
  it('guarda el valor y lo recupera al montar de nuevo', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<Probe storageKey="prueba" initial="hola" />)

    await user.click(screen.getByRole('button', { name: 'añadir' }))
    expect(screen.getByTestId('value')).toHaveTextContent('hola!')

    await waitFor(() => {
      const guardado = window.localStorage.getItem('prompt-com:prueba')
      expect(guardado).toContain('hola!')
      // Se guarda con su fecha, para que pueda caducar.
      expect(JSON.parse(guardado ?? '{}')).toMatchObject({ v: 1, value: 'hola!' })
    })

    unmount()

    render(<Probe storageKey="prueba" initial="hola" />)
    expect(screen.getByTestId('value')).toHaveTextContent('hola!')
  })

  it('lo guardado caduca a los 30 días', () => {
    const hace = 31 * 24 * 60 * 60 * 1000
    window.localStorage.setItem(
      'prompt-com:viejo',
      JSON.stringify({ v: 1, savedAt: Date.now() - hace, value: 'viejo' })
    )

    render(<Probe storageKey="viejo" initial="nuevo" />)

    expect(screen.getByTestId('value')).toHaveTextContent('nuevo')
  })

  it('borra todo lo guardado por la aplicación', async () => {
    const user = userEvent.setup()
    render(<Probe storageKey="borrar" initial="hola" />)
    await user.click(screen.getByRole('button', { name: 'añadir' }))
    await waitFor(() =>
      expect(window.localStorage.getItem('prompt-com:borrar')).toContain('hola!')
    )

    // Otra clave que no es de la aplicación no se toca.
    window.localStorage.setItem('otra-cosa', '1')

    expect(clearPersistedState()).toBe(true)
    expect(window.localStorage.getItem('prompt-com:borrar')).toBeNull()
    expect(window.localStorage.getItem('otra-cosa')).toBe('1')
  })

  it('acepta un valor inicial calculado', () => {
    const inicial = vi.fn(() => 'calculado')
    render(<Probe storageKey="otro" initial={inicial() as unknown as string} />)
    expect(screen.getByTestId('value')).toHaveTextContent('calculado')
  })

  it('si lo guardado está corrupto, usa el valor inicial', () => {
    window.localStorage.setItem('prompt-com:roto', '{no es json')
    render(<Probe storageKey="roto" initial="por defecto" />)
    expect(screen.getByTestId('value')).toHaveTextContent('por defecto')
  })

  it('si el almacenamiento falla, la web sigue funcionando', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('almacenamiento bloqueado')
    })

    expect(() => render(<Probe storageKey="bloqueado" initial="hola" />)).not.toThrow()
    expect(screen.getByTestId('value')).toHaveTextContent('hola')

    getItem.mockRestore()
  })
})
