'use client'

import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import CheckIcon from '@mui/icons-material/Check'
import { BRAND_COLORS } from '@/app/tienda/innerTheme'

/**
 * Normalizes product variation groups or legacy flat options into a unified
 * ProductVariationGroup array.
 *
 * @param {Object} product
 * @returns {Array} List of ProductVariationGroup
 */
export const extractVariationGroups = (product) => {
  if (!product) return []

  if (Array.isArray(product.variationGroups) && product.variationGroups.length > 0) {
    return product.variationGroups
  }

  if (Array.isArray(product.options) && product.options.length > 0) {
    return [
      {
        id: 'receiver_options',
        name: 'RECEIVER OPTIONS',
        required: true,
        options: product.options.map((opt, idx) => ({
          id: `opt_${idx}`,
          label: opt.label,
          priceDelta: opt.priceModifier ?? 0,
          skuSuffix: opt.skuSuffix || '',
          imageUrl: opt.imageUrl,
          images: opt.images
        }))
      }
    ]
  }

  return []
}

/**
 * Helper to determine if a color hex is dark (for icon contrast)
 */
const isColorDark = (hex) => {
  if (!hex || typeof hex !== 'string') return false
  const clean = hex.replace('#', '')
  if (clean.length !== 6 && clean.length !== 3) return false
  const r = parseInt(clean.length === 3 ? clean[0] + clean[0] : clean.substring(0, 2), 16)
  const g = parseInt(clean.length === 3 ? clean[1] + clean[1] : clean.substring(2, 4), 16)
  const b = parseInt(clean.length === 3 ? clean[2] + clean[2] : clean.substring(4, 6), 16)
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))
  return hsp < 140
}

/**
 * Detects the appropriate selector type for a variation group.
 * Supported types: 'color', 'pills', 'dropdown'
 *
 * @param {Object} group - ProductVariationGroup
 * @returns {'color' | 'pills' | 'dropdown'}
 */
export const detectVariationType = (group) => {
  if (group?.type === 'color' || group?.type === 'pills' || group?.type === 'dropdown') {
    return group.type
  }

  const nameLower = (group?.name || '').toLowerCase()

  // 1. Color: If name contains 'color' or any option has colorHex
  if (nameLower.includes('color') || group?.options?.some(opt => Boolean(opt.colorHex))) {
    return 'color'
  }

  // 2. Dropdown: If name contains 'receptor'/'receiver' or has many options (> 4)
  if (
    nameLower.includes('receptor') ||
    nameLower.includes('receiver') ||
    (Array.isArray(group?.options) && group.options.length > 4)
  ) {
    return 'dropdown'
  }

  // 3. Pills: motor, combo, batería, kv, tamaño, size
  if (
    nameLower.includes('motor') ||
    nameLower.includes('kv') ||
    nameLower.includes('combo') ||
    nameLower.includes('bater') ||
    nameLower.includes('tamaño') ||
    nameLower.includes('size')
  ) {
    return 'pills'
  }

  // 4. Default: 'pills' if options <= 4, else 'dropdown'
  if (Array.isArray(group?.options) && group.options.length <= 4) {
    return 'pills'
  }

  return 'dropdown'
}

/**
 * Product Variations Selector Component
 * Detects variation type (color, pills, dropdown) and renders appropriate interactive selectors.
 */
export const ProductVariations = ({
  product,
  selectedVariations = {},
  onVariationChange,
  showValidation = false
}) => {
  const groups = useMemo(() => extractVariationGroups(product), [product])

  if (!groups || groups.length === 0) {
    return null
  }

  const handleSelectChange = (groupId, optionId) => {
    const updatedMap = {
      ...selectedVariations,
      [groupId]: optionId
    }

    // Build the list of SelectedVariation objects
    const selectedList = []
    let allRequiredSelected = true

    groups.forEach((group) => {
      const chosenOptId = updatedMap[group.id]
      const chosenOption = (group.options || []).find((opt) => opt.id === chosenOptId)

      if (chosenOption) {
        selectedList.push({
          groupId: group.id,
          groupName: group.name,
          optionId: chosenOption.id,
          optionLabel: chosenOption.label,
          priceDelta: chosenOption.priceDelta ?? chosenOption.priceModifier ?? 0,
          skuSuffix: chosenOption.skuSuffix || '',
          imageUrl: chosenOption.imageUrl,
          images: chosenOption.images
        })
      } else if (group.required) {
        allRequiredSelected = false
      }
    })

    onVariationChange?.(updatedMap, selectedList, allRequiredSelected)
  }

  return (
    <Box
      data-testid="product-variations-container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        my: 2.5
      }}
    >
      {groups.map((group) => {
        const currentValue = selectedVariations[group.id] || ''
        const isMissingRequired = group.required && !currentValue && showValidation
        const selectorType = detectVariationType(group)
        const selectedOption = (group.options || []).find((opt) => opt.id === currentValue)

        return (
          <Box
            key={group.id}
            data-testid={`variation-group-${group.id}`}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: { xs: 1.5, sm: 2 },
              pb: 2.5,
              borderBottom: `1px solid ${BRAND_COLORS.border.light || '#e2e8f0'}`
            }}
          >
            {/* Group Label & Selection Summary */}
            <Box sx={{ minWidth: { sm: 180 }, flexShrink: 0 }}>
              <Typography
                component="label"
                htmlFor={`select-${group.id}`}
                sx={{
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  color: isMissingRequired ? '#d32f2f' : '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                {group.name}
                {group.required && (
                  <Box component="span" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                    *
                  </Box>
                )}
              </Typography>
              {selectedOption && (
                <Typography
                  variant="caption"
                  sx={{
                    color: '#0284c7',
                    fontWeight: 600,
                    display: 'block',
                    mt: 0.25
                  }}
                >
                  {selectedOption.label}
                </Typography>
              )}
            </Box>

            {/* Specialized Selector Body */}
            <Box sx={{ flex: 1, width: '100%', maxWidth: { sm: 380 } }}>
              {/* 1. COLOR SWATCHES SELECTOR */}
              {selectorType === 'color' && (
                <Box
                  role="radiogroup"
                  aria-label={group.name}
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1.25,
                    alignItems: 'center'
                  }}
                >
                  {(group.options || []).map((option) => {
                    const isSelected = currentValue === option.id
                    const delta = option.priceDelta ?? option.priceModifier ?? 0
                    const deltaLabel =
                      delta > 0
                        ? `(+$${delta})`
                        : delta < 0
                        ? `(-$${Math.abs(delta)})`
                        : ''
                    const colorHex = option.colorHex || '#00aCe4'

                    return (
                      <Box
                        key={option.id}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${option.label}${deltaLabel ? ' ' + deltaLabel : ''}`}
                        tabIndex={0}
                        onClick={() => handleSelectChange(group.id, option.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSelectChange(group.id, option.id)
                          }
                        }}
                        data-testid={`variation-color-${option.id}`}
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 1,
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 2,
                          cursor: 'pointer',
                          userSelect: 'none',
                          bgcolor: isSelected ? 'rgba(0, 172, 228, 0.08)' : '#ffffff',
                          border: isSelected ? '2px solid #00aCe4' : '1px solid #cbd5e1',
                          boxShadow: isSelected ? '0 2px 8px rgba(0, 172, 228, 0.2)' : 'none',
                          transition: 'all 0.18s ease-in-out',
                          '&:hover': {
                            borderColor: '#00aCe4',
                            bgcolor: isSelected ? 'rgba(0, 172, 228, 0.12)' : 'rgba(0, 172, 228, 0.04)',
                            transform: 'translateY(-1px)'
                          },
                          '&:active': {
                            transform: 'translateY(0)'
                          },
                          '&:focus-visible': {
                            outline: '2px solid #00aCe4',
                            outlineOffset: 2
                          }
                        }}
                      >
                        {/* Color swatch circle */}
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            bgcolor: colorHex,
                            border: '1px solid rgba(0, 0, 0, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {isSelected && (
                            <CheckIcon
                              sx={{
                                fontSize: 13,
                                color: isColorDark(colorHex) ? '#ffffff' : '#0f172a'
                              }}
                            />
                          )}
                        </Box>

                        {/* Option label */}
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? '#0f172a' : '#334155',
                            fontSize: '0.85rem'
                          }}
                        >
                          {option.label}
                        </Typography>

                        {deltaLabel && (
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              color: isSelected ? '#00aCe4' : '#64748b',
                              fontSize: '0.75rem'
                            }}
                          >
                            {deltaLabel}
                          </Typography>
                        )}
                      </Box>
                    )
                  })}
                </Box>
              )}

              {/* 2. PILLS BUTTONS SELECTOR */}
              {selectorType === 'pills' && (
                <Box
                  role="radiogroup"
                  aria-label={group.name}
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1.25,
                    alignItems: 'center'
                  }}
                >
                  {(group.options || []).map((option) => {
                    const isSelected = currentValue === option.id
                    const delta = option.priceDelta ?? option.priceModifier ?? 0
                    const deltaLabel =
                      delta > 0
                        ? `+$${delta} USD`
                        : delta < 0
                        ? `-$${Math.abs(delta)} USD`
                        : ''

                    return (
                      <Box
                        key={option.id}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${option.label}${deltaLabel ? ' ' + deltaLabel : ''}`}
                        tabIndex={0}
                        onClick={() => handleSelectChange(group.id, option.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSelectChange(group.id, option.id)
                          }
                        }}
                        data-testid={`variation-pill-${option.id}`}
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 1,
                          px: 2,
                          py: 0.9,
                          borderRadius: 2,
                          cursor: 'pointer',
                          userSelect: 'none',
                          bgcolor: isSelected ? '#00aCe4' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#0f172a',
                          border: isSelected ? '1px solid #00aCe4' : '1px solid #cbd5e1',
                          boxShadow: isSelected ? '0 2px 8px rgba(0, 172, 228, 0.35)' : 'none',
                          transition: 'all 0.18s ease-in-out',
                          '&:hover': {
                            borderColor: '#00aCe4',
                            bgcolor: isSelected ? '#0284c7' : 'rgba(0, 172, 228, 0.05)',
                            transform: 'translateY(-1px)'
                          },
                          '&:active': {
                            transform: 'translateY(0)'
                          },
                          '&:focus-visible': {
                            outline: '2px solid #00aCe4',
                            outlineOffset: 2
                          }
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: '0.88rem'
                          }}
                        >
                          {option.label}
                        </Typography>

                        {deltaLabel && (
                          <Box
                            component="span"
                            sx={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              py: 0.2,
                              px: 0.75,
                              borderRadius: 1,
                              bgcolor: isSelected
                                ? 'rgba(255, 255, 255, 0.25)'
                                : 'rgba(0, 172, 228, 0.1)',
                              color: isSelected ? '#ffffff' : '#0284c7'
                            }}
                          >
                            {deltaLabel}
                          </Box>
                        )}
                      </Box>
                    )
                  })}
                </Box>
              )}

              {/* 3. DROPDOWN SELECTOR */}
              {selectorType === 'dropdown' && (
                <FormControl
                  fullWidth
                  size="small"
                  error={isMissingRequired}
                >
                  <Select
                    id={`select-${group.id}`}
                    value={currentValue}
                    onChange={(e) => handleSelectChange(group.id, e.target.value)}
                    displayEmpty
                    data-testid={`variation-select-${group.id}`}
                    sx={{
                      bgcolor: '#ffffff',
                      borderRadius: 2,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: currentValue ? '#0f172a' : '#64748b',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isMissingRequired ? '#d32f2f' : '#cbd5e1'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: isMissingRequired ? '#d32f2f' : '#00aCe4'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: isMissingRequired ? '#d32f2f' : '#00aCe4'
                      },
                      '& .MuiSelect-select': {
                        py: 1.25,
                        px: 1.75
                      }
                    }}
                  >
                    {/* Default Placeholder Option */}
                    <MenuItem value="" disabled sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                      Selecciona una opción
                    </MenuItem>

                    {/* Available Options */}
                    {(group.options || []).map((option) => {
                      const delta = option.priceDelta ?? option.priceModifier ?? 0
                      const deltaLabel =
                        delta > 0
                          ? ` (+$${delta} USD)`
                          : delta < 0
                          ? ` (-$${Math.abs(delta)} USD)`
                          : ''

                      return (
                        <MenuItem
                          key={option.id}
                          value={option.id}
                          data-testid={`variation-option-${option.id}`}
                          sx={{
                            fontSize: '0.9rem',
                            py: 1,
                            '&:hover': { bgcolor: 'rgba(0, 172, 228, 0.08)' }
                          }}
                        >
                          {option.label}
                          {deltaLabel && (
                            <Box
                              component="span"
                              sx={{
                                color: '#00aCe4',
                                fontWeight: 700,
                                ml: 0.5
                              }}
                            >
                              {deltaLabel}
                            </Box>
                          )}
                        </MenuItem>
                      )
                    })}
                  </Select>

                  {isMissingRequired && (
                    <FormHelperText sx={{ color: '#d32f2f', mx: 0.5, mt: 0.5 }}>
                      Por favor selecciona una opción
                    </FormHelperText>
                  )}
                </FormControl>
              )}

              {/* Validation error message for non-dropdown types */}
              {selectorType !== 'dropdown' && isMissingRequired && (
                <Typography
                  variant="caption"
                  role="alert"
                  sx={{ color: '#d32f2f', display: 'block', mt: 0.5, fontWeight: 500 }}
                >
                  Por favor selecciona una opción
                </Typography>
              )}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

ProductVariations.propTypes = {
  product: PropTypes.object,
  selectedVariations: PropTypes.object,
  onVariationChange: PropTypes.func,
  showValidation: PropTypes.bool
}

export default ProductVariations
