import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle, { THEME_STORAGE_KEY } from './ThemeToggle'

/** El tema se guarda con su fecha, como el resto de lo que guarda la web. */
const savedTheme = () => {
  const raw = window.localStorage.getItem(THEME_STORAGE_KEY)
  return raw ? (JSON.parse(raw) as { v: number; savedAt: number; value: string }).value : null
}

describe('ThemeToggle', () => {
  it('empieza en el tema oscuro, que es el de la marca', () => {
    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: /tema claro/i })).toBeInTheDocument()
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })

  it('al pulsarlo cambia al tema claro y lo guarda', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button', { name: /tema claro/i }))

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(savedTheme()).toBe('light')
    expect(screen.getByRole('button', { name: /tema oscuro/i })).toBeInTheDocument()
  })

  it('vuelve al tema oscuro', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({ v: 1, savedAt: Date.now(), value: 'light' })
    )
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button', { name: /tema oscuro/i }))

    expect(document.documentElement.dataset.theme).toBeUndefined()
    expect(savedTheme()).toBe('dark')
  })

  it('el tema guardado caduca a los 30 días, como el resto de los datos', () => {
    const hace = 31 * 24 * 60 * 60 * 1000
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({ v: 1, savedAt: Date.now() - hace, value: 'light' })
    )

    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: /tema claro/i })).toBeInTheDocument()
    expect(document.documentElement.dataset.theme).toBeUndefined()
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()
  })

  it('si el visitante borra los datos guardados, el tema vuelve al oscuro', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button', { name: /tema claro/i }))
    expect(document.documentElement.dataset.theme).toBe('light')

    const { clearPersistedState } = await import('../hooks/usePersistentState')
    clearPersistedState()

    await waitFor(() => expect(document.documentElement.dataset.theme).toBeUndefined())
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()
  })
})
