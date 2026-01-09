'use client'

import { Paper, Button, Switch } from '@mui/material'
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
  const columns = [
    { field: 'productID', headerName: 'ID Producto', width: 120 },
    { field: 'name', headerName: 'Nombre', width: 220, flex: 1 },
    { field: 'marca', headerName: 'Marca', width: 120 },
    { 
      field: 'price', 
      headerName: 'Precio', 
      width: 100,
      valueFormatter: (params) => params.value ? `$${params.value}` : ''
    },
    { field: 'stock', headerName: 'Stock', width: 80 },
    { 
      field: 'active', 
      headerName: 'Activo', 
      width: 80,
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
      headerName: 'Acciones',
      width: 100,
      renderCell: (params) => (
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => onEdit(params.row)}
        >
          Editar
        </Button>
      )
    }
  ]

  return (
    <Paper sx={{ height: 550, width: '100%' }}>
      <DataGrid
        rows={products}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        pageSizeOptions={[10, 25, 50]}
        density="compact"
      />
    </Paper>
  )
}
