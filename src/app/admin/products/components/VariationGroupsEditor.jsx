'use client'

import React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'
import Tooltip from '@mui/material/Tooltip'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import PaletteIcon from '@mui/icons-material/Palette'
import SpeedIcon from '@mui/icons-material/Speed'
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull'
import TuneIcon from '@mui/icons-material/Tune'

import {
  RECEIVER_VARIATION_OPTIONS,
  buildReceiverVariationGroup,
  DRONE_CATEGORIES_WITH_RECEIVERS
} from '@/app/admin/products/config'

/**
 * VariationGroupsEditor Component
 * Unified variation groups manager for all store categories.
 * Supports:
 * - Drone Receiver presets with checkboxes
 * - Additional custom variation groups for drones (Color, Motors, Combos, etc.)
 * - Generic variation groups for all other categories
 * - Selector types: 'pills' (Buttons/Pills), 'color' (Color swatches), 'dropdown' (Select)
 */
export const VariationGroupsEditor = ({
  category = '',
  variationGroups = [],
  onChange,
  selectedReceiverIds = [],
  onReceiverIdsChange
}) => {
  const isDroneCategory = DRONE_CATEGORIES_WITH_RECEIVERS.includes(category)

  // Receiver group is managed via the preset checkboxes
  const otherGroups = (variationGroups || []).filter(g => g.id !== 'receiver_type')

  // -------------------------------------------------------------
  // Handlers for Drone Receiver Preset
  // -------------------------------------------------------------
  const handleReceiverToggle = (optId, isChecked) => {
    let updatedIds
    if (isChecked) {
      updatedIds = [...selectedReceiverIds, optId]
    } else {
      updatedIds = selectedReceiverIds.filter(id => id !== optId)
    }

    onReceiverIdsChange?.(updatedIds)

    const receiverGroup = buildReceiverVariationGroup(updatedIds)
    const newGroups = receiverGroup.options.length > 0
      ? [receiverGroup, ...otherGroups]
      : otherGroups

    onChange?.(newGroups)
  }

  const handleSelectAllReceivers = () => {
    const allIds = RECEIVER_VARIATION_OPTIONS.map(o => o.id)
    onReceiverIdsChange?.(allIds)
    const receiverGroup = buildReceiverVariationGroup(allIds)
    onChange?.([receiverGroup, ...otherGroups])
  }

  const handleClearReceivers = () => {
    onReceiverIdsChange?.([])
    onChange?.(otherGroups)
  }

  // -------------------------------------------------------------
  // Handlers for Custom / Additional Variation Groups
  // -------------------------------------------------------------
  const updateGroups = (newOtherGroups) => {
    const receiverGroup = (variationGroups || []).find(g => g.id === 'receiver_type')
    if (isDroneCategory && receiverGroup && receiverGroup.options.length > 0) {
      onChange?.([receiverGroup, ...newOtherGroups])
    } else {
      onChange?.(newOtherGroups)
    }
  }

  const handleAddPresetGroup = (presetType) => {
    const timestamp = Date.now()
    let newGroup

    switch (presetType) {
      case 'color':
        newGroup = {
          id: `color_${timestamp}`,
          name: 'COLOR',
          type: 'color',
          required: true,
          options: [
            { id: 'negro', label: 'Negro', priceDelta: 0, colorHex: '#1e1e1e' },
            { id: 'blanco', label: 'Blanco', priceDelta: 0, colorHex: '#ffffff' },
            { id: 'rojo', label: 'Rojo', priceDelta: 0, colorHex: '#ef4444' }
          ]
        }
        break
      case 'motors':
        newGroup = {
          id: `motors_${timestamp}`,
          name: 'MOTORES',
          type: 'pills',
          required: true,
          options: [
            { id: '1800kv', label: '1800KV (6S)', priceDelta: 0 },
            { id: '2450kv', label: '2450KV (4S)', priceDelta: 0 }
          ]
        }
        break
      case 'combo':
        newGroup = {
          id: `combo_${timestamp}`,
          name: 'COMBO',
          type: 'pills',
          required: true,
          options: [
            { id: 'sin-bateria', label: 'Sin Batería', priceDelta: 0 },
            { id: 'con-1-bateria', label: 'Con 1x Batería', priceDelta: 25 },
            { id: 'con-2-baterias', label: 'Con 2x Baterías', priceDelta: 45 }
          ]
        }
        break
      default:
        newGroup = {
          id: `group_${timestamp}`,
          name: '',
          type: 'pills',
          required: true,
          options: [
            { id: `opt_${timestamp}_1`, label: '', priceDelta: 0 }
          ]
        }
    }

    updateGroups([...otherGroups, newGroup])
  }

  const handleUpdateGroupField = (groupIndex, field, value) => {
    const updated = otherGroups.map((group, idx) => {
      if (idx !== groupIndex) return group
      return { ...group, [field]: value }
    })
    updateGroups(updated)
  }

  const handleDeleteGroup = (groupIndex) => {
    const updated = otherGroups.filter((_, idx) => idx !== groupIndex)
    updateGroups(updated)
  }

  const handleAddOption = (groupIndex) => {
    const updated = otherGroups.map((group, idx) => {
      if (idx !== groupIndex) return group
      const optId = `opt_${Date.now()}`
      const newOption = {
        id: optId,
        label: '',
        priceDelta: 0,
        ...(group.type === 'color' ? { colorHex: '#00aCe4' } : {})
      }
      return {
        ...group,
        options: [...(group.options || []), newOption]
      }
    })
    updateGroups(updated)
  }

  const handleUpdateOption = (groupIndex, optionIndex, field, value) => {
    const updated = otherGroups.map((group, gIdx) => {
      if (gIdx !== groupIndex) return group
      const newOptions = (group.options || []).map((opt, oIdx) => {
        if (oIdx !== optionIndex) return opt
        return { ...opt, [field]: value }
      })
      return { ...group, options: newOptions }
    })
    updateGroups(updated)
  }

  const handleDeleteOption = (groupIndex, optionIndex) => {
    const updated = otherGroups.map((group, gIdx) => {
      if (gIdx !== groupIndex) return group
      const newOptions = (group.options || []).filter((_, oIdx) => oIdx !== optionIndex)
      return { ...group, options: newOptions }
    })
    updateGroups(updated)
  }

  return (
    <Box data-testid="variation-groups-editor" sx={{ mt: 1 }}>
      {/* ── Preset for Drone Categories (Receiver options) ── */}
      {isDroneCategory && (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            bgcolor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
              Tipos de Receptor Disponibles (Preset Drones)
            </Typography>
            <Chip
              label="Selector: Desplegable"
              size="small"
              sx={{ fontSize: '0.72rem', bgcolor: 'rgba(0, 172, 228, 0.1)', color: '#0284c7', fontWeight: 600 }}
            />
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            Selecciona las configuraciones de receptor que el cliente podrá elegir en la tienda para este dron.
          </Alert>

          <FormGroup sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 0.5 }}>
            {RECEIVER_VARIATION_OPTIONS.map((opt) => (
              <FormControlLabel
                key={opt.id}
                control={
                  <Checkbox
                    checked={(selectedReceiverIds || []).includes(opt.id)}
                    onChange={(e) => handleReceiverToggle(opt.id, e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {opt.label}
                    </Typography>
                    {opt.priceDelta > 0 && (
                      <Chip
                        label={`+$${opt.priceDelta} USD`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 22 }}
                      />
                    )}
                  </Box>
                }
                sx={{
                  mx: 0,
                  py: 0.5,
                  px: 1,
                  borderRadius: 1,
                  transition: 'background-color 0.15s ease',
                  '&:hover': { bgcolor: 'rgba(0, 172, 228, 0.04)' }
                }}
              />
            ))}
          </FormGroup>

          <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
            <Button size="small" variant="outlined" onClick={handleSelectAllReceivers}>
              Seleccionar todos
            </Button>
            <Button size="small" variant="text" color="error" onClick={handleClearReceivers}>
              Limpiar
            </Button>
          </Box>
        </Paper>
      )}

      {/* ── Additional / Custom Variation Groups Section ── */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {isDroneCategory ? 'Variaciones Adicionales (Color, Motores, etc.)' : 'Variaciones del Producto'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Agrega opciones configurables con selectores inteligentes en el detalle del producto.
            </Typography>
          </Box>

          {/* Quick preset buttons */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<PaletteIcon fontSize="small" />}
              onClick={() => handleAddPresetGroup('color')}
              sx={{ textTransform: 'none', fontSize: '0.78rem' }}
            >
              + Color
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<SpeedIcon fontSize="small" />}
              onClick={() => handleAddPresetGroup('motors')}
              sx={{ textTransform: 'none', fontSize: '0.78rem' }}
            >
              + Motores
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<BatteryChargingFullIcon fontSize="small" />}
              onClick={() => handleAddPresetGroup('combo')}
              sx={{ textTransform: 'none', fontSize: '0.78rem' }}
            >
              + Combo
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon fontSize="small" />}
              onClick={() => handleAddPresetGroup('custom')}
              sx={{
                bgcolor: '#00aCe4',
                color: '#ffffff',
                textTransform: 'none',
                fontSize: '0.78rem',
                '&:hover': { bgcolor: '#0284c7' }
              }}
            >
              + Grupo Personalizado
            </Button>
          </Box>
        </Box>

        {/* List of Custom Variation Groups */}
        {otherGroups.length === 0 ? (
          <Box
            sx={{
              py: 3,
              px: 2,
              textAlign: 'center',
              border: '1px dashed #cbd5e1',
              borderRadius: 2,
              bgcolor: '#f8fafc'
            }}
          >
            <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
              {isDroneCategory
                ? 'No hay variaciones adicionales configuradas. Puedes añadir Color, Motores o Combos si este dron los ofrece.'
                : 'No hay variaciones creadas para este producto. Agrega un grupo como Color, Tamaño o Combo usando los botones superiores.'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {otherGroups.map((group, groupIdx) => (
              <Paper
                key={group.id || groupIdx}
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                {/* Group Header Row */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1.5,
                    pb: 2,
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  {/* Group Name */}
                  <TextField
                    label="Nombre de la Variación"
                    size="small"
                    value={group.name || ''}
                    placeholder="Ej. COLOR, MOTORES, TAMAÑO"
                    onChange={(e) => handleUpdateGroupField(groupIdx, 'name', e.target.value.toUpperCase())}
                    sx={{ minWidth: 200, flex: 1 }}
                  />

                  {/* Selector Type */}
                  <FormControl size="small" sx={{ minWidth: 190 }}>
                    <InputLabel id={`selector-type-label-${groupIdx}`}>Tipo de Selector</InputLabel>
                    <Select
                      labelId={`selector-type-label-${groupIdx}`}
                      value={group.type || 'pills'}
                      label="Tipo de Selector"
                      onChange={(e) => handleUpdateGroupField(groupIdx, 'type', e.target.value)}
                    >
                      <MenuItem value="pills">Botones / Pastillas</MenuItem>
                      <MenuItem value="color">Muestras de Color</MenuItem>
                      <MenuItem value="dropdown">Menú Desplegable</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Required Switch */}
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={group.required !== false}
                        onChange={(e) => handleUpdateGroupField(groupIdx, 'required', e.target.checked)}
                      />
                    }
                    label="Obligatorio"
                    sx={{ m: 0 }}
                  />

                  {/* Delete Group */}
                  <Tooltip title="Eliminar este grupo de variación">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDeleteGroup(groupIdx)}
                      aria-label={`Eliminar grupo ${group.name || groupIdx}`}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Options List */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 1 }}>
                    OPCIONES DISPONIBLES:
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {(group.options || []).map((option, optIdx) => (
                      <Box
                        key={option.id || optIdx}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          flexWrap: { xs: 'wrap', sm: 'nowrap' }
                        }}
                      >
                        {/* Option Label */}
                        <TextField
                          label="Etiqueta"
                          size="small"
                          value={option.label || ''}
                          placeholder={group.type === 'color' ? 'Ej. Negro Mate' : 'Ej. 2450KV'}
                          onChange={(e) => handleUpdateOption(groupIdx, optIdx, 'label', e.target.value)}
                          sx={{ flex: 2, minWidth: 140 }}
                        />

                        {/* Price Delta */}
                        <TextField
                          label="Modificador ($ USD)"
                          size="small"
                          type="number"
                          value={option.priceDelta ?? 0}
                          onChange={(e) => handleUpdateOption(groupIdx, optIdx, 'priceDelta', parseFloat(e.target.value) || 0)}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">+$</InputAdornment>
                          }}
                          sx={{ flex: 1, minWidth: 120, maxWidth: 160 }}
                        />

                        {/* Optional Color Hex Picker */}
                        {group.type === 'color' && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Box
                              component="input"
                              type="color"
                              value={option.colorHex || '#00aCe4'}
                              onChange={(e) => handleUpdateOption(groupIdx, optIdx, 'colorHex', e.target.value)}
                              sx={{
                                width: 36,
                                height: 36,
                                p: 0,
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                bgcolor: 'transparent'
                              }}
                            />
                            <TextField
                              size="small"
                              value={option.colorHex || ''}
                              placeholder="#1e1e1e"
                              onChange={(e) => handleUpdateOption(groupIdx, optIdx, 'colorHex', e.target.value)}
                              sx={{ width: 100 }}
                            />
                          </Box>
                        )}

                        {/* Delete Option Button */}
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteOption(groupIdx, optIdx)}
                          aria-label={`Eliminar opción ${option.label || optIdx}`}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    size="small"
                    variant="text"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddOption(groupIdx)}
                    sx={{ mt: 1, textTransform: 'none', fontWeight: 600, color: '#00aCe4' }}
                  >
                    Agregar Opción a {group.name || 'esta variación'}
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

VariationGroupsEditor.propTypes = {
  category: PropTypes.string,
  variationGroups: PropTypes.array,
  onChange: PropTypes.func,
  selectedReceiverIds: PropTypes.array,
  onReceiverIdsChange: PropTypes.func
}

export default VariationGroupsEditor
