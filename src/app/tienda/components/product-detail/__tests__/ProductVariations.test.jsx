import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  ProductVariations,
  extractVariationGroups,
  detectVariationType
} from '../ProductVariations'

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

describe('detectVariationType', () => {
  it('respects explicit type property', () => {
    expect(detectVariationType({ type: 'color' })).toBe('color')
    expect(detectVariationType({ type: 'pills' })).toBe('pills')
    expect(detectVariationType({ type: 'dropdown' })).toBe('dropdown')
  })

  it('infers color type from name or colorHex in options', () => {
    expect(detectVariationType({ name: 'COLOR DEL CHASIS', options: [] })).toBe('color')
    expect(
      detectVariationType({
        name: 'ACABADO',
        options: [{ id: 'red', label: 'Rojo', colorHex: '#ef4444' }]
      })
    ).toBe('color')
  })

  it('infers dropdown type from receiver name or > 4 options', () => {
    expect(detectVariationType({ name: 'RECEPTOR', options: [] })).toBe('dropdown')
    expect(detectVariationType({ name: 'RECEIVER OPTIONS', options: [] })).toBe('dropdown')
    expect(
      detectVariationType({
        name: 'CONFIG',
        options: [
          { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }
        ]
      })
    ).toBe('dropdown')
  })

  it('infers pills type for motors, combo, battery, or short lists', () => {
    expect(detectVariationType({ name: 'MOTORES', options: [] })).toBe('pills')
    expect(detectVariationType({ name: 'COMBO BATERÍA', options: [] })).toBe('pills')
    expect(
      detectVariationType({
        name: 'TAMAÑO',
        options: [{ id: 's' }, { id: 'm' }]
      })
    ).toBe('pills')
  })
})

describe('ProductVariations Component', () => {
  const mockProduct = {
    variationGroups: [
      {
        id: 'rx',
        name: 'RECEIVER OPTIONS',
        type: 'dropdown',
        required: true,
        options: [
          { id: 'pnp', label: 'PNP', priceDelta: 0 },
          { id: 'elrs', label: 'ELRS 2.4G', priceDelta: 17 }
        ]
      },
      {
        id: 'motor',
        name: 'MOTOR',
        type: 'pills',
        required: false,
        options: [
          { id: 'geprc2207', label: 'GEPRC 2207 Motor', priceDelta: 0 },
          { id: 'tmotor', label: 'TMOTOR F60PROV Motor', priceDelta: 25 }
        ]
      },
      {
        id: 'color',
        name: 'COLOR',
        type: 'color',
        required: true,
        options: [
          { id: 'black', label: 'Negro Mate', priceDelta: 0, colorHex: '#1e1e1e' },
          { id: 'red', label: 'Rojo Carmesí', priceDelta: 5, colorHex: '#ef4444' }
        ]
      }
    ]
  }

  it('renders nothing when product has no variations', () => {
    const { container } = render(<ProductVariations product={{}} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders all variation groups with their respective specialized selectors', () => {
    render(<ProductVariations product={mockProduct} selectedVariations={{}} />)

    expect(screen.getByText('RECEIVER OPTIONS')).toBeInTheDocument()
    expect(screen.getByText('MOTOR')).toBeInTheDocument()
    expect(screen.getByText('COLOR')).toBeInTheDocument()

    // Dropdown selector present
    expect(screen.getByTestId('variation-select-rx')).toBeInTheDocument()
    expect(screen.getByText('Selecciona una opción')).toBeInTheDocument()

    // Pills selectors present
    expect(screen.getByTestId('variation-pill-geprc2207')).toBeInTheDocument()
    expect(screen.getByTestId('variation-pill-tmotor')).toBeInTheDocument()

    // Color selectors present
    expect(screen.getByTestId('variation-color-black')).toBeInTheDocument()
    expect(screen.getByTestId('variation-color-red')).toBeInTheDocument()
  })

  it('calls onVariationChange when a dropdown option is selected', () => {
    const handleChange = vi.fn()
    render(
      <ProductVariations
        product={mockProduct}
        selectedVariations={{}}
        onVariationChange={handleChange}
      />
    )

    // Open dropdown select
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
    // rx is selected, but color is still required and unselected
    expect(allRequiredSelected).toBe(false)
  })

  it('calls onVariationChange when a pill option is selected', () => {
    const handleChange = vi.fn()
    render(
      <ProductVariations
        product={mockProduct}
        selectedVariations={{ rx: 'pnp', color: 'black' }}
        onVariationChange={handleChange}
      />
    )

    const motorPill = screen.getByTestId('variation-pill-tmotor')
    fireEvent.click(motorPill)

    expect(handleChange).toHaveBeenCalled()
    const [selectedMap, selectedList, allRequiredSelected] = handleChange.mock.calls[0]
    expect(selectedMap.motor).toBe('tmotor')
    expect(allRequiredSelected).toBe(true)
  })

  it('calls onVariationChange when a color swatch option is selected', () => {
    const handleChange = vi.fn()
    render(
      <ProductVariations
        product={mockProduct}
        selectedVariations={{ rx: 'pnp' }}
        onVariationChange={handleChange}
      />
    )

    const colorSwatch = screen.getByTestId('variation-color-red')
    fireEvent.click(colorSwatch)

    expect(handleChange).toHaveBeenCalled()
    const [selectedMap, selectedList, allRequiredSelected] = handleChange.mock.calls[0]
    expect(selectedMap.color).toBe('red')
    expect(allRequiredSelected).toBe(true)
  })

  it('supports keyboard navigation on pills and color options (Enter/Space)', () => {
    const handleChange = vi.fn()
    render(
      <ProductVariations
        product={mockProduct}
        selectedVariations={{}}
        onVariationChange={handleChange}
      />
    )

    const motorPill = screen.getByTestId('variation-pill-geprc2207')
    fireEvent.keyDown(motorPill, { key: 'Enter' })
    expect(handleChange).toHaveBeenCalled()

    const colorSwatch = screen.getByTestId('variation-color-black')
    fireEvent.keyDown(colorSwatch, { key: ' ' })
    expect(handleChange).toHaveBeenCalledTimes(2)
  })

  it('shows validation warning when showValidation is true and required is unselected', () => {
    render(
      <ProductVariations
        product={mockProduct}
        selectedVariations={{}}
        showValidation={true}
      />
    )

    const warnings = screen.getAllByText('Por favor selecciona una opción')
    expect(warnings.length).toBeGreaterThanOrEqual(1)
  })

  it('displays the selected option label in group header', () => {
    render(
      <ProductVariations
        product={mockProduct}
        selectedVariations={{ color: 'red', motor: 'tmotor' }}
      />
    )

    expect(screen.getAllByText('Rojo Carmesí').length).toBe(2)
    expect(screen.getAllByText('TMOTOR F60PROV Motor').length).toBe(2)
  })
})
