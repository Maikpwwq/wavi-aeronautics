import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductVariations, extractVariationGroups } from '../ProductVariations'

describe('extractVariationGroups', () => {
  it('returns empty array when product has no variations', () => {
    expect(extractVariationGroups(null)).toEqual([])
    expect(extractVariationGroups({})).toEqual([])
  })

  it('returns variationGroups directly when present', () => {
    const product = {
      variationGroups: [
        { id: 'rx', name: 'RECEIVER OPTIONS', required: true, options: [] }
      ]
    }
    expect(extractVariationGroups(product)).toEqual(product.variationGroups)
  })

  it('normalizes legacy product.options into a single variation group', () => {
    const product = {
      options: [
        { label: 'PNP', priceModifier: 0 },
        { label: 'ELRS 2.4G', priceModifier: 17 }
      ]
    }
    const groups = extractVariationGroups(product)
    expect(groups).toHaveLength(1)
    expect(groups[0].name).toBe('RECEIVER OPTIONS')
    expect(groups[0].options).toHaveLength(2)
    expect(groups[0].options[0].label).toBe('PNP')
    expect(groups[0].options[1].priceDelta).toBe(17)
  })
})

describe('ProductVariations Component', () => {
  const mockProduct = {
    variationGroups: [
      {
        id: 'rx',
        name: 'RECEIVER OPTIONS',
        required: true,
        options: [
          { id: 'pnp', label: 'PNP', priceDelta: 0 },
          { id: 'elrs', label: 'ELRS 2.4G', priceDelta: 17 }
        ]
      },
      {
        id: 'motor',
        name: 'MOTOR',
        required: false,
        options: [
          { id: 'geprc2207', label: 'GEPRC 2207 Motor', priceDelta: 0 },
          { id: 'tmotor', label: 'TMOTOR F60PROV Motor', priceDelta: 25 }
        ]
      }
    ]
  }

  it('renders nothing when product has no variations', () => {
    const { container } = render(<ProductVariations product={{}} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders all variation groups with labels and placeholders', () => {
    render(<ProductVariations product={mockProduct} selectedVariations={{}} />)

    expect(screen.getByText('RECEIVER OPTIONS')).toBeInTheDocument()
    expect(screen.getByText('MOTOR')).toBeInTheDocument()

    // Both should display "Selecciona una opción"
    const placeholders = screen.getAllByText('Selecciona una opción')
    expect(placeholders.length).toBeGreaterThanOrEqual(2)
  })

  it('calls onVariationChange when an option is selected', () => {
    const handleChange = vi.fn()
    render(
      <ProductVariations
        product={mockProduct}
        selectedVariations={{}}
        onVariationChange={handleChange}
      />
    )

    // Open first select
    const rxSelect = screen.getByTestId('variation-select-rx')
    const button = rxSelect.querySelector('[role="combobox"]')
    fireEvent.mouseDown(button)

    // Click ELRS option
    const elrsOption = screen.getByTestId('variation-option-elrs')
    fireEvent.click(elrsOption)

    expect(handleChange).toHaveBeenCalled()
    const [selectedMap, selectedList, allRequiredSelected] = handleChange.mock.calls[0]
    expect(selectedMap).toEqual({ rx: 'elrs' })
    expect(selectedList).toHaveLength(1)
    expect(selectedList[0].optionLabel).toBe('ELRS 2.4G')
    expect(selectedList[0].priceDelta).toBe(17)
    expect(allRequiredSelected).toBe(true)
  })

  it('shows validation warning when showValidation is true and required is unselected', () => {
    render(
      <ProductVariations
        product={mockProduct}
        selectedVariations={{}}
        showValidation={true}
      />
    )

    expect(screen.getByText('Por favor selecciona una opción')).toBeInTheDocument()
  })
})
