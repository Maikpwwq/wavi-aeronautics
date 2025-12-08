'use client'
import React from 'react'
import PropTypes from 'prop-types'
import withRoot from '@/modules/withRoot'
import HeaderLogo from './header/HeaderLogo'
import StoreBanner from './header/StoreBanner'
import CategoriesNavigation from './header/CategoriesNavigation'

const Header = (props) => {
  // const { onDrawerToggle } = props // Drawer not currently used in new design?

  return (
    <React.Fragment>
      <HeaderLogo />
      <StoreBanner />
      <CategoriesNavigation />
    </React.Fragment>
  )
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired
}

export default withRoot(Header)
