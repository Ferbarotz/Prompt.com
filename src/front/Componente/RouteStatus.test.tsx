import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouteError, RouteLoading } from './RouteStatus'

describe('estados de ruta', () => {
  it('la pantalla de carga se anuncia como estado', () => {
    render(<RouteLoading />)

    const estado = screen.getByRole('status')
    expect(estado).toHaveTextContent(/cargando/i)
  })

  it('el error de ruta explica y ofrece recargar', () => {
    render(<RouteError />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /no se ha podido cargar/i
    )
    expect(screen.getByRole('button', { name: /recargar/i })).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
