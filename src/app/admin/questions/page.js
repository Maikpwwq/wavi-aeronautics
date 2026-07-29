'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Modal,
  Backdrop,
  Fade,
  Button,
  Tabs,
  Tab,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import {
  fetchAllQuestions,
  answerAndEditQuestion,
  markQuestionDuplicated,
  deleteQuestion
} from '@/services/productInteractionService'
import { motion } from 'framer-motion'

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0) // 0: Todas, 1: Sin responder, 2: Respondidas, 3: Duplicadas
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [questionText, setQuestionText] = useState('')
  const [answerText, setAnswerText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const loadQuestions = async () => {
    setLoading(true)
    try {
      const data = await fetchAllQuestions()
      setQuestions(data)
    } catch (err) {
      console.error('Error loading questions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuestions()
  }, [])

  const handleOpenAnswerModal = (q) => {
    setSelectedQuestion(q)
    setQuestionText(q.question || '')
    setAnswerText(q.answer || '')
    setIsModalOpen(true)
  }

  const handleSaveAnswer = async (e) => {
    e.preventDefault()
    if (!selectedQuestion) return
    setActionLoading(true)
    try {
      await answerAndEditQuestion(selectedQuestion.id, {
        question: questionText,
        answer: answerText
      })
      setIsModalOpen(false)
      await loadQuestions()
    } catch (err) {
      console.error('Error saving answer:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleMarkDuplicated = async (id) => {
    if (!window.confirm('¿Marcar esta pregunta como duplicada? Se ocultará de la tienda.')) return
    setActionLoading(true)
    try {
      await markQuestionDuplicated(id)
      await loadQuestions()
    } catch (err) {
      console.error('Error marking duplicated:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) return
    setActionLoading(true)
    try {
      await deleteQuestion(id)
      setIsModalOpen(false)
      await loadQuestions()
    } catch (err) {
      console.error('Error deleting question:', err)
    } finally {
      setActionLoading(false)
    }
  }

  // Filter questions by active tab
  const filteredQuestions = questions.filter((q) => {
    if (tabValue === 1) return (!q.answer || q.answer.trim() === '') && q.status !== 'duplicated'
    if (tabValue === 2) return q.answer && q.answer.trim() !== '' && q.status !== 'duplicated'
    if (tabValue === 3) return q.status === 'duplicated'
    return true
  })

  const columns = [
    {
      field: 'productName',
      headerName: 'Producto',
      flex: 1.2,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a2744' }}>
          {params.value || 'Producto'}
        </Typography>
      )
    },
    {
      field: 'userName',
      headerName: 'Usuario',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'question',
      headerName: 'Pregunta',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'answer',
      headerName: 'Respuesta Admin',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) =>
        params.value ? (
          <Typography variant="body2" color="text.secondary" noWrap>
            {params.value}
          </Typography>
        ) : (
          <Typography variant="caption" color="text.disabled" italic>
            Sin responder
          </Typography>
        )
    },
    {
      field: 'createdAtFormatted',
      headerName: 'Fecha',
      width: 140,
      renderCell: (params) => (
        <Typography variant="caption" color="text.secondary">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 130,
      renderCell: (params) => {
        if (params.row.status === 'duplicated') {
          return <Chip label="Duplicada" color="default" size="small" variant="outlined" />
        }
        return params.row.answer ? (
          <Chip label="Respondida" color="success" size="small" variant="outlined" />
        ) : (
          <Chip label="Sin responder" color="warning" size="small" variant="outlined" />
        )
      }
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Responder / Editar Ortografía">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleOpenAnswerModal(params.row)}
            >
              <QuestionAnswerIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {params.row.status !== 'duplicated' && (
            <Tooltip title="Marcar como Duplicada">
              <IconButton
                color="warning"
                size="small"
                onClick={() => handleMarkDuplicated(params.row.id)}
                disabled={actionLoading}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Eliminar">
            <IconButton
              color="error"
              size="small"
              onClick={() => handleDelete(params.row.id)}
              disabled={actionLoading}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <QuestionAnswerIcon sx={{ fontSize: 32, color: '#00bcd4' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a2744' }}>
            Gestión de Preguntas Técnicas
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, val) => setTabValue(val)}
          indicatorColor="primary"
          textColor="inherit"
          sx={{
            '& .Mui-selected': { color: '#00bcd4', fontWeight: 'bold' }
          }}
        >
          <Tab label={`Todas (${questions.length})`} />
          <Tab
            label={`Sin responder (${
              questions.filter((q) => (!q.answer || q.answer.trim() === '') && q.status !== 'duplicated').length
            })`}
          />
          <Tab
            label={`Respondidas (${
              questions.filter((q) => q.answer && q.answer.trim() !== '' && q.status !== 'duplicated').length
            })`}
          />
          <Tab label={`Duplicadas (${questions.filter((q) => q.status === 'duplicated').length})`} />
        </Tabs>
      </Paper>

      {/* Data Table */}
      <Paper sx={{ width: '100%', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <DataGrid
          rows={filteredQuestions}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } }
          }}
          autoHeight
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center'
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              color: '#475569',
              fontWeight: 'bold'
            }
          }}
        />
      </Paper>

      {/* Answer & Formulation Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeAfterTransition
        Slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isModalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 600 },
              bgcolor: 'background.paper',
              borderRadius: 4,
              boxShadow: 24,
              p: 4
            }}
          >
            {selectedQuestion && (
              <Box component="form" onSubmit={handleSaveAnswer}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a2744', mb: 2 }}>
                  Responder o Corregir Pregunta
                </Typography>

                <Box sx={{ mb: 2.5, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Producto: <strong>{selectedQuestion.productName || 'Producto sin nombre'}</strong>
                  </Typography>
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    Preguntado por: <strong>{selectedQuestion.userName}</strong> ({selectedQuestion.userEmail || 'Sin email'})
                  </Typography>
                </Box>

                {/* Edit Question Formulation */}
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Formulación de la pregunta (puedes corregir ortografía)"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  margin="normal"
                  required
                  helperText="Corrige redactado u ortografía para ofrecer mejor calidad de contenido al cliente."
                />

                {/* Answer Input */}
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Respuesta Oficial de Wavi Aeronautics"
                  placeholder="Escribe la respuesta técnica oficial..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  margin="normal"
                  required
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
                  <Button variant="text" onClick={() => setIsModalOpen(false)} disabled={actionLoading}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SupportAgentIcon />}
                    disabled={actionLoading}
                    sx={{ bgcolor: '#00aCe4', '&:hover': { bgcolor: '#0086b3' } }}
                  >
                    {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Guardar Respuesta'}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}
