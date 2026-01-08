'use client'

import { useState, useEffect } from 'react'
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
  IconButton,
  Snackbar,
  Alert
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import { getAllPosts, createPost, updatePost, deletePost } from '@/firebase/adminServices'

export default function AdminPublications() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Dialog State
  const [openDialog, setOpenDialog] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    extract: '',
    content: '',
    imageUrl: '',
    tags: ''
  })

  // Notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const data = await getAllPosts()
      const mapped = data.map(p => ({
          ...p,
          publishedAt: p.publishedAt?.seconds ? new Date(p.publishedAt.seconds * 1000).toLocaleDateString() : 'N/A'
      }))
      setPosts(mapped)
    } catch (error) {
      console.error(error)
      setSnackbar({ open: true, message: 'Error al cargar publicaciones', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleOpenDialog = (post = null) => {
    if (post) {
      setCurrentPost(post)
      setFormData({
        title: post.title || '',
        extract: post.extract || '',
        content: post.content || '',
        imageUrl: post.imageUrl || '',
        tags: post.tags ? post.tags.join(', ') : ''
      })
    } else {
      setCurrentPost(null)
      setFormData({
        title: '',
        extract: '',
        content: '',
        imageUrl: '',
        tags: ''
      })
    }
    setOpenDialog(true)
  }

  const handleSave = async () => {
    try {
      const payload = {
        title: formData.title,
        extract: formData.extract,
        content: formData.content,
        imageUrl: formData.imageUrl,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      }

      if (currentPost) {
        await updatePost(currentPost.id, payload)
        setSnackbar({ open: true, message: 'Publicación actualizada', severity: 'success' })
      } else {
        await createPost(payload)
        setSnackbar({ open: true, message: 'Publicación creada', severity: 'success' })
      }
      
      setOpenDialog(false)
      fetchPosts()
    } catch (error) {
      console.error(error)
      setSnackbar({ open: true, message: 'Error al guardar publicación', severity: 'error' })
    }
  }

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta publicación?')) {
        try {
            await deletePost(id)
            setSnackbar({ open: true, message: 'Publicación eliminada', severity: 'success' })
            fetchPosts()
        } catch (error) {
            console.error(error)
            setSnackbar({ open: true, message: 'Error al eliminar', severity: 'error' })
        }
    }
  }

  const columns = [
    { field: 'title', headerName: 'Título', width: 250 },
    { field: 'publishedAt', headerName: 'Fecha Publicación', width: 150 },
    { field: 'tags', headerName: 'Tags', width: 200, valueGetter: (params) => params ? params.join(', ') : '' }, // Assuming tags is array
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => (
        <Box>
            <IconButton color="primary" onClick={() => handleOpenDialog(params.row)}>
                <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
                <DeleteIcon />
            </IconButton>
        </Box>
      )
    }
  ]

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Publicaciones (Blog)</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Nueva Publicación
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={posts}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
        />
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{currentPost ? 'Editar Publicación' : 'Nueva Publicación'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Título del Artículo"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              fullWidth
            />
            <TextField
              label="Extracto / Resumen"
              value={formData.extract}
              onChange={(e) => setFormData({...formData, extract: e.target.value})}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="URL Imagen Principal"
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              fullWidth
            />
            <TextField
              label="Contenido"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              fullWidth
              multiline
              rows={10}
              helperText="Puedes usar HTML básico o Markdown"
            />
             <TextField
              label="Tags (separados por coma)"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  )
}
