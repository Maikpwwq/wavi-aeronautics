'use client'

import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import PersonIcon from '@mui/icons-material/Person'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import { addProductQuestion } from '@/services/productInteractionService'

const ProductQuestions = ({ questions = [], productId, currentUser, onAuthRequired, onQuestionAdded }) => {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleOpen = () => {
    if (!currentUser) {
      onAuthRequired()
      return
    }
    setError('')
    setOpen(true)
  }

  const handleClose = () => {
    if (!submitting) {
      setOpen(false)
      setQuestion('')
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) {
      setError('Por favor escribe tu pregunta.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await addProductQuestion({
        productId,
        userId: currentUser.uid || currentUser.id,
        userName: currentUser.displayName || currentUser.name || currentUser.email?.split('@')[0] || 'Usuario Wavi',
        userEmail: currentUser.email || '',
        question
      })

      handleClose()
      if (onQuestionAdded) onQuestionAdded()
    } catch (err) {
      setError('Ocurrió un error al enviar tu pregunta. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1.1rem', md: '1.25rem' },
            color: 'text.primary',
            mb: 1.5
          }}
        >
          Preguntas técnicas sobre este producto ({questions.length})
        </Typography>

        <Button
          variant="outlined"
          startIcon={<HelpOutlineIcon />}
          onClick={handleOpen}
          sx={{
            color: '#ff6f00',
            borderColor: '#ff6f00',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            px: 2.5,
            py: 1,
            '&:hover': {
              borderColor: '#e65100',
              bgcolor: 'rgba(255, 111, 0, 0.08)'
            }
          }}
        >
          Escribe tu pregunta
        </Button>
      </Box>

      {/* Questions List */}
      <Box sx={{ flexGrow: 1, mt: 2 }}>
        {questions.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.02)',
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 3
            }}
          >
            <Typography variant="body2" color="text.secondary">
              ¿Tienes dudas técnicas sobre compatibilidad o accesorios? ¡Haz tu pregunta aquí!
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {questions.map((q) => (
              <Paper
                key={q.id}
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  transition: 'box-shadow 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }
                }}
              >
                {/* Question */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                  <QuestionAnswerIcon sx={{ color: '#00aCe4', fontSize: 20, mt: 0.2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                      {q.question}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, color: 'text.disabled' }}>
                      <PersonIcon sx={{ fontSize: 14 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {q.userName}
                      </Typography>
                      <Typography variant="caption">• {q.createdAt}</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Admin Answer if available */}
                {q.answer && (
                  <Box
                    sx={{
                      ml: 3,
                      mt: 1.5,
                      p: 1.75,
                      bgcolor: 'rgba(0, 172, 228, 0.06)',
                      borderRadius: 2,
                      borderLeft: '3px solid #00aCe4'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                      <SupportAgentIcon sx={{ fontSize: 16, color: '#00aCe4' }} />
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#00aCe4' }}>
                        Respuesta de Wavi Aeronautics
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                      {q.answer}
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      {/* Write Question Dialog Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Haz una pregunta técnica</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent dividers>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Tu pregunta técnica"
              placeholder="Ej: ¿Este dron incluye el receptor ELRS o debo comprarlo por separado?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              margin="normal"
              required
            />

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Nuestro equipo técnico responderá tu inquietud a la brevedad.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} disabled={submitting} sx={{ color: 'text.secondary' }}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ bgcolor: '#ff6f00', '&:hover': { bgcolor: '#e65100' } }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Enviar Pregunta'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  )
}

export default ProductQuestions
