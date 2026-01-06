/**
 * Utility functions for parsing product data strings
 * Used by ProductDetail and related sub-components
 */

/**
 * Parses a package items string into an array of items.
 * Input format: "* 1 x Item A * 2 x Item B"
 * @param {string} rawString - The raw string to parse
 * @returns {string[]} - Array of cleaned item strings
 */
export const parsePackageItems = (rawString) => {
  if (!rawString || typeof rawString !== 'string') return []
  
  return rawString
    .split('*')
    .map(item => item.trim())
    .filter(item => item.length > 0)
}

/**
 * Parses a specifications string into label-value pairs.
 * Input format: "* Weight: 5kg * Material: Steel"
 * @param {string} rawString - The raw string to parse
 * @returns {Array<{label: string, value: string}>} - Array of spec objects
 */
export const parseSpecifications = (rawString) => {
  if (!rawString || typeof rawString !== 'string') return []
  
  return rawString
    .split('*')
    .map(item => item.trim())
    .filter(item => item.length > 0)
    .map(item => {
      const colonIndex = item.indexOf(':')
      if (colonIndex === -1) {
        return { label: item, value: '' }
      }
      return {
        label: item.substring(0, colonIndex).trim(),
        value: item.substring(colonIndex + 1).trim()
      }
    })
}
