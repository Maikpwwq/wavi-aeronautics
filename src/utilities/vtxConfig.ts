import { VTX_SYSTEM_OPTIONS } from '@/types/filter'

/**
 * Normalizes text for matching by removing accents/diacritics and converting to lowercase.
 */
export function normalizeText(text: unknown): string {
  if (!text || typeof text !== 'string') return ''
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

/**
 * Checks whether a given product matches a specific VTX system.
 *
 * Inspects:
 * - Direct fields: `product.vtx`, `product.vtxSystem`, `product.sistemaVtx`
 * - Descriptive fields: `product.name`, `product.titulo`, `product.description`, `product.descripcion`
 * - Technical specs: `product.specifications`, `product.especificaciones`
 * - Variation options: `product.variationGroups`, `product.options`
 */
export function matchesVtxSystem(product: Record<string, any>, vtxId: string): boolean {
  if (!product || !vtxId) return false

  // 1. Direct field match if explicitly provided on product model
  const directVtx = normalizeText(product.vtx || product.vtxSystem || product.sistemaVtx)
  if (directVtx) {
    if (directVtx === vtxId.toLowerCase() || directVtx.includes(vtxId.toLowerCase())) {
      return true
    }
  }

  // 2. Lookup definition in canonical options
  const vtxOption = VTX_SYSTEM_OPTIONS.find((opt) => opt.id === vtxId)
  if (!vtxOption) return false

  // 3. Collect searchable text from product
  const textParts: string[] = []

  if (product.name) textParts.push(String(product.name))
  if (product.titulo) textParts.push(String(product.titulo))
  if (product.description) textParts.push(String(product.description))
  if (product.descripcion) textParts.push(String(product.descripcion))

  // Specifications (could be string or object)
  const specs = product.specifications || product.especificaciones
  if (typeof specs === 'string') {
    textParts.push(specs)
  } else if (specs && typeof specs === 'object') {
    textParts.push(JSON.stringify(specs))
  }

  // Variations (options, variationGroups)
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

  const fullText = normalizeText(textParts.join(' '))

  // 4. Keyword matching with boundary safety
  return vtxOption.keywords.some((keyword) => {
    const normalizedKeyword = normalizeText(keyword)

    // For short 2-character keywords like 'o3' or 'o4', use word boundary check
    if (normalizedKeyword === 'o3' || normalizedKeyword === 'o4') {
      const regex = new RegExp(`(^|[^a-z0-9])${normalizedKeyword}([^a-z0-9]|$)`, 'i')
      return regex.test(fullText)
    }

    return fullText.includes(normalizedKeyword)
  })
}
