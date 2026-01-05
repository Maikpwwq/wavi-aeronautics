'use client'
import React, { useContext, Suspense } from 'react'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import DeleteIcon from '@mui/icons-material/Delete'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import withRoot from '@/modules/withRoot'
import theme from '../innerTheme'

const styles = (theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  image: {
    width: '100px',
    height: '100px',
    objectFit: 'contain',
    borderRadius: '8px',
    border: '1px solid #eee',
    padding: '4px',
    backgroundColor: '#fff'
  },
  cartItem: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: theme.spacing(2)
    }
  },
  summaryCard: {
    padding: theme.spacing(3),
    position: 'sticky',
    top: theme.spacing(4)
  }
})

function ShowCartPage () {
  const navigate = useRouter()
  const { shoppingCart, updateShowCart, removeFromCart } = useContext(ShowCartContext)
  const cart = shoppingCart?.productos || []
  const classes = styles(theme)

  const handleCheckout = (e) => {
    e.preventDefault()
    sessionStorage.setItem('cartUpdated', 'detalles-envio')
    updateShowCart(false)
    navigate.push('detalles-envio', {})
  }

  const handleDelete = (productID, titulo) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${titulo}" del carrito?`)) {
      removeFromCart(productID)
    }
  }

  return (
    <Box sx={classes.root}>
      <Grid container spacing={3} sx={{ maxWidth: '1200px', margin: '0 auto', px: 2 }}>
        <Grid item xs={12}>
           <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
             <ShoppingCartIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 2, color: 'primary.main' }} />
             Tu Carrito de Compras
           </Typography>
        </Grid>

        <Suspense fallback={
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        }>
          {cart.length > 0 ? (
            <>
              {/* Product List Column */}
              <Grid item xs={12} md={8}>
                {cart.map(({ titulo, precio, imagenes, productID, categoria, marca, cantidad }, index) => (
                  <Paper key={index} elevation={2} sx={classes.cartItem}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Link
                        href={{
                          pathname: 'producto',
                          query: `id=${productID}&category=${categoria}&marca=${marca}`
                        }}
                      >
                         <Box 
                           component="img"
                           src={imagenes?.[0]}
                           alt={titulo}
                           sx={classes.image}
                         />
                      </Link>
                      <Box sx={{ flexGrow: 1 }}>
                        <Link
                          href={{
                            pathname: 'producto',
                            query: `id=${productID}&category=${categoria}&marca=${marca}`
                          }}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2, mb: 0.5 }}>
                            {titulo}
                          </Typography>
                        </Link>
                        <Typography variant="body2" color="text.secondary">
                          Marca: {marca || 'Genérica'} | Categoría: {categoria || 'Varios'}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          Cantidad: <strong>{cantidad || 1}</strong>
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'flex-end', 
                      minWidth: '120px',
                      [theme.breakpoints.down('sm')]: {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%'
                      }
                    }}>
                       <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                         {precio}
                       </Typography>
                       <IconButton 
                         color="error" 
                         onClick={() => handleDelete(productID, titulo)}
                         sx={{ mt: 1 }}
                         aria-label="eliminar del carrito"
                       >
                         <DeleteIcon />
                       </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Grid>

              {/* Order Summary Column */}
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={classes.summaryCard}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Resumen de Orden
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Cantidad de artículos:</Typography>
                    <Typography variant="body1" fontWeight="bold">{shoppingCart.items}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                       {shoppingCart.suma ? `$ ${shoppingCart.suma.toLocaleString('es-CO')}` : '$ 0'}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handleCheckout}
                    sx={{ py: 1.5, fontSize: '1.1rem' }}
                  >
                    Finalizar Compra
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => navigate.push('/tienda/kit-drones')}
                  >
                    Seguir comprando
                  </Button>
                </Paper>
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <Paper elevation={1} sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                <Typography variant="h5" gutterBottom color="text.secondary">
                  Tu carrito está vacío
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                  ¡Explora nuestros productos y encuentra lo que necesitas!
                </Typography>
                <Button 
                   variant="contained" 
                   color="primary" 
                   size="large"
                   onClick={() => navigate.push('/')}
                >
                   Ir a la Tienda
                </Button>
              </Paper>
            </Grid>
          )}
        </Suspense>
      </Grid>
    </Box>
  )
}

export default withRoot(ShowCartPage)
