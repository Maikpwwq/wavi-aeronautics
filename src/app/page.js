'use client'
// import Image from 'next/image'
// import styles from "./page.module.css";
import withRoot from '@/modules/withRoot'
// --- Post bootstrap -----
import React from 'react'
import ProductCategories from '@/modules/views/ProductCategories'
import ProductSmokingHero from '@/modules/views/ProductSmokingHero'
import AppFooter from '@/modules/views/AppFooter'
import ProductHero from '@/modules/views/ProductHero'
import ProductValues from '@/modules/views/ProductValues'
import ProductHowItWorks from '@/modules/views/ProductHowItWorks'
import ProductCTA from '@/modules/views/ProductCTA'
import ProductMarcas from '@/modules/views/ProductMarcas'
import AppAppBar from '@/modules/views/AppAppBar'

import NuevosProductos from '@/app/tienda/components/nuevosProductos'
import RevealOnScroll from '@/modules/components/RevealOnScroll'

// import { inter } from './fonts'

function Home () {
  return (
    <main>
      <AppAppBar />
      <RevealOnScroll>
        <ProductHero />
      </RevealOnScroll>
      <RevealOnScroll delay={200}>
        <ProductValues />
      </RevealOnScroll>
      <RevealOnScroll>
        <ProductCategories />
      </RevealOnScroll>
      <RevealOnScroll>
        <NuevosProductos />
      </RevealOnScroll>
      <RevealOnScroll>
        <ProductHowItWorks />
      </RevealOnScroll>
      <RevealOnScroll>
        <ProductCTA />
      </RevealOnScroll>
      <RevealOnScroll>
        <ProductMarcas />
      </RevealOnScroll>
      <RevealOnScroll>
        <ProductSmokingHero />
      </RevealOnScroll>
      <RevealOnScroll>
        <AppFooter />
      </RevealOnScroll>
    </main>
  )
}

export default withRoot(Home)
