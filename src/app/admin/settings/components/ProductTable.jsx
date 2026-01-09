'use client'

import { Paper, Button, Switch, useMediaQuery, useTheme } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

/**
 * ProductTable - Organism component for displaying products in a data grid
 * 
 * @param {Array} products - Normalized products array
 * @param {boolean} loading - Loading state
 * @param {function} onEdit - Callback when edit button clicked
 * @param {function} onToggleStatus - Callback when active toggle changes
 */
export default function ProductTable({ 
  products, 
  loading, 
  onEdit, 
  onToggleStatus 
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const columns = [
    { field: 'productID', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Nombre', width: isMobile ? 180 : 250, flex: isMobile ? 0 : 1 },
    { field: 'marca', headerName: 'Marca', width: 100 },
    { field: 'categoria', headerName: 'Categoría', width: 110 },
    { 
      field: 'price', 
      headerName: 'Precio', 
      width: 90,
      valueFormatter: (params) => params.value ? `$${params.value}` : '$0'
    },
    { field: 'stock', headerName: 'Stock', width: 70 },
    { 
      field: 'active', 
      headerName: 'Activo', 
      width: 70,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={() => onToggleStatus?.(params.row.id, params.value)}
          inputProps={{ 'aria-label': 'toggle active status' }}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Editar',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => onEdit(params.row)}
          sx={{ minWidth: '60px', padding: '2px 5px', fontSize: '0.75rem' }}
        >
          Editar
        </Button>
      )
    }
  ]

  // Columns to hide on mobile
  const columnVisibilityModel = {
    productID: !isMobile,
    marca: !isMobile,
    categoria: !isMobile,
    stock: !isMobile,
    // Always show: name, price, active, actions
  }

  return (
    <Paper sx={{ height: 550, width: '100%', overflow: 'hidden' }}>
      <DataGrid
        rows={products}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        columnVisibilityModel={columnVisibilityModel}
        pageSizeOptions={[10, 25, 50]}
        density="compact"
        sx={{
          '& .MuiDataGrid-cell': {
            fontSize: isMobile ? '0.8rem' : '0.875rem',
            padding: isMobile ? '0 5px' : undefined
          },
          '& .MuiDataGrid-columnHeader': {
             padding: isMobile ? '0 5px' : undefined
          }
        }}
      />
    </Paper>
  )
}
