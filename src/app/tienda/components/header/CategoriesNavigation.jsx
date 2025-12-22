'use client'
import React, { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useRouter, usePathname } from 'next/navigation'
import { routes } from './headerRoutes'

const styles = {
  secondaryBar: {
    zIndex: 1 // Ver listado carrito de compras
  },
  blueLink: {
    textDecoration: 'none',
    color: '#00aCe4'
  }
}

const CategoriesNavigation = () => {
  const navigate = useRouter()
  const pathname = usePathname()
  const activeTab = pathname.split('/').reverse()[0]
  const [value, setValue] = useState(0)

  useEffect(() => {
    // console.log('pathname', activeTab)
    // Refactored switch to use routes lookup if possible, but keeping logic close to original behavior
    // attempting to match slug from pathname
    
    // Fallback/Legacy logic mapping
    switch (activeTab) {
      case 'Kits drones': // Matches "Kit's Drones"? Unlikely to be in URL, but keeping for safety if activeTab isn't what we look think
      case 'kit-drones': // Likely URL slug
        setValue(0)
        break
      case 'drones HD':
      case 'drones-fpv-hd':
        setValue(1)
        break
      case 'drones RC':
      case 'drones':
        setValue(2)
        break
      case 'googles':
        setValue(3)
        break
      case 'radio-control':
      case 'Radio Control':
        setValue(4)
        break
      case 'trasmisor-receptor':
        setValue(5)
        break
      case 'digital-vtx':
        setValue(6)
        break
      case 'accesorios':
        setValue(7)
        break
      case 'software':
        setValue(8)
        break
      case 'escuela':
        setValue(9)
        break
       default:
           // Try to find by direct slug match if switch failed
           {
               const found = routes.find(r => r.slug === activeTab)
               if(found) setValue(found.value)
           }
           break
    }
  }, [activeTab])

  const handleChange = (event, newValue) => {
    setValue(newValue)
    const route = routes.find(r => r.value === newValue)
    if (route) {
        navigate.push(route.href)
    }
  }

  return (
    <AppBar
        component="div"
        style={styles.secondaryBar}
        sx={{ zIndex: 0 }}
        color="primary"
        position="static"
        elevation={0}
      >
        <Toolbar className="p-0">
          <Tabs
            onChange={handleChange}
            value={value}
            textColor="inherit"
          >
            {routes.map(({ label, value, href }) => (
              <Tab
                key={value}
                textColor="inherit"
                label={label}
                value={value}
                sx={{
                  textDecoration: 'none',
                  color: '#00aCe4',
                  '&:hover': {
                    color: '#fff',
                    textDecoration: 'underline'
                  }
                }}
              />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>
  )
}

export default CategoriesNavigation
