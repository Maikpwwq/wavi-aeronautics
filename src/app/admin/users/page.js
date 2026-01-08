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
  
  // Form State
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    addresses: [], // Array of objects
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
      
      if (result.users.length < limit) {
        setLastDoc(null)
      } else {
        setLastDoc(result.lastDoc)
      }
    } catch (error) {
      console.error(error)
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: 'error' })
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
    
    // Safety check for addresses
    let addresses = []
    if (Array.isArray(user.addresses)) {
      addresses = user.addresses
    } else if (user.address) {
      // Legacy single address support
      addresses = [{street: user.address, city: '', country: '', state: '', zipCode: '', additionalInfo: ''}]
    }

    setEditForm({
      name: user.name || user.userName || '',
      phone: user.phone || user.phoneNumber || '',
      addresses: addresses,
      role: user.role || user.rol || 'user',
      email: user.email || user.userMail || ''
    })
    setOpenEdit(true)
  }

  const handleSave = async () => {
    if (!currentUser) return

    try {
      await updateUser(currentUser.id, {
        userName: editForm.name, // Mapping to userName as per user schema preference
        name: editForm.name,     // Keep standardized field too
        phoneNumber: editForm.phone,
        phone: editForm.phone,
        addresses: editForm.addresses, // Saving the full array
        rol: editForm.role,      // Mapping to rol as per user schema preference
        role: editForm.role
      })
      
      // Update local state
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { 
        ...u, 
        name: editForm.name,
        userName: editForm.name,
        phone: editForm.phone,
        phoneNumber: editForm.phone,
        role: editForm.role,
        rol: editForm.role,
        addresses: editForm.addresses
      } : u))
      
      setSnackbar({ open: true, message: 'Usuario actualizado correctamente', severity: 'success' })
      setOpenEdit(false)
    } catch (error) {
      console.error(error)
      setSnackbar({ open: true, message: 'Error al actualizar usuario', severity: 'error' })
    }
  }

  // Address Handlers
  const handleAddAddress = () => {
    setEditForm(prev => ({
      ...prev,
      addresses: [...prev.addresses, { street: '', city: '', state: '', country: '', zipCode: '', additionalInfo: '' }]
    }))
  }

  const handleRemoveAddress = (index) => {
    setEditForm(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }))
  }

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...editForm.addresses]
    newAddresses[index] = { ...newAddresses[index], [field]: value }
    setEditForm(prev => ({ ...prev, addresses: newAddresses }))
  }

  const columns = [
    { field: 'id', headerName: 'UID', width: 150 },
    { 
      field: 'name', 
      headerName: 'Nombre', 
      width: 200,
      valueGetter: (params, row) => row?.userName || row?.name || ''
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 250,
      valueGetter: (params, row) => row?.userMail || row?.email || ''
    },
    { 
      field: 'phone', 
      headerName: 'Teléfono', 
      width: 150,
      valueGetter: (params, row) => row?.phoneNumber || row?.phone || ''
    },
    { 
      field: 'role', 
      headerName: 'Rol', 
      width: 120,
      valueGetter: (params, row) => row?.rol || row?.role || 'user'
    },
    { 
      field: 'joined', 
      headerName: 'Fecha Registro', 
      width: 200,
      valueGetter: (params, row) => row?.userJoined || 'N/A'
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
          hideFooterPagination 
        />
        {lastDoc && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => fetchUsers(true)} 
              disabled={loadingMore}
            >
              {loadingMore ? 'Cargando...' : 'Cargar Más'}
            </Button>
          </Box>
        )}
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="md">
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
            <Box sx={{ display: 'flex', gap: 2 }}>
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
            </Box>
            
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

            <Typography variant="h6" sx={{ mt: 2 }}>Direcciones de Envío</Typography>
            {editForm.addresses.map((addr, index) => (
              <Paper key={index} sx={{ p: 2, bgcolor: 'background.default', border: '1px solid #eee' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2">Dirección {index + 1}</Typography>
                  <Button size="small" color="error" onClick={() => handleRemoveAddress(index)}>Eliminar</Button>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField 
                    label="Calle / Dirección" 
                    value={addr.street} 
                    onChange={(e) => handleAddressChange(index, 'street', e.target.value)} 
                    fullWidth 
                    size="small"
                  />
                   <TextField 
                    label="Información Adicional" 
                    value={addr.additionalInfo} 
                    onChange={(e) => handleAddressChange(index, 'additionalInfo', e.target.value)} 
                    fullWidth 
                    size="small"
                  />
                  <TextField 
                    label="Ciudad" 
                    value={addr.city} 
                    onChange={(e) => handleAddressChange(index, 'city', e.target.value)} 
                    fullWidth 
                    size="small"
                  />
                   <TextField 
                    label="Estado / Depto" 
                    value={addr.state} 
                    onChange={(e) => handleAddressChange(index, 'state', e.target.value)} 
                    fullWidth 
                    size="small"
                  />
                   <TextField 
                    label="País" 
                    value={addr.country} 
                    onChange={(e) => handleAddressChange(index, 'country', e.target.value)} 
                    fullWidth 
                    size="small"
                  />
                   <TextField 
                    label="Código Postal" 
                    value={addr.zipCode} 
                    onChange={(e) => handleAddressChange(index, 'zipCode', e.target.value)} 
                    fullWidth 
                    size="small"
                  />
                </Box>
              </Paper>
            ))}
            <Button variant="outlined" onClick={handleAddAddress} sx={{ alignSelf: 'start' }}>+ Agregar Dirección</Button>

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
