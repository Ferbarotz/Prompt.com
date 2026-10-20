import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LinterPage from './LinterPage'

const renderPage = () =>
  render(
    <MemoryRouter>
      <LinterPage />
    </MemoryRouter>
  )

describe('LinterPage', () => {
  it('pide un prompt antes de mostrar resultados', () => {
    renderPage()

    expect(screen.getByLabelText(/pega aquí el prompt/i)).toBeInTheDocument()
    expect(screen.queryByText(/\/100/)).not.toBeInTheDocument()
  })

  it('analiza el prompt al escribirlo', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText(/pega aquí el prompt/i), 'Actúa como un abogado.')

    expect(await screen.findByText(/\/100/)).toBeInTheDocument()
    // Aparece en el desglose de criterios y en la rúbrica de abajo.
    expect(screen.getAllByText(/rol o persona/i).length).toBeGreaterThan(0)
  })

  it('el ejemplo puntúa como excelente', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: /probar con un ejemplo/i }))

    expect(await screen.findByText(/excelente/i)).toBeInTheDocument()
  })

  it('el prompt analizado se conserva al recargar', async () => {
    const user = userEvent.setup()
    const { unmount } = renderPage()

    await user.type(screen.getByLabelText(/pega aquí el prompt/i), 'Actúa como un abogado.')

    await waitFor(() =>
      expect(window.localStorage.getItem('prompt-com:linter')).toContain('Actúa como un abogado')
    )

    unmount()
    renderPage()

    expect(screen.getByLabelText(/pega aquí el prompt/i)).toHaveValue('Actúa como un abogado.')
  })

  it('propone una versión mejorada con los bloques que faltan', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText(/pega aquí el prompt/i), 'Resume el contrato.')
    await user.click(screen.getByRole('button', { name: /probar con un ejemplo/i }))
    await user.clear(screen.getByLabelText(/pega aquí el prompt/i))
    await user.type(screen.getByLabelText(/pega aquí el prompt/i), 'Resume el contrato.')

    expect(await screen.findByText(/versión mejorada/i)).toBeInTheDocument()
    expect(screen.getByText(/se han añadido los bloques que faltan/i)).toBeInTheDocument()
  })

  it('"Usar esta versión" sustituye el texto del campo', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText(/pega aquí el prompt/i), 'Resume el contrato.')
    await user.click(await screen.findByRole('button', { name: /usar esta versión/i }))

    const field = screen.getByLabelText(/pega aquí el prompt/i) as HTMLTextAreaElement
    await waitFor(() => expect(field.value).toContain('## Contexto'))
  })

  it('copia la versión mejorada al portapapeles', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })

    renderPage()
    await user.type(screen.getByLabelText(/pega aquí el prompt/i), 'Resume el contrato.')
    await user.click(await screen.findByRole('button', { name: /^copiar$/i }))

    await waitFor(() => expect(writeText).toHaveBeenCalled())
    expect(writeText.mock.calls[0][0]).toContain('## Contexto')
  })

  it('explica la rúbrica con los ocho criterios', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: /los 8 criterios/i })).toBeInTheDocument()
    for (const label of [
      'Rol o persona',
      'Objetivo claro',
      'Contexto y audiencia',
      'Datos de entrada',
      'Restricciones y límites',
      'Formato de salida',
      'Ejemplos o referencias',
      'Criterio de validación'
    ]) {
      expect(screen.getAllByText(new RegExp(label, 'i')).length).toBeGreaterThan(0)
    }
  })
})
