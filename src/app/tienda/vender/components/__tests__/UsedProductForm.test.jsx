import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import UsedProductForm from '@/app/tienda/vender/components/UsedProductForm'
import { USED_DRAFT_STORAGE_KEY } from '@/utilities/usedProductsConfig'
import * as usedProductsService from '@/services/usedProductsService'

// Mock next/navigation
const mockPush = vi.fn()
const mockBack = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack
  })
}))

// Mock usedProductsService
vi.mock('@/services/usedProductsService', () => ({
  createUsedListing: vi.fn()
}))

// Helper to render component with Redux Provider
const renderWithRedux = (ui, { initialState } = {}) => {
  const store = configureStore({
    reducer: {
      user: (state = initialState?.user || null) => state
    }
  })
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('UsedProductForm Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('renders form heading and inputs correctly', () => {
    renderWithRedux(<UsedProductForm />, { initialState: { user: { uid: 'u123' } } })
    expect(screen.getByText('Vender mi equipo usado')).toBeInTheDocument()
    expect(screen.getByLabelText(/Título del producto/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Precio en COP/i)).toBeInTheDocument()
  })

  it('shows error if non-logged in user submits the form', async () => {
    const { container } = renderWithRedux(<UsedProductForm />, { initialState: { user: null } })

    const form = container.querySelector('form')
    fireEvent.submit(form)

    expect(await screen.findByText('Debes iniciar sesión para publicar un equipo.')).toBeInTheDocument()
  })

  it('shows validation error when title is empty', async () => {
    const { container } = renderWithRedux(<UsedProductForm />, { initialState: { user: { uid: 'u123' } } })

    const form = container.querySelector('form')
    fireEvent.submit(form)

    expect(await screen.findByText('El título de la publicación es obligatorio.')).toBeInTheDocument()
  })

  it('shows validation error when photo count is less than minimum required (2 photos)', async () => {
    const draftData = {
      title: 'RadioMaster TX16S',
      category: 'radioControl',
      brand: 'RadioMaster',
      condition: 'like_new',
      description: 'Radio control en perfecto estado',
      priceCop: '950000',
      contactPhone: '3001234567'
    }
    sessionStorage.setItem(USED_DRAFT_STORAGE_KEY, JSON.stringify(draftData))

    const { container } = renderWithRedux(<UsedProductForm />, { initialState: { user: { uid: 'u123' } } })

    const form = container.querySelector('form')
    fireEvent.submit(form)

    expect(await screen.findByText(/Por favor adjunta al menos 2 fotos/i)).toBeInTheDocument()
  })

  it('restores draft from sessionStorage when available', async () => {
    const draftData = {
      title: 'Borrador Guardado Drone',
      category: 'dronesHD',
      brand: 'BetaFPV',
      condition: 'good',
      description: 'Descripción borrador',
      priceCop: '450000',
      contactPhone: '3109876543'
    }
    sessionStorage.setItem(USED_DRAFT_STORAGE_KEY, JSON.stringify(draftData))

    renderWithRedux(<UsedProductForm />, { initialState: { user: { uid: 'u123' } } })

    await waitFor(() => {
      expect(screen.getByDisplayValue('Borrador Guardado Drone')).toBeInTheDocument()
      expect(screen.getByDisplayValue('450000')).toBeInTheDocument()
      expect(screen.getByText('Limpiar Borrador')).toBeInTheDocument()
    })
  })
})
