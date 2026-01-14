'use client'
import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'

// MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// Services & Config
import { createNewProduct } from '@/firebase/adminServices'
import { buildProductPayload } from '../config'

/**
 * MigrationTool Component
 * 
 * Bulk migration tool for converting legacy productos (Spanish schema) 
 * to new products hierarchy (English schema).
 * 
 * Flow: Redux Store → buildProductPayload() → createNewProduct() → Firestore
 */
const MigrationTool = () => {
  // Redux state - legacy products loaded from productos collection
  const shopState = useSelector((store) => store?.shop)

  // Migration state
  const [migrating, setMigrating] = useState(null) // Currently migrating category
  const [progress, setProgress] = useState({})    // { category: { total, done, errors } }
  const [results, setResults] = useState({})      // { category: 'done' | 'error' | 'ready' }
  const [errorDetails, setErrorDetails] = useState({}) // { category: [error messages] }
  const [exchangeRate, setExchangeRate] = useState(() => {
    const envRate = Number(process.env.NEXT_PUBLIC_DOLARTOCOP)
    return !isNaN(envRate) && envRate > 0 ? envRate : 4150
  }) // Default exchange rate COP -> USD

  // Category mapping: Redux key → display label + Firestore category
  const CATEGORY_MAP = useMemo(() => [
    { reduxKey: 'googles', label: 'Googles', firestoreCategory: 'googles' },
    { reduxKey: 'digitalVTX', label: 'Digital VTX', firestoreCategory: 'digitalVTX' },
    { reduxKey: 'dronesRC', label: 'Drones RC', firestoreCategory: 'dronesRC' },
    { reduxKey: 'dronesKit', label: 'Kit Drones', firestoreCategory: 'dronesKit' },
    { reduxKey: 'dronesHD', label: 'Drones HD', firestoreCategory: 'dronesHD' },
    { reduxKey: 'baterias', label: 'Baterías/Accesorios', firestoreCategory: 'baterias' },
    { reduxKey: 'receptors', label: 'Receptores', firestoreCategory: 'receptors' },
    { reduxKey: 'transmisors', label: 'Transmisores', firestoreCategory: 'transmisors' },
    { reduxKey: 'radioControl', label: 'Radio Control', firestoreCategory: 'radioControl' },
  ], [])

  // Get products for each category from Redux
  const getCategoryProducts = (reduxKey) => {
    return shopState?.[reduxKey] || []
  }

  // Format brand for Firestore path (lowercase, trimmed, default if empty)
  const formatBrand = (brand) => {
    if (!brand || typeof brand !== 'string') return 'default'
    const formatted = brand.toLowerCase().trim().replace(/\s+/g, '-')
    return formatted || 'default'
  }

  // Parse legacy price string "$ 1.200.000" → 1200000 (COP as stored)
  const parseLegacyPrice = (priceValue) => {
    if (typeof priceValue === 'number') return priceValue
    if (!priceValue || typeof priceValue !== 'string') return 0
    // Remove currency symbol, dots, spaces → "$ 1.200.000" → "1200000"
    const numericString = priceValue.replace(/[^0-9]/g, '')
    return parseInt(numericString, 10) || 0
  }

  // Convert COP to USD based on exchange rate
  const convertCopToUsd = (priceCOP) => {
    if (!priceCOP || priceCOP === 0) return 0
    return Math.round(priceCOP / exchangeRate)
  }

  // Generate productID if not present
  const generateProductID = (product) => {
    if (product.productID) return product.productID
    // Generate from title
    const title = product.titulo || product.name || 'product'
    return title
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 50)
  }

  // Migrate a single product
  const migrateProduct = async (legacyProduct, firestoreCategory) => {
    try {
      // Pre-process legacy price (COP string like "$ 1.200.000" → 1200000)
      const parsedPriceCOP = parseLegacyPrice(legacyProduct.precio || legacyProduct.price)
      
      // Convert to USD for the new schema
      // NOTE: The new 'price' field expects USD. Legacy 'precio' was COP.
      const priceUSD = convertCopToUsd(parsedPriceCOP)
      
      // Build payload using existing config function
      const payload = buildProductPayload({
        ...legacyProduct,
        price: priceUSD, // Use converted USD price
        category: firestoreCategory,
      })

      // Ensure required fields
      const finalPayload = {
        ...payload,
        productID: generateProductID(legacyProduct),
        category: firestoreCategory,
        brand: formatBrand(legacyProduct.marca || legacyProduct.brand),
        price: priceUSD, // Ensure price is USD number
      }

      // Write to new hierarchy
      await createNewProduct(finalPayload)
      return { success: true }
    } catch (error) {
      console.error('Migration error for product:', legacyProduct.productID || legacyProduct.titulo, error)
      return { success: false, error: error.message }
    }
  }

  // Migrate all products in a category
  const handleMigrateCategory = async (category) => {
    const { reduxKey, firestoreCategory, label } = category
    const products = getCategoryProducts(reduxKey)

    if (products.length === 0) {
      setResults(prev => ({ ...prev, [reduxKey]: 'empty' }))
      return
    }

    setMigrating(reduxKey)
    setProgress(prev => ({ ...prev, [reduxKey]: { total: products.length, done: 0, errors: 0 } }))
    setErrorDetails(prev => ({ ...prev, [reduxKey]: [] }))

    let done = 0
    let errors = 0
    const errorMessages = []

    for (const product of products) {
      const result = await migrateProduct(product, firestoreCategory)
      
      if (result.success) {
        done++
      } else {
        errors++
        errorMessages.push(`${product.productID || product.titulo}: ${result.error}`)
      }

      setProgress(prev => ({
        ...prev,
        [reduxKey]: { total: products.length, done, errors }
      }))

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    setMigrating(null)
    setResults(prev => ({ ...prev, [reduxKey]: errors === 0 ? 'done' : 'partial' }))
    if (errorMessages.length > 0) {
      setErrorDetails(prev => ({ ...prev, [reduxKey]: errorMessages }))
    }
  }

  // Get status chip for category
  const getStatusChip = (reduxKey) => {
    const result = results[reduxKey]
    if (migrating === reduxKey) {
      return <Chip label="Migrando..." color="info" size="small" icon={<CircularProgress size={14} />} />
    }
    if (result === 'done') {
      return <Chip label="✓ Completado" color="success" size="small" />
    }
    if (result === 'partial') {
      return <Chip label="⚠ Parcial" color="warning" size="small" />
    }
    if (result === 'empty') {
      return <Chip label="Sin productos" color="default" size="small" />
    }
    return <Chip label="Listo" color="primary" variant="outlined" size="small" />
  }

  // Calculate totals
  const totals = useMemo(() => {
    let total = 0
    let migrated = 0
    CATEGORY_MAP.forEach(cat => {
      const products = getCategoryProducts(cat.reduxKey)
      total += products.length
      const prog = progress[cat.reduxKey]
      if (prog) {
        migrated += prog.done
      }
    })
    return { total, migrated }
  }, [CATEGORY_MAP, shopState, progress])

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          🔄 Migración de Productos Legacy
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          Esta herramienta migra productos de la colección <code>productos</code> (esquema español) 
          a la nueva jerarquía <code>products/{'{category}'}/brands/{'{brand}'}/items</code> (esquema inglés).
        </Alert>

        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            Total productos en Redux: <strong>{totals.total}</strong> | 
            Migrados: <strong>{totals.migrated}</strong>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>Tasa de Cambio (COP/USD):</Typography>
            <input 
              type="number" 
              value={exchangeRate} 
              onChange={(e) => setExchangeRate(Number(e.target.value))}
              style={{ width: 80, padding: 4 }}
            />
          </Box>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell><strong>Categoría</strong></TableCell>
                <TableCell align="center"><strong>Productos</strong></TableCell>
                <TableCell align="center"><strong>Estado</strong></TableCell>
                <TableCell align="center"><strong>Progreso</strong></TableCell>
                <TableCell align="center"><strong>Acción</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CATEGORY_MAP.map((cat) => {
                const products = getCategoryProducts(cat.reduxKey)
                const prog = progress[cat.reduxKey]
                const isActive = migrating === cat.reduxKey

                return (
                  <TableRow key={cat.reduxKey} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                    <TableCell>{cat.label}</TableCell>
                    <TableCell align="center">{products.length}</TableCell>
                    <TableCell align="center">{getStatusChip(cat.reduxKey)}</TableCell>
                    <TableCell align="center" sx={{ minWidth: 150 }}>
                      {prog && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={(prog.done / prog.total) * 100} 
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                            color={prog.errors > 0 ? 'warning' : 'success'}
                          />
                          <Typography variant="caption">
                            {prog.done}/{prog.total}
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleMigrateCategory(cat)}
                        disabled={migrating !== null || products.length === 0}
                      >
                        Migrar
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Error Details */}
        {Object.entries(errorDetails).map(([key, errors]) => (
          errors.length > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }} key={key}>
              <Typography variant="subtitle2">Errores en {key}:</Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {errors.slice(0, 5).map((err, i) => (
                  <li key={i}><Typography variant="caption">{err}</Typography></li>
                ))}
                {errors.length > 5 && <li><Typography variant="caption">...y {errors.length - 5} más</Typography></li>}
              </ul>
            </Alert>
          )
        ))}

      </CardContent>
    </Card>
  )
}

export default MigrationTool
