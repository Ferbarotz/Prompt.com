import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import usePersistentState from './usePersistentState'

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

    await waitFor(() =>
      expect(window.localStorage.getItem('prompt-com:prueba')).toBe('"hola!"')
    )

    unmount()

    render(<Probe storageKey="prueba" initial="hola" />)
    expect(screen.getByTestId('value')).toHaveTextContent('hola!')
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
