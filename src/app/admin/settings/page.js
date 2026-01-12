'use client'

import { useState } from 'react'
import { Box, Typography, Tabs, Tab } from '@mui/material'

// ============================================================
// ConfigPanel - Main configuration management organism
// ============================================================

function ConfigPanel() {

  // ==================== Render ====================
  
  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2 
      }}>
        <Typography variant="h6">Variables</Typography>
      </Box>    
    </Box>
  )
}

// ============================================================
// AdminSettings - Page component with tabs
// ============================================================

export default function AdminSettings() {
  const [tabValue, setTabValue] = useState(0)

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Configuración
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Configuración General" />
          <Tab label="Permisos de usuarios" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Typography color="text.secondary">
          Configuraciones generales del sitio (en construcción).
        </Typography>
      )}
      
      {tabValue === 1 && (
        <Typography color="text.secondary">
          Configuraciones de permisos de usuarios (en construcción).
        </Typography>
      )}
    </Box>
  )
}
