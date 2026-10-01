import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBannerCycle } from '../useBannerCycle'

describe('useBannerCycle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('initializes with default zero indices and not transitioning', () => {
    const { result } = renderHook(() =>
      useBannerCycle({
        totalCategories: 3,
        productsPerCategory: [3, 2, 4],
      })
    )

    expect(result.current.categoryIndex).toBe(0)
    expect(result.current.imageIndex).toBe(0)
    expect(result.current.isCategoryTransitioning).toBe(false)
    expect(result.current.isImageTransitioning).toBe(false)
  })

  it('rotates category after majorInterval', () => {
    const { result } = renderHook(() =>
      useBannerCycle({
        totalCategories: 3,
        productsPerCategory: [1, 1, 1],
        majorInterval: 4000,
      })
    )

    // Advance 4000ms to trigger category transition
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(result.current.isCategoryTransitioning).toBe(true)

    // Advance transition duration (300ms)
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current.categoryIndex).toBe(1)
    expect(result.current.isCategoryTransitioning).toBe(false)
  })

  it('rotates images dynamically within the major cycle window', () => {
    // 4 products in category 0 -> dynamicMinor = 4000 / 4 = 1000ms
    const { result } = renderHook(() =>
      useBannerCycle({
        totalCategories: 2,
        productsPerCategory: [4, 2],
        majorInterval: 4000,
      })
    )

    // Advance 1000ms for first image tick
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.isImageTransitioning).toBe(true)

    // Advance image transition duration (250ms)
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current.imageIndex).toBe(1)
    expect(result.current.isImageTransitioning).toBe(false)

    // Next tick
    act(() => {
      vi.advanceTimersByTime(1000)
      vi.advanceTimersByTime(250)
    })
    expect(result.current.imageIndex).toBe(2)
  })

  it('does not rotate images when category has only 1 product', () => {
    const { result } = renderHook(() =>
      useBannerCycle({
        totalCategories: 2,
        productsPerCategory: [1, 3],
        majorInterval: 4000,
      })
    )

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current.imageIndex).toBe(0)
    expect(result.current.isImageTransitioning).toBe(false)
  })

  it('freezes timers when paused is true', () => {
    const { result } = renderHook(() =>
      useBannerCycle({
        totalCategories: 3,
        productsPerCategory: [4, 4, 4],
        majorInterval: 4000,
        paused: true,
      })
    )

    act(() => {
      vi.advanceTimersByTime(10000)
    })
    expect(result.current.categoryIndex).toBe(0)
    expect(result.current.imageIndex).toBe(0)
  })

  it('allows manual category navigation via goToCategory', () => {
    const { result } = renderHook(() =>
      useBannerCycle({
        totalCategories: 5,
        productsPerCategory: [3, 3, 3, 3, 3],
        majorInterval: 4000,
      })
    )

    act(() => {
      result.current.goToCategory(3)
    })
    expect(result.current.isCategoryTransitioning).toBe(true)

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current.categoryIndex).toBe(3)
    expect(result.current.imageIndex).toBe(0)
    expect(result.current.isCategoryTransitioning).toBe(false)
  })

  it('cleans up timers upon unmount', () => {
    const { unmount } = renderHook(() =>
      useBannerCycle({
        totalCategories: 3,
        productsPerCategory: [3, 3, 3],
        majorInterval: 4000,
      })
    )

    unmount()
    // Should not throw any errors when timers advance after unmount
    act(() => {
      vi.advanceTimersByTime(10000)
    })
  })
})
