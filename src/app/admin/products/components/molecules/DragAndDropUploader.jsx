'use client'

/**
 * DragAndDropUploader - Molecule component for image uploads to Firebase Storage
 * 
 * Uses react-dropzone for drag/drop and Firebase v9 SDK for uploads.
 * Returns array of URLs to parent via onUploadComplete callback.
 * 
 * @param {string} storagePath - Firebase Storage path (e.g., 'product-images/temp')
 * @param {function} onUploadComplete - Callback with updated URL array
 * @param {string[]} existingImages - Pre-existing image URLs (edit mode)
 * @param {number} maxFiles - Maximum number of files (default 10)
 */

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage'
import { storage } from '@/firebase/firebaseClient'

// MUI Components
import { 
  Box, 
  Typography, 
  LinearProgress, 
  IconButton,
  Paper,
  Alert
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

// ============================================================
// Helper: Generate unique filename
// ============================================================

const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-')
  return `${baseName}-${timestamp}-${randomStr}.${extension}`
}

// ============================================================
// DragAndDropUploader Component
// ============================================================

export default function DragAndDropUploader({
  storagePath = 'product-images',
  onUploadComplete,
  existingImages = [],
  maxFiles = 10,
  maxSizeMB = 5
}) {
  // State
  const [uploadingFiles, setUploadingFiles] = useState([])
  const [uploadedUrls, setUploadedUrls] = useState(existingImages)
  const [error, setError] = useState(null)

  // Sync existing images on mount/change
  useEffect(() => {
    if (existingImages.length > 0 && uploadedUrls.length === 0) {
      setUploadedUrls(existingImages)
    }
  }, [existingImages])

  // Notify parent when URLs change
  useEffect(() => {
    if (onUploadComplete) {
      onUploadComplete(uploadedUrls)
    }
  }, [uploadedUrls, onUploadComplete])

  // ==================== Upload Logic ====================

  const uploadFile = async (file) => {
    const uniqueName = generateUniqueFileName(file.name)
    const storageRef = ref(storage, `${storagePath}/${uniqueName}`)
    
    const uploadId = `${Date.now()}-${Math.random()}`
    
    // Add to uploading state
    setUploadingFiles(prev => [...prev, {
      id: uploadId,
      fileName: file.name,
      progress: 0,
      error: null
    }])

    try {
      const uploadTask = uploadBytesResumable(storageRef, file)

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )
            setUploadingFiles(prev => 
              prev.map(f => f.id === uploadId ? { ...f, progress } : f)
            )
          },
          (error) => {
            // Handle upload error
            setUploadingFiles(prev => 
              prev.map(f => f.id === uploadId ? { ...f, error: error.message } : f)
            )
            reject(error)
          },
          async () => {
            // Upload complete - get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            
            // Remove from uploading, add to uploaded
            setUploadingFiles(prev => prev.filter(f => f.id !== uploadId))
            setUploadedUrls(prev => [...prev, downloadURL])
            
            resolve(downloadURL)
          }
        )
      })
    } catch (err) {
      setUploadingFiles(prev => 
        prev.map(f => f.id === uploadId ? { ...f, error: err.message } : f)
      )
      throw err
    }
  }

  // ==================== Dropzone Config ====================

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setError(null)

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const reasons = rejectedFiles.map(f => 
        f.errors.map(e => e.message).join(', ')
      ).join('; ')
      setError(`Archivos rechazados: ${reasons}`)
    }

    // Check max files limit
    const totalFiles = uploadedUrls.length + uploadingFiles.length + acceptedFiles.length
    if (totalFiles > maxFiles) {
      setError(`Máximo ${maxFiles} imágenes permitidas`)
      return
    }

    // Upload all accepted files
    for (const file of acceptedFiles) {
      try {
        await uploadFile(file)
      } catch (err) {
        console.error('Upload error:', err)
      }
    }
  }, [uploadedUrls.length, uploadingFiles.length, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: true
  })

  // ==================== Remove Image ====================

  const handleRemoveImage = (urlToRemove) => {
    setUploadedUrls(prev => prev.filter(url => url !== urlToRemove))
  }

  const handleRemoveUploading = (uploadId) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== uploadId))
  }

  // ==================== Render ====================

  return (
    <Box>
      {/* Dropzone Area */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.light',
            backgroundColor: 'action.hover'
          }
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
        <Typography variant="body1" color="text.secondary">
          {isDragActive 
            ? 'Suelta las imágenes aquí...' 
            : 'Arrastra imágenes o haz clic para seleccionar'
          }
        </Typography>
        <Typography variant="caption" color="text.secondary">
          JPG, PNG, WebP • Máx {maxSizeMB}MB por archivo • Máx {maxFiles} imágenes
        </Typography>
      </Paper>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Uploading Progress */}
      {uploadingFiles.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Subiendo...
          </Typography>
          {uploadingFiles.map((file) => (
            <Box 
              key={file.id} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 1,
                p: 1,
                backgroundColor: file.error ? 'error.light' : 'grey.50',
                borderRadius: 1
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" noWrap>
                  {file.fileName}
                </Typography>
                {file.error ? (
                  <Typography variant="caption" color="error">
                    <ErrorIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                    {file.error}
                  </Typography>
                ) : (
                  <LinearProgress 
                    variant="determinate" 
                    value={file.progress} 
                    sx={{ mt: 0.5, height: 6, borderRadius: 1 }}
                  />
                )}
              </Box>
              <Typography variant="caption" sx={{ minWidth: 40 }}>
                {file.progress}%
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => handleRemoveUploading(file.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* Uploaded Images Grid */}
      {uploadedUrls.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Imágenes ({uploadedUrls.length}/{maxFiles})
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
            gap: 1 
          }}>
            {uploadedUrls.map((url, index) => (
              <Box 
                key={url} 
                sx={{ 
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}
              >
                <Box
                  component="img"
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  right: 0, 
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: '0 0 0 8px'
                }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleRemoveImage(url)}
                    sx={{ color: 'white' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: 4, 
                  left: 4 
                }}>
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}
