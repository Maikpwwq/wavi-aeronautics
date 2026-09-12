import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BlogPostPage from '../page'
import { useParams } from 'next/navigation'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => '/blog'),
  useSearchParams: vi.fn(() => new URLSearchParams())
}))

// Mock AppAppBar and AppFooter
vi.mock('@/modules/views/AppAppBar', () => ({
  default: () => <div data-testid="app-app-bar" />
}))
vi.mock('@/modules/views/AppFooter', () => ({
  default: () => <div data-testid="app-footer" />
}))

describe('BlogPostPage (/blog/[id]) Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders article header, category badge, and metadata when post exists', () => {
    useParams.mockReturnValue({ id: 'primera-vez-piloto-fpv' })

    render(<BlogPostPage />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '¿Qué debes tener en cuenta en tu primera vez como piloto FPV?'
    )
    expect(screen.getByText('Guía para principiantes')).toBeInTheDocument()
    expect(screen.getByText('Michael Arias')).toBeInTheDocument()
    expect(screen.getByText(/8 min de lectura/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Volver al Blog/i })).toBeInTheDocument()
  })

  it('renders structured sections and lead paragraph', () => {
    useParams.mockReturnValue({ id: 'primera-vez-piloto-fpv' })

    render(<BlogPostPage />)

    expect(screen.getByText(/Experimentar la sensación de volar en primera persona/i)).toBeInTheDocument()
    expect(screen.getByText('Regulación en Colombia')).toBeInTheDocument()
    expect(screen.getByText('Límites del Dominio Aéreo')).toBeInTheDocument()
    expect(screen.getByText('Controles Básicos')).toBeInTheDocument()
  })

  it('renders closing store equipment banner connecting reader to technology and WhatsApp', () => {
    useParams.mockReturnValue({ id: 'primera-vez-piloto-fpv' })

    render(<BlogPostPage />)

    expect(screen.getByText('Equípate con lo mejor para tus vuelos')).toBeInTheDocument()
    expect(screen.getByText(/No somos una academia certificadora bajo RAC 100/i)).toBeInTheDocument()

    const shopBtn = screen.getByRole('link', { name: /Explorar Drones & Repuestos en la Tienda/i })
    expect(shopBtn).toBeInTheDocument()
    expect(shopBtn).toHaveAttribute('href', '/tienda/drones-fpv-hd')

    const whatsappBtn = screen.getByRole('link', { name: /Asesoría Técnica por WhatsApp/i })
    expect(whatsappBtn).toBeInTheDocument()
    expect(whatsappBtn).toHaveAttribute('href', expect.stringContaining('wa.me/573245464166'))
  })

  it('renders next article navigation card on first post', () => {
    useParams.mockReturnValue({ id: 'primera-vez-piloto-fpv' })

    render(<BlogPostPage />)

    expect(screen.getByText(/Siguiente Artículo/i)).toBeInTheDocument()
    expect(screen.getByText('Guía de mantenimiento para tu drone FPV')).toBeInTheDocument()
  })

  it('renders 404 view when post ID does not exist', () => {
    useParams.mockReturnValue({ id: 'articulo-inexistente' })

    render(<BlogPostPage />)

    expect(screen.getByText('Artículo no encontrado')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Regresar al Blog/i })).toBeInTheDocument()
  })
})
