import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PromptAnatomy from './PromptAnatomy'

describe('PromptAnatomy', () => {
  it('lista los ocho bloques con el peso de cada uno', () => {
    render(
      <MemoryRouter>
        <PromptAnatomy current="rol" />
      </MemoryRouter>
    )

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(8)
    expect(screen.getByText('Rol o persona')).toBeInTheDocument()
    expect(screen.getByText('Criterio de validación')).toBeInTheDocument()
  })

  it('resalta el bloque de la página', () => {
    render(
      <MemoryRouter>
        <PromptAnatomy current="formato" />
      </MemoryRouter>
    )

    expect(screen.getByText(/estás aquí/i)).toBeInTheDocument()
  })
})
