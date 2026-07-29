'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import ClickAwayListener from '@mui/material/ClickAwayListener'

import { searchProducts } from '@/services/FirebaseSearchProducts'

export const SearchBar = () => {
  const router = useRouter()
  const shopState = useSelector((store) => store?.shop)

  const [queryText, setQueryText] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const searchContainerRef = useRef(null)

  // Flatten pre-loaded shop products for instant client-side fallback
  const localProductsPool = React.useMemo(() => {
    if (!shopState) return []
    return [
      ...(shopState.dronesKit || []),
      ...(shopState.dronesHD || []),
      ...(shopState.dronesRC || []),
      ...(shopState.googles || []),
      ...(shopState.radioControl || []),
      ...(shopState.baterias || []),
      ...(shopState.receptors || []),
      ...(shopState.transmisors || []),
      ...(shopState.digitalVTX || []),
    ]
  }, [shopState])

  // Debounced search logic (300ms)
  useEffect(() => {
    if (!queryText.trim()) {
      setResults([])
      setLoading(false)
      setOpen(false)
      return
    }

    setLoading(true)
    const handler = setTimeout(async () => {
      try {
        const found = await searchProducts(queryText, localProductsPool)
        setResults(found)
        setOpen(true)
      } catch (err) {
        console.error('Search error:', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(handler)
  }, [queryText, localProductsPool])

  const handleClear = () => {
    setQueryText('')
    setResults([])
    setOpen(false)
  }

  const handleSubmitSearch = (e) => {
    if (e) e.preventDefault()
    if (!queryText.trim()) return

    setOpen(false)
    router.push(`/tienda/buscar?q=${encodeURIComponent(queryText.trim())}`)
  }

  const handleSelectProduct = (product) => {
    setOpen(false)
    const category = product.category || 'tienda'
    const brand = product.brand || 'Aeronautics'
    const id = product.productID || product.id || ''

    router.push(
      `/tienda/producto?id=${encodeURIComponent(id)}&category=${encodeURIComponent(
        category
      )}&marca=${encodeURIComponent(brand)}`
    )
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.key === 'Enter') {
      handleSubmitSearch(e)
    }
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box
        ref={searchContainerRef}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: { xs: '100%', sm: 500, md: 900, lg: 950 },
          mx: 'auto',
        }}
      >
        {/* Search Input Box */}
        <Paper
          component="form"
          onSubmit={handleSubmitSearch}
          elevation={0}
          sx={{
            p: '2px 8px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            borderRadius: 3,
            bgcolor: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.25s ease',
            '&:hover, &:focus-within': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              borderColor: '#00aCe4',
              boxShadow: '0 0 12px rgba(0, 172, 228, 0.3)',
            },
          }}
        >
          <IconButton
            type="submit"
            sx={{ p: '6px', color: '#00aCe4' }}
            aria-label="Buscar productos"
          >
            <SearchIcon />
          </IconButton>

          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              color: '#ffffff',
              fontSize: '0.925rem',
              '& input::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
                opacity: 1,
              },
            }}
            placeholder="Buscar drones, gafas, controles, repuestos..."
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setOpen(true)
            }}
            onKeyDown={handleKeyDown}
          />

          {loading ? (
            <CircularProgress size={20} sx={{ color: '#00aCe4', mr: 1 }} />
          ) : queryText ? (
            <IconButton
              size="small"
              onClick={handleClear}
              sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 0.5 }}
              aria-label="Limpiar búsqueda"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ) : null}
        </Paper>

        {/* Floating Autocomplete Dropdown Preview */}
        {open && queryText.trim() && (
          <Paper
            elevation={8}
            sx={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              zIndex: 1400,
              maxHeight: 400,
              overflowY: 'auto',
              borderRadius: 3,
              bgcolor: '#1a1f29',
              border: '1px solid rgba(0, 172, 228, 0.3)',
              boxShadow: '0 16px 32px rgba(0,0,0,0.5)',
            }}
          >
            {results.length > 0 ? (
              <List disablePadding>
                {results.slice(0, 6).map((product, index) => (
                  <ListItem
                    key={product.productID || index}
                    button
                    onClick={() => handleSelectProduct(product)}
                    sx={{
                      py: 1.25,
                      px: 2,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'bgcolor 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(0, 172, 228, 0.15)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        src={product.firstImage}
                        sx={{
                          width: 44,
                          height: 44,
                          bgcolor: '#ffffff',
                          p: 0.5,
                          borderRadius: 2,
                        }}
                      >
                        <FlightTakeoffIcon sx={{ color: '#00aCe4' }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: '#ffffff',
                            fontWeight: 600,
                            lineHeight: 1.2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {product.name}
                        </Typography>
                      }
                      secondary={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: '#00aCe4', fontWeight: 700 }}
                          >
                            {product.displayPrice}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              textTransform: 'uppercase',
                              fontSize: '0.7rem',
                            }}
                          >
                            • {product.brand}
                          </Typography>
                          {product.isAgotado && (
                            <Chip
                              label="Agotado"
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                bgcolor: 'rgba(211, 47, 47, 0.2)',
                                color: '#f44336',
                                border: '1px solid #d32f2f',
                                fontWeight: 'bold',
                              }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}

                {/* View All Results Button */}
                <ListItem
                  button
                  onClick={handleSubmitSearch}
                  sx={{
                    py: 1.5,
                    justifyContent: 'center',
                    bgcolor: 'rgba(0, 172, 228, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 172, 228, 0.25)',
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#00aCe4',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    Ver los {results.length} resultados de &quot;{queryText}&quot; →
                  </Typography>
                </ListItem>
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  No se encontraron productos para &quot;{queryText}&quot;
                </Typography>
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  )
}

export default SearchBar
