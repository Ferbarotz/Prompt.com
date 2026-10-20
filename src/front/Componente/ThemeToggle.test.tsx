import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle, { THEME_STORAGE_KEY } from './ThemeToggle'

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
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
    expect(screen.getByRole('button', { name: /tema oscuro/i })).toBeInTheDocument()
  })

  it('vuelve al tema oscuro', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light')
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button', { name: /tema oscuro/i }))

    expect(document.documentElement.dataset.theme).toBeUndefined()
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })
})
