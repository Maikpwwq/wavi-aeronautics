import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import BrandsMenuDialog from '@/modules/components/BrandsMenuDialog'
import { STORE_BRANDS } from '@/utilities/brandsConfig'

vi.mock('@/firebase/firebaseClient', () => ({
  firestore: {},
  auth: {},
  firebaseApp: {}
}))

vi.mock('@/services/FirebaseSearchProducts', () => ({
  fetchAllStoreProducts: vi.fn().mockResolvedValue([])
}))

describe('BrandsMenuDialog Component Tests', () => {
  it('does not render dialog content when open is false', () => {
    render(<BrandsMenuDialog open={false} onClose={vi.fn()} />)
    expect(screen.queryByText('Marcas de la Tienda')).not.toBeInTheDocument()
  })

  it('renders dialog header, title, and brand counter when open is true', async () => {
    await act(async () => {
      render(<BrandsMenuDialog open={true} onClose={vi.fn()} />)
    })

    expect(screen.getByText('Marcas de la Tienda')).toBeInTheDocument()
    expect(screen.getByText('Todas las Marcas')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Buscar marca/i)).toBeInTheDocument()
    expect(screen.getByText(`${STORE_BRANDS.length} marcas`)).toBeInTheDocument()
  })

  it('renders all 17 store brands with correct hrefs to /tienda/buscar?marca=', async () => {
    await act(async () => {
      render(<BrandsMenuDialog open={true} onClose={vi.fn()} />)
    })

    STORE_BRANDS.forEach((brand) => {
      const link = screen.getByTestId(`brand-link-${brand.slug}`)
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', `/tienda/buscar?marca=${encodeURIComponent(brand.slug)}`)
    })
  })

  it('triggers onClose when clicking the close button', async () => {
    const handleClose = vi.fn()
    await act(async () => {
      render(<BrandsMenuDialog open={true} onClose={handleClose} />)
    })

    const closeBtn = screen.getByLabelText('Cerrar menú de marcas')
    expect(closeBtn).toBeInTheDocument()
    await act(async () => {
      fireEvent.click(closeBtn)
    })

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('triggers onClose when clicking a brand card link', async () => {
    const handleClose = vi.fn()
    await act(async () => {
      render(<BrandsMenuDialog open={true} onClose={handleClose} />)
    })

    const tbsLink = screen.getByTestId('brand-link-tbs')
    await act(async () => {
      fireEvent.click(tbsLink)
    })

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('filters brands dynamically when typing in the search bar', async () => {
    await act(async () => {
      render(<BrandsMenuDialog open={true} onClose={vi.fn()} />)
    })

    const searchInput = screen.getByPlaceholderText(/Buscar marca/i)
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Beta' } })
    })

    expect(screen.getByTestId('brand-link-betafpv')).toBeInTheDocument()
    expect(screen.queryByTestId('brand-link-dji')).not.toBeInTheDocument()
    expect(screen.queryByTestId('brand-link-radiomaster')).not.toBeInTheDocument()
  })
})
