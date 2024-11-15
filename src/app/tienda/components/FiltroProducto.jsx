'use client'
import React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import Typography from '@/modules/components/Typography'
import TextField from '@/modules/components/TextField'

const styles = (theme) => ({
  spacingTexts: {
    margin: `${theme.spacing(2)} ${theme.spacing(0)} !important`
  },
  productsFilters: {
    marginTop: `${theme.spacing(2)} !important`,
    padding: `${theme.spacing(0)} ${theme.spacing(2)} !important`,
    borderRight: 'thin solid #d0d0d0',
    paddingRight: `${theme.spacing(6)} !important`,
    height: 'fit-content',
    [theme.breakpoints.down('sm')]: {
      borderRight: 'none'
    }
  },
  filtrado: {
    marginBottom: `${theme.spacing(3)} !important`,
    width: 150
  }
})

const MARCAS = [
  {
    code: 'default',
    name: 'Seleccionar'
  },
  {
    code: 'Eachine',
    name: 'Eachine'
  },
  {
    code: 'Emaxusa',
    name: 'Emaxusa'
  },
  {
    code: 'Flysky',
    name: 'Flysky'
  },
  {
    code: 'Flywoo',
    name: 'Flywoo'
  },
  {
    code: 'Frsky',
    name: 'Frsky'
  },
  {
    code: 'Geprc',
    name: 'Geprc'
  },
  {
    code: 'Iflightrc',
    name: 'Iflightrc'
  },
  {
    code: 'Radiomaster',
    name: 'Radiomaster'
  },
  {
    code: 'Teamblacksheep',
    name: 'Teamblacksheep'
  },
  {
    code: 'Uruav',
    name: 'Uruav'
  }
]

const PRECIOS = [
  {
    code: 'default',
    name: 'Seleccionar'
  },
  {
    code: 'down900k',
    name: 'Hasta $ 900.000'
  },
  {
    code: '900kto2M',
    name: '$900.000 a $2.000.000'
  },
  {
    code: 'up2M',
    name: 'Más de $2.000.000'
  }
]

const FiltroProducto = (props) => {
  const theme = useTheme()
  const classes = styles(theme)
  return (
        <>
<Box sx={classes.productsFilters}>
          <Typography variant="h5" align="center" sx={classes.spacingTexts}>
            Filtros
          </Typography>
          <Grid item size={{ xs: 6, sm: 8, md: 4 }}>
            <Typography variant="h6" marked="left" gutterBottom>
              Precio
            </Typography>
            <TextField
              select
              SelectProps={{
                native: true
              }}
              sx={classes.filtrado}
            >
              {PRECIOS.map((rangoPrecio) => (
                <option value={rangoPrecio.code} key={rangoPrecio.code}>
                  {rangoPrecio.name}
                </option>
              ))}
            </TextField>
          </Grid>{' '}
          <Grid item size={{ xs: 6, sm: 8, md: 4 }}>
            <Typography variant="h6" marked="left" gutterBottom>
              Marca
            </Typography>
            <TextField
              select
              SelectProps={{
                native: true
              }}
              sx={classes.filtrado}
            >
              {MARCAS.map((marca) => (
                <option value={marca.code} key={marca.code}>
                  {marca.name}
                </option>
              ))}
            </TextField>
          </Grid>
        </Box>
        </>
  )
}

export default FiltroProducto
