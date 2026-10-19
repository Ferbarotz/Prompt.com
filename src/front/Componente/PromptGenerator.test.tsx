import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { UserEvent } from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import PromptGenerator from './PromptGenerator'

// El generador incluye enlaces internos (`<Link>`), que necesitan un router.
const renderGenerator = () =>
  render(
    <MemoryRouter>
      <PromptGenerator />
    </MemoryRouter>
  )

const getRadios = () => screen.getAllByRole('radio')

const selectTask = async (user: UserEvent, name: string) => {
  const radio = getRadios().find(
    (element) => (element as HTMLInputElement).value === name
  )
  if (!radio) throw new Error(`No se encontró el tipo de tarea "${name}"`)
  await user.click(radio)
  return radio
}

const goToStep2 = async (user: UserEvent) => {
  await user.click(screen.getByRole('button', { name: 'Siguiente' }))
}

const goToStep3 = async (user: UserEvent) => {
  await user.click(screen.getByRole('button', { name: 'Siguiente' }))
}

describe('PromptGenerator', () => {
  it('muestra el selector con todos los tipos de tarea', () => {
    renderGenerator()

    expect(getRadios()).toHaveLength(10)
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('el paso 1 no deja avanzar sin una idea', async () => {
    const user = userEvent.setup()
    renderGenerator()

    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled()

    await user.type(screen.getByLabelText(/describe tu idea/i), 'Una tienda online')
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeEnabled()
  })

  it('el botón de ejemplo rellena la idea con el ejemplo del tipo elegido', async () => {
    const user = userEvent.setup()
    renderGenerator()

    await selectTask(user, 'video')
    await user.click(screen.getByRole('button', { name: 'Usar un ejemplo' }))

    expect(screen.getByLabelText(/describe tu idea/i)).toHaveValue(
      'Un vídeo corto para redes explicando en 30 segundos qué es el GDPR'
    )
  })

  it('el paso 2 muestra los campos del tipo seleccionado', async () => {
    const user = userEvent.setup()
    renderGenerator()

    await selectTask(user, 'video')
    await user.type(screen.getByLabelText(/describe tu idea/i), 'Un guion')
    await goToStep2(user)

    expect(screen.getByLabelText(/formato/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/duración/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/stack tecnológico/i)).not.toBeInTheDocument()
  })

  it('cambiar de tipo reinicia los detalles del anterior', async () => {
    const user = userEvent.setup()
    renderGenerator()

    await selectTask(user, 'video')
    await user.type(screen.getByLabelText(/describe tu idea/i), 'Un guion')
    await goToStep2(user)
    await user.selectOptions(screen.getByLabelText(/formato/i), 'Short / Reel / TikTok (vertical)')
    await goToStep3(user)

    expect(screen.getByText(/tu prompt profesional · vídeo o guion/i)).toBeInTheDocument()

    // Volver al paso 1, cambiar de tipo y volver al paso 2.
    await user.click(screen.getByRole('button', { name: 'Anterior' }))
    await user.click(screen.getByRole('button', { name: 'Anterior' }))
    await selectTask(user, 'web')
    await goToStep2(user)

    expect(screen.getByLabelText(/tipo de proyecto/i)).toHaveValue('')
    expect(screen.queryByLabelText(/duración/i)).not.toBeInTheDocument()
  })

  it('genera el prompt del tipo elegido, no una plantilla genérica', async () => {
    const user = userEvent.setup()
    renderGenerator()

    await selectTask(user, 'video')
    await user.type(screen.getByLabelText(/describe tu idea/i), 'Un tutorial de energía solar')
    await goToStep2(user)
    await goToStep3(user)

    const prompt = screen.getByText(/guionista audiovisual/i).closest('pre')
    expect(prompt).toHaveTextContent('Un tutorial de energía solar')
    expect(prompt).not.toHaveTextContent('Header/Navbar')
  })

  it('incluye en el prompt los detalles seleccionados', async () => {
    const user = userEvent.setup()
    renderGenerator()

    await selectTask(user, 'seo')
    await user.type(screen.getByLabelText(/describe tu idea/i), 'Estrategia de contenido')
    await goToStep2(user)
    await user.selectOptions(screen.getByLabelText(/sector/i), 'Tecnología y software')
    await goToStep3(user)

    expect(
      screen.getByText(/tu prompt profesional · seo/i).closest('div')?.parentElement
    ).toHaveTextContent('Tecnología y software')
  })

  it('copia el prompt al portapapeles y lo confirma', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })

    renderGenerator()
    await user.type(screen.getByLabelText(/describe tu idea/i), 'Una idea')
    await goToStep2(user)
    await goToStep3(user)

    await user.click(screen.getByRole('button', { name: /copiar prompt/i }))

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1))
    expect(writeText.mock.calls[0][0]).toContain('Una idea')
    expect(await screen.findByRole('button', { name: /copiado/i })).toBeInTheDocument()
  })

  it('anuncia los cambios de paso en una única región live', async () => {
    const user = userEvent.setup()
    renderGenerator()

    const liveRegions = document.querySelectorAll('[aria-live]')
    expect(liveRegions).toHaveLength(1)
    expect(liveRegions[0]).toHaveAttribute('role', 'status')

    await user.type(screen.getByLabelText(/describe tu idea/i), 'Una idea')
    await goToStep2(user)

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Paso 2 de 3: Detalles')
    )
  })

  it('el prompt no es una región live (evita leérselo entero)', async () => {
    const user = userEvent.setup()
    renderGenerator()

    await user.type(screen.getByLabelText(/describe tu idea/i), 'Una idea')
    await goToStep2(user)
    await goToStep3(user)

    const pre = document.querySelector('pre')
    expect(pre).not.toHaveAttribute('aria-live')
  })

  it('"Empezar de nuevo" limpia el formulario', async () => {
    const user = userEvent.setup()
    renderGenerator()

    await user.type(screen.getByLabelText(/describe tu idea/i), 'Una idea')
    await goToStep2(user)
    await goToStep3(user)
    await user.click(screen.getByRole('button', { name: /empezar de nuevo/i }))

    expect(screen.getByLabelText(/describe tu idea/i)).toHaveValue('')
    expect(getRadios()[0]).toBeChecked()
  })

  it('todos los controles tienen etiqueta accesible', () => {
    renderGenerator()

    const group = screen.getByRole('group')
    expect(within(group).getAllByRole('radio')).toHaveLength(10)
    for (const radio of getRadios()) {
      expect(radio).toHaveAccessibleName()
    }
  })
})
