'use client'

/**
 * ReorderableImageList - Molecule component for drag-and-drop image reordering
 * 
 * Uses @dnd-kit for smooth drag-and-drop functionality.
 * 
 * @param {string[]} images - Array of image URLs
 * @param {function} onChange - Callback with reordered array
 * @param {function} onDelete - Callback when an image is deleted
 */

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Box, IconButton, Typography, Chip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

// ============================================================
// SortableImageItem - Individual draggable image
// ============================================================

function SortableImageItem({ id, url, index, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        position: 'relative',
        aspectRatio: '1',
        borderRadius: 2,
        overflow: 'hidden',
        border: '2px solid',
        borderColor: isDragging ? 'primary.main' : 'grey.200',
        backgroundColor: 'white',
        boxShadow: isDragging ? 4 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      {/* Image */}
      <Box
        component="img"
        src={typeof url === 'string' ? url : url?.url || ''}
        alt={`Imagen ${index + 1}`}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Drag Handle */}
      <Box
        {...attributes}
        {...listeners}
        sx={{
          position: 'absolute',
          top: 4,
          left: 4,
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 1,
          p: 0.5,
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
        }}
      >
        <DragIndicatorIcon sx={{ color: 'white', fontSize: 18 }} />
      </Box>

      {/* Position Badge */}
      <Chip
        label={index + 1}
        size="small"
        sx={{
          position: 'absolute',
          bottom: 4,
          left: 4,
          minWidth: 24,
          height: 24,
          fontWeight: 'bold',
          backgroundColor: index === 0 ? 'primary.main' : 'grey.700',
          color: 'white',
        }}
      />

      {/* Delete Button */}
      <Box
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={() => onDelete(url)}
          sx={{ color: 'white', p: 0.5 }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Primary Image Indicator */}
      {index === 0 && (
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            backgroundColor: 'primary.main',
            color: 'white',
            px: 1,
            py: 0.25,
            borderRadius: 1,
            fontSize: 10,
            fontWeight: 'bold',
          }}
        >
          Principal
        </Typography>
      )}
    </Box>
  )
}

// ============================================================
// ReorderableImageList - Main Component
// ============================================================

export default function ReorderableImageList({ images = [], onChange, onDelete }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Generate stable IDs for images
  const imageItems = images.map((url, idx) => ({
    id: `img-${idx}-${typeof url === 'string' ? url.slice(-20) : idx}`,
    url,
  }))

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = imageItems.findIndex(item => item.id === active.id)
      const newIndex = imageItems.findIndex(item => item.id === over.id)

      const newOrder = arrayMove(images, oldIndex, newIndex)
      onChange(newOrder)
    }
  }

  if (images.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
        No hay imágenes. Sube imágenes usando el área de arrastre.
      </Typography>
    )
  }

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        Arrastra para reordenar. La imagen #1 será la principal.
      </Typography>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={imageItems.map(i => i.id)} strategy={rectSortingStrategy}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: 1.5,
            }}
          >
            {imageItems.map((item, index) => (
              <SortableImageItem
                key={item.id}
                id={item.id}
                url={item.url}
                index={index}
                onDelete={onDelete}
              />
            ))}
          </Box>
        </SortableContext>
      </DndContext>
    </Box>
  )
}
