'use client'

import { FormControl, InputLabel, Select, MenuItem, Typography, Box } from '@mui/material'
import { CATEGORIES } from '../config'

/**
 * CategorySelector - Molecule component for selecting product category
 * 
 * @param {string} selectedCategory - Currently selected category key
 * @param {function} onCategoryChange - Callback when category changes
 * @param {number} productCount - Number of products in selected category
 */
export default function CategorySelector({ 
  selectedCategory, 
  onCategoryChange, 
  productCount = 0 
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <FormControl sx={{ minWidth: 200 }} size="small">
        <InputLabel>Categoría</InputLabel>
        <Select
          value={selectedCategory}
          label="Categoría"
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <MenuItem key={cat.key} value={cat.key}>
              {cat.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Typography variant="body2" color="text.secondary">
        {productCount} productos
      </Typography>
    </Box>
  )
}
