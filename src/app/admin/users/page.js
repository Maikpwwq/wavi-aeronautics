'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { getAllUsers, updateUser } from '@/firebase/adminServices'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastDoc, setLastDoc] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)
  
  // Edit Dialog State
  const [openEdit, setOpenEdit] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: '',
    role: '',
    email: ''
  })

  // Notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const fetchUsers = useCallback(async (isNextPage = false) => {
    try {
      if (isNextPage) setLoadingMore(true)
      else setLoading(true)

      const limit = 10
      const cursor = isNextPage ? lastDoc : null
      const result = await getAllUsers(limit, cursor)
      
      if (isNextPage) {
        setUsers(prev => [...prev, ...result.users])
      } else {
        setUsers(result.users)
      }
      
      setLastDoc(result.lastDoc)
    } catch (error) {
      console.error(error)
      setSnackbar({ open: true, message: 'Error al cargar usuarios', severity: 'error' })
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [lastDoc])

  useEffect(() => {
    fetchUsers()
  }, []) // Initial load

  const handleEditClick = (params) => {
    const user = params.row
    setCurrentUser(user)
    setEditForm({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || 'user',
      email: user.email || ''
    })
    setOpenEdit(true)
  }

  const handleSave = async () => {
    if (!currentUser) return

    try {
      await updateUser(currentUser.id, {
        name: editForm.name,
        phone: editForm.phone,
        address: editForm.address,
        role: editForm.role
      })
      
      // Update local state
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...editForm } : u))
      
      setSnackbar({ open: true, message: 'Usuario actualizado correctamente', severity: 'success' })
      setOpenEdit(false)
    } catch (error) {
      console.error(error)
      setSnackbar({ open: true, message: 'Error al actualizar usuario', severity: 'error' })
    }
  }

  const columns = [
    { field: 'id', headerName: 'UID', width: 150 },
    { field: 'name', headerName: 'Nombre', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Teléfono', width: 150 },
    { field: 'role', headerName: 'Rol', width: 120 },
    { 
      field: 'lastLogin', 
      headerName: 'Último Acceso', 
      width: 200,
      valueGetter: (params) => {
        // Handle different timestamp formats or missing values
        if (!params) return 'N/A'
        // If it's a Firestore Timestamp convert to date
        // Note: DataGrid valueGetter params logic changed in v6/v7, verifying v8 usage
        // params is value if simple, but here we access row data usually. 
        // In v6+ params is the value. 
        // Actually best to use valueGetter: (value, row) => ...
        return params ? new Date(params.seconds * 1000).toLocaleString() : 'N/A'
      }
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => (
        <Button variant="contained" size="small" onClick={() => handleEditClick(params)}>
          Editar
        </Button>
      )
    }
  ]

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Gestión de Usuarios</Typography>
      
      <Paper sx={{ height: 600, width: '100%', p: 2 }}>
        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          hideFooterPagination // We handle "Load More" manually for infinite scroll feeling or button
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => fetchUsers(true)} 
            disabled={loadingMore || !lastDoc}
          >
            {loadingMore ? 'Cargando...' : 'Cargar Más'}
          </Button>
        </Box>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
             <TextField
              label="UID"
              value={currentUser?.id || ''}
              disabled
              fullWidth
            />
            <TextField
              label="Email (Solo Lectura)"
              value={editForm.email}
              disabled
              fullWidth
            />
            <TextField
              label="Nombre"
              value={editForm.name}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              fullWidth
            />
            <TextField
              label="Teléfono"
              value={editForm.phone}
              onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
              fullWidth
            />
            <TextField
              label="Dirección"
              value={editForm.address}
              onChange={(e) => setEditForm({...editForm, address: e.target.value})}
              fullWidth
              multiline
              rows={2}
            />
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                value={editForm.role}
                label="Rol"
                onChange={(e) => setEditForm({...editForm, role: e.target.value})}
              >
                <MenuItem value="user">Usuario</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  )
}
