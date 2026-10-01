'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { parseCopCurrency, calculateCopPrice, formatCurrency } from '@/utilities/priceUtils'
import type { ProductPriceItem, PriceRangeState } from '@/types/filter'

interface UseSidebarFilterOptions {
  products?: ProductPriceItem[]
  debounceMs?: number
  onPriceChange?: (range: PriceRangeState) => void
  setMinPrice?: (val: number | string) => void
  setMaxPrice?: (val: number | string) => void
  initialMin?: number | string
  initialMax?: number | string
}

export function useSidebarFilter({
  products = [],
  debounceMs = 300,
  onPriceChange,
  setMinPrice,
  setMaxPrice,
  initialMin,
  initialMax
}: UseSidebarFilterOptions) {
  // ── 1. DYNAMIC ZERO-CONFIG CALCULATION OF ABSOLUTE BOUNDS ───────────────────
  const { absoluteMin, absoluteMax } = useMemo(() => {
    if (!products || products.length === 0) {
      const parsedInitMin = initialMin ? parseCopCurrency(initialMin) : 0
      const parsedInitMax = initialMax ? parseCopCurrency(initialMax) : 5000000
      return {
        absoluteMin: parsedInitMin || 0,
        absoluteMax: parsedInitMax > parsedInitMin ? parsedInitMax : 5000000
      }
    }

    const prices = products
      .map((p) => {
        // If product has formatted 'precio' in COP ("$ 1.196.250" or number)
        if (typeof p.precio === 'string') return parseCopCurrency(p.precio)
        if (typeof p.precio === 'number') return p.precio
        // If product has numeric 'price' in USD, convert dynamically to COP
        if (typeof p.price === 'number') {
          const copStr = calculateCopPrice(p.price)
          return parseCopCurrency(copStr)
        }
        if (typeof p.price === 'string') {
          return parseCopCurrency(p.price)
        }
        return 0
      })
      .filter((price) => price > 0)

    if (prices.length === 0) {
      return { absoluteMin: 0, absoluteMax: 5000000 }
    }

    const min = Math.min(...prices)
    const max = Math.max(...prices)

    // If all products in the category have the exact same price, create a ±15% visual margin
    return {
      absoluteMin: min === max ? Math.max(0, Math.floor(min * 0.85)) : min,
      absoluteMax: min === max ? Math.ceil(max * 1.15) : max
    }
  }, [products, initialMin, initialMax])

  // ── 2. REACTIVE LOCAL STATE FOR SLIDER & INPUTS ────────────────────────────
  const [sliderRange, setSliderRange] = useState<[number, number]>([
    absoluteMin,
    absoluteMax
  ])
  const [minInputText, setMinInputText] = useState<string>(formatCurrency(absoluteMin))
  const [maxInputText, setMaxInputText] = useState<string>(formatCurrency(absoluteMax))

  // Synchronize when absolute bounds change (Zero-Config adaptation upon category switch)
  useEffect(() => {
    setSliderRange([absoluteMin, absoluteMax])
    setMinInputText(formatCurrency(absoluteMin))
    setMaxInputText(formatCurrency(absoluteMax))
  }, [absoluteMin, absoluteMax])

  // ── 3. DEBOUNCE PIPELINE (300ms) TO ISOLATE RENDER THREAD ─────────────────
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  const emitDebouncedChange = useCallback(
    (newRange: [number, number]) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        if (onPriceChange) {
          onPriceChange({ min: newRange[0], max: newRange[1] })
        }
        if (setMinPrice) {
          setMinPrice(newRange[0])
        }
        if (setMaxPrice) {
          setMaxPrice(newRange[1])
        }
      }, debounceMs)
    },
    [onPriceChange, setMinPrice, setMaxPrice, debounceMs]
  )

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    emitDebouncedChange(sliderRange)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [sliderRange, emitDebouncedChange])

  // ── 4. BIDIRECTIONAL BINDING: SLIDER CONTROLS ─────────────────────────────
  const handleSliderChange = (newValues: [number, number]) => {
    const clampedMin = Math.max(absoluteMin, Math.min(newValues[0], newValues[1]))
    const clampedMax = Math.min(absoluteMax, Math.max(newValues[0], newValues[1]))

    setSliderRange([clampedMin, clampedMax])
    setMinInputText(formatCurrency(clampedMin))
    setMaxInputText(formatCurrency(clampedMax))
  }

  // ── 5. BIDIRECTIONAL BINDING: INPUT FIELD CONTROLS ────────────────────────
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinInputText(e.target.value)
  }

  const handleMinInputBlur = () => {
    const numeric = parseCopCurrency(minInputText)
    // Safety Clamping: cannot exceed current sliderMax or be below absoluteMin
    const validMin = Math.max(absoluteMin, Math.min(numeric, sliderRange[1]))
    setSliderRange([validMin, sliderRange[1]])
    setMinInputText(formatCurrency(validMin))
  }

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxInputText(e.target.value)
  }

  const handleMaxInputBlur = () => {
    const numeric = parseCopCurrency(maxInputText)
    // Safety Clamping: cannot be below current sliderMin or exceed absoluteMax
    const validMax = Math.min(absoluteMax, Math.max(numeric, sliderRange[0]))
    setSliderRange([sliderRange[0], validMax])
    setMaxInputText(formatCurrency(validMax))
  }

  const handleResetPrice = () => {
    setSliderRange([absoluteMin, absoluteMax])
    setMinInputText(formatCurrency(absoluteMin))
    setMaxInputText(formatCurrency(absoluteMax))
    if (onPriceChange) {
      onPriceChange({ min: absoluteMin, max: absoluteMax })
    }
    if (setMinPrice) setMinPrice('')
    if (setMaxPrice) setMaxPrice('')
  }

  return {
    absoluteMin,
    absoluteMax,
    sliderRange,
    minInputText,
    maxInputText,
    handleSliderChange,
    handleMinInputChange,
    handleMinInputBlur,
    handleMaxInputChange,
    handleMaxInputBlur,
    handleResetPrice
  }
}
