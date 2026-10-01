/**
 * Battery Cells (Voltage) Configuration & Matching Utility
 * @module utilities/batteryConfig
 */

export const BATTERY_CELL_OPTIONS = [
  { id: '1S', label: '1S', cellCount: 1, voltagePattern: /(?:3\.[78]|3\.85)\s*v/i },
  { id: '2S', label: '2S', cellCount: 2, voltagePattern: /(?:7\.[46])\s*v/i },
  { id: '3S', label: '3S', cellCount: 3, voltagePattern: /(?:11\.[14])\s*v/i },
  { id: '4S', label: '4S', cellCount: 4, voltagePattern: /(?:14\.8|15\.2)\s*v/i },
  { id: '5S', label: '5S', cellCount: 5, voltagePattern: /(?:18\.5|19\.0)\s*v/i },
  { id: '6S', label: '6S', cellCount: 6, voltagePattern: /(?:22\.2|22\.8)\s*v/i },
  { id: '12S', label: '12S', cellCount: 12, voltagePattern: /(?:44\.4|45\.6)\s*v/i }
] as const

export type BatteryCellId = typeof BATTERY_CELL_OPTIONS[number]['id']

/**
 * Normalizes text for matching by removing accents/diacritics and converting to lowercase.
 */
function normalizeText(text: unknown): string {
  if (!text || typeof text !== 'string') return ''
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

/**
 * Checks whether a given product matches a specific battery cell count (e.g. '1S', '4S', '6S').
 */
export function matchesBatteryCell(product: Record<string, any>, cellId: string): boolean {
  if (!product || !cellId) return false

  const normalizedCellId = cellId.toUpperCase().trim()
  const cellOption = BATTERY_CELL_OPTIONS.find((opt) => opt.id === normalizedCellId)
  if (!cellOption) return false

  // 1. Direct field match if explicitly provided on product model
  const directCell = product.cells ?? product.celdas ?? product.batteryCells ?? product.cellCount
  if (directCell !== undefined && directCell !== null) {
    if (typeof directCell === 'number' && directCell === cellOption.cellCount) {
      return true
    }
    const directStr = String(directCell).toUpperCase().trim()
    if (directStr === normalizedCellId || directStr === String(cellOption.cellCount)) {
      return true
    }
  }

  // 2. Collect searchable text from product
  const textParts: string[] = []

  if (product.name) textParts.push(String(product.name))
  if (product.titulo) textParts.push(String(product.titulo))
  if (product.description) textParts.push(String(product.description))
  if (product.descripcion) textParts.push(String(product.descripcion))

  const specs = product.specifications || product.especificaciones
  if (typeof specs === 'string') {
    textParts.push(specs)
  } else if (specs && typeof specs === 'object') {
    textParts.push(JSON.stringify(specs))
  }

  if (Array.isArray(product.variationGroups)) {
    product.variationGroups.forEach((group: any) => {
      if (group?.name) textParts.push(group.name)
      if (Array.isArray(group?.options)) {
        group.options.forEach((opt: any) => {
          if (opt?.label) textParts.push(opt.label)
        })
      }
    })
  }

  if (Array.isArray(product.options)) {
    product.options.forEach((opt: any) => {
      if (opt?.label) textParts.push(opt.label)
    })
  }

  const fullText = textParts.join(' ')
  const normalizedFullText = normalizeText(fullText)

  // 3. Match cell count with boundary check (e.g. "4S", "4s", "4-S")
  // Matches "4S", "4s" with non-alphanumeric or start/end boundaries
  const cellRegex = new RegExp(`(?:^|[^a-zA-Z0-9])${cellOption.cellCount}s(?:[^a-zA-Z0-9]|$)`, 'i')
  if (cellRegex.test(fullText)) {
    return true
  }

  // 4. Match "X celda(s)" or "X cell(s)"
  const wordsRegex = new RegExp(`(?:^|[^a-zA-Z0-9])${cellOption.cellCount}\\s*(?:celda|cell)s?(?:[^a-zA-Z0-9]|$)`, 'i')
  if (wordsRegex.test(normalizedFullText)) {
    return true
  }

  // 5. Match nominal voltage pattern (e.g. 22.2V -> 6S, 14.8V -> 4S)
  if (cellOption.voltagePattern && cellOption.voltagePattern.test(fullText)) {
    return true
  }

  return false
}

/**
 * Computes product counts for each battery cell configuration.
 */
export function getBatteryCellCounts(products: Record<string, any>[]): Record<string, number> {
  const counts: Record<string, number> = {}

  BATTERY_CELL_OPTIONS.forEach((opt) => {
    counts[opt.id] = 0
  })

  if (!products || !Array.isArray(products)) return counts

  products.forEach((product) => {
    BATTERY_CELL_OPTIONS.forEach((opt) => {
      if (matchesBatteryCell(product, opt.id)) {
        counts[opt.id] = (counts[opt.id] || 0) + 1
      }
    })
  })

  return counts
}
