'use client'
import React from 'react'
import PropTypes from 'prop-types'
import withRoot from '@/modules/withRoot'
import Box from '@mui/material/Box'
import HeaderLogo from './header/HeaderLogo'
import StoreBanner from './header/StoreBanner'
import CategoriesNavigation from './header/CategoriesNavigation'

const Header = (props) => {
  // const { onDrawerToggle } = props // Drawer not currently used in new design?

  return (
    <Box
      component="header"
      sx={{
        position: 'relative',
        zIndex: 100,
        boxShadow: '0 4px 18px -2px rgba(0, 0, 0, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.08)'
      }}
    >
      <HeaderLogo />
      <StoreBanner />
      <CategoriesNavigation />
    </Box>
  )
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired
}

export default withRoot(Header)
