'use client'

import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
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
 * Product Variations Selector Component
 * Renders dynamic dropdown selectors for product configuration groups (Receiver, Motor, etc.)
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

        return (
          <Box
            key={group.id}
            data-testid={`variation-group-${group.id}`}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: { xs: 1, sm: 2 },
              pb: 2,
              borderBottom: `1px solid ${BRAND_COLORS.border.light || '#e2e8f0'}`
            }}
          >
            {/* Group Label */}
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
            </Box>

            {/* Select Dropdown */}
            <FormControl
              fullWidth
              size="small"
              error={isMissingRequired}
              sx={{ maxWidth: { sm: 340 } }}
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
