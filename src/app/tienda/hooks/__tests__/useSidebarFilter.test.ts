import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSidebarFilter } from '../useSidebarFilter'
import type { ProductPriceItem } from '@/types/filter'

describe('useSidebarFilter Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const mockProducts: ProductPriceItem[] = [
    { productID: 'kit-1', precio: '$ 1.196.250', brand: 'BetaFPV' },
    { productID: 'kit-2', precio: '$ 2.057.550', brand: 'Eachine' },
    { productID: 'kit-3', precio: '$ 2.847.075', brand: 'GEPRC' },
    { productID: 'kit-4', precio: '$ 1.866.150', brand: 'Tinyhawk' },
  ]

  it('calculates zero-config absoluteMin and absoluteMax dynamically from products', () => {
    const { result } = renderHook(() =>
      useSidebarFilter({
        products: mockProducts,
      })
    )

    expect(result.current.absoluteMin).toBe(1196250)
    expect(result.current.absoluteMax).toBe(2847075)
    expect(result.current.sliderRange).toEqual([1196250, 2847075])
    expect(result.current.minInputText).toContain('1.196.250')
    expect(result.current.maxInputText).toContain('2.847.075')
  })

  it('falls back to default bounds when products list is empty', () => {
    const { result } = renderHook(() =>
      useSidebarFilter({
        products: [],
      })
    )

    expect(result.current.absoluteMin).toBe(0)
    expect(result.current.absoluteMax).toBe(5000000)
    expect(result.current.sliderRange).toEqual([0, 5000000])
  })

  it('handles identical product prices by expanding visual margin', () => {
    const identicalProducts: ProductPriceItem[] = [
      { productID: '1', precio: '$ 2.000.000' },
      { productID: '2', precio: '$ 2.000.000' },
    ]

    const { result } = renderHook(() =>
      useSidebarFilter({
        products: identicalProducts,
      })
    )

    expect(result.current.absoluteMin).toBe(Math.floor(2000000 * 0.85))
    expect(result.current.absoluteMax).toBe(Math.ceil(2000000 * 1.15))
  })

  it('updates slider range and input texts immediately upon handleSliderChange', () => {
    const onPriceChange = vi.fn()
    const { result } = renderHook(() =>
      useSidebarFilter({
        products: mockProducts,
        onPriceChange,
      })
    )

    act(() => {
      result.current.handleSliderChange([1500000, 2500000])
    })

    expect(result.current.sliderRange).toEqual([1500000, 2500000])
    expect(result.current.minInputText).toContain('1.500.000')
    expect(result.current.maxInputText).toContain('2.500.000')

    // Debounce: onPriceChange should NOT be called immediately
    expect(onPriceChange).not.toHaveBeenCalled()

    // Fast-forward 300ms
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(onPriceChange).toHaveBeenCalledTimes(1)
    expect(onPriceChange).toHaveBeenCalledWith({ min: 1500000, max: 2500000 })
  })

  it('debounces rapid slider changes and only emits the final value after 300ms', () => {
    const onPriceChange = vi.fn()
    const { result } = renderHook(() =>
      useSidebarFilter({
        products: mockProducts,
        onPriceChange,
        debounceMs: 300,
      })
    )

    // Simulate user rapidly dragging slider handle
    act(() => {
      result.current.handleSliderChange([1300000, 2800000])
    })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    act(() => {
      result.current.handleSliderChange([1400000, 2700000])
    })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    act(() => {
      result.current.handleSliderChange([1500000, 2600000])
    })

    // Still within debounce window
    expect(onPriceChange).not.toHaveBeenCalled()

    // Fast-forward remaining 300ms after last change
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(onPriceChange).toHaveBeenCalledTimes(1)
    expect(onPriceChange).toHaveBeenCalledWith({ min: 1500000, max: 2600000 })
  })

  it('enforces safety clamping on min input blur when user enters value higher than max', () => {
    const { result } = renderHook(() =>
      useSidebarFilter({
        products: mockProducts,
      })
    )

    // Current slider is [1196250, 2847075]
    // User enters 3.000.000 in min input
    act(() => {
      result.current.handleMinInputChange({
        target: { value: '3000000' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.minInputText).toBe('3000000')

    // Blur triggers clamping
    act(() => {
      result.current.handleMinInputBlur()
    })

    // Clamped to sliderRange[1] (2847075)
    expect(result.current.sliderRange[0]).toBe(2847075)
    expect(result.current.minInputText).toContain('2.847.075')
  })

  it('enforces safety clamping on max input blur when user enters value lower than min', () => {
    const { result } = renderHook(() =>
      useSidebarFilter({
        products: mockProducts,
      })
    )

    // Current slider is [1196250, 2847075]
    // User enters 500.000 in max input
    act(() => {
      result.current.handleMaxInputChange({
        target: { value: '500000' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.maxInputText).toBe('500000')

    // Blur triggers clamping
    act(() => {
      result.current.handleMaxInputBlur()
    })

    // Clamped to sliderRange[0] (1196250)
    expect(result.current.sliderRange[1]).toBe(1196250)
    expect(result.current.maxInputText).toContain('1.196.250')
  })

  it('resets price range to absolute bounds on handleResetPrice', () => {
    const onPriceChange = vi.fn()
    const { result } = renderHook(() =>
      useSidebarFilter({
        products: mockProducts,
        onPriceChange,
      })
    )

    // Alter range first
    act(() => {
      result.current.handleSliderChange([1500000, 2000000])
    })

    // Trigger reset
    act(() => {
      result.current.handleResetPrice()
    })

    expect(result.current.sliderRange).toEqual([1196250, 2847075])
    expect(result.current.minInputText).toContain('1.196.250')
    expect(result.current.maxInputText).toContain('2.847.075')
    expect(onPriceChange).toHaveBeenCalledWith({ min: 1196250, max: 2847075 })
  })
})
