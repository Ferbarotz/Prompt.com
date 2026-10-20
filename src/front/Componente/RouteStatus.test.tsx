import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RouteError, RouteLoading } from './RouteStatus'

describe('estados de ruta', () => {
  it('la pantalla de carga se anuncia como estado', () => {
    render(<RouteLoading />)

    const estado = screen.getByRole('status')
    expect(estado).toHaveTextContent(/cargando/i)
  })

  it('el error de ruta explica y ofrece recargar', () => {
    render(
      <MemoryRouter>
        <RouteError />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /no se ha podido cargar/i
    )
    expect(screen.getByRole('button', { name: /recargar/i })).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('el error de ruta mantiene la navegación y el pie de página', () => {
    render(
      <MemoryRouter>
        <RouteError />
      </MemoryRouter>
    )

    expect(screen.getByRole('navigation', { name: /navegación principal/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /volver al inicio/i })).toHaveAttribute('href', '/')
  })
})
