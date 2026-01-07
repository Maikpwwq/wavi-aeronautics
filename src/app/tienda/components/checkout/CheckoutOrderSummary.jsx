import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import PersonIcon from '@mui/icons-material/Person'
import HomeIcon from '@mui/icons-material/Home'
import DeleteIcon from '@mui/icons-material/Delete'
import ProductLink from '../ProductLink'

const CheckoutOrderSummary = ({ shoppingCart, productsCart, userInfo, shippingInfo, removeFromCart }) => {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold', letterSpacing: 1 }}>
           Resumen de la orden
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={4}>
           <Grid item xs={12} sm={6} sx={{ textAlign: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'primary.main' }}>
                 <PersonIcon sx={{ mr: 1 }} />
                 <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    CLIENTE
                 </Typography>
              </Box>
              <Typography variant="body1" gutterBottom>
                 <strong>Nombre:</strong> {userInfo.userName || 'N/A'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                 <strong>Email:</strong> {userInfo.userMail || 'N/A'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                 <strong>Teléfono:</strong> {userInfo.userPhone || 'N/A'}
              </Typography>
           </Grid>
           <Grid item xs={12} sm={6} sx={{ textAlign: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'secondary.main' }}>
                 <HomeIcon sx={{ mr: 1 }} />
                 <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    ENVÍO
                 </Typography>
              </Box>
              <Typography variant="body1" gutterBottom>
                 <strong>Dirección:</strong> {shippingInfo.shippingDirection || 'N/A'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                 <strong>Ciudad:</strong> {shippingInfo.shippingCiudad || 'N/A'} {shippingInfo.shippingBarrio ? `(${shippingInfo.shippingBarrio})` : ''}
              </Typography>
              <Typography variant="body1" gutterBottom>
                 <strong>C. Postal:</strong> {shippingInfo.shippingPostalCode || 'N/A'}
              </Typography>
           </Grid>
        </Grid>
      </Paper>
      <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
        Resumen productos:
      </Typography>
      <Box sx={{ mt: 3, mb: 3 }}>
        {Array.isArray(productsCart) && productsCart.length > 0 ? (
          productsCart.map((producto, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px solid #e0e0e0',
                py: 2
              }}
            >

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                 <ProductLink product={producto}>
                   <Box
                      component="img"
                      src={producto.imagenes?.[0]}
                      alt={producto.titulo}
                      sx={{
                        width: 60,
                        height: 60,
                        objectFit: 'contain',
                        borderRadius: 1,
                        backgroundColor: '#fff',
                        p: 0.5,
                        border: '1px solid #eee',
                        cursor: 'pointer'
                      }}
                    />
                 </ProductLink>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                      {producto.titulo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cantidad: {producto.cantidad || 1}
                    </Typography>
                  </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>
                  {producto.precio}
                </Typography>
                <IconButton 
                  color="error" 
                  onClick={() => {
                    if (window.confirm(`¿Estás seguro de que deseas eliminar "${producto.titulo}" de la orden?`)) {
                      removeFromCart(producto.productID)
                    }
                  }}
                  aria-label="eliminar"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No hay productos en el carrito. Por favor, agrega productos antes de continuar.
          </Typography>
        )}
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid #333', pt: 2 }}>
           <Typography variant="h6">
              Total: {shoppingCart.suma ? `$ ${shoppingCart.suma.toLocaleString('es-CO')}` : 'Calculating...'}
           </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default CheckoutOrderSummary
