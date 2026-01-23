'use client'

import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Breadcrumbs, Link, Typography } from '@mui/material'
import { ArrowBack, ChevronRight } from '@mui/icons-material'
import { BRAND_COLORS } from '../innerTheme'

/**
 * Category slug to display label mapping
 */
const CATEGORY_LABELS = {
  'kit-drones': "Kit's Drones",
  'drones-fpv-hd': 'Drones HD',
  'drones': 'Drones RC',
  'googles': 'Goggles FPV',
  'radio-control': 'Radio Control',
  'trasmisor-receptor': 'Transmisión/Recepción',
  'digital-vtx': 'Digital VTX',
  'accesorios': 'Accesorios',
  'software': 'Software',
  'escuela': 'Escuela'
}

/**
 * Reusable navigation component with back button and breadcrumbs.
 * Can be used across multiple pages in the tienda section.
 * 
 * @param {Object} props
 * @param {Array<{label: string, href: string}>} [props.breadcrumbs] - Custom breadcrumb items (overrides default)
 * @param {string} [props.category] - Category slug (e.g., 'radio-control') to insert between Tienda and currentPage
 * @param {string} props.currentPage - Current page title (shown as last breadcrumb, not clickable)
 * @param {string} [props.backLabel] - Custom label for back button (default: "Volver atrás")
 * @param {string} [props.fallbackPath] - Fallback path if no history (default: "/tienda")
 */

// Styles for breadcrumb links
const styles = {
  container: {
    py: 3, 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'start'
  },
  backButton: {
    textTransform: 'none', 
    color: BRAND_COLORS.text.secondary,
    mb: 1,
    '&:hover': {
      color: BRAND_COLORS.primary,
      bgcolor: 'rgba(25, 118, 210, 0.04)'
    }
  },
  breadcrumbLink: {
    fontSize: '0.875rem',
    color: BRAND_COLORS.text.link + ' !important',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
      textDecoration: 'underline',
      color: BRAND_COLORS.primary,
    },
    '&:active': {
      color: BRAND_COLORS.primaryDark,
    }
  },
  currentPage: {
    fontSize: '0.875rem', 
    fontWeight: 'medium'
  }
}

const PageNavigation = ({ 
  breadcrumbs,
  category,
  currentPage,
  backLabel = 'Volver atrás',
  fallbackPath = '/tienda'
}) => {
  const router = useRouter()

  // Build breadcrumbs dynamically based on category
  const computedBreadcrumbs = useMemo(() => {
    // If custom breadcrumbs provided, use those
    if (breadcrumbs) return breadcrumbs

    // Default breadcrumbs
    const crumbs = [
      { label: 'Inicio', href: '/' },
      { label: 'Tienda', href: '/tienda' }
    ]

    // Add category if provided
    if (category) {
      const categoryLabel = CATEGORY_LABELS[category] || category
      crumbs.push({
        label: categoryLabel,
        href: `/tienda/${category}`
      })
    }

    return crumbs
  }, [breadcrumbs, category])

  const handleGoBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackPath)
    }
  }, [router, fallbackPath])

  return (
    <Box sx={styles.container}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={handleGoBack} 
        sx={styles.backButton}
      >
        {backLabel}
      </Button>
      
      <Breadcrumbs 
        separator={<ChevronRight fontSize="small" />} 
        aria-label="breadcrumb"
      >
        {computedBreadcrumbs.map((crumb, index) => (
          <Link 
            key={index}
            underline="hover" 
            href={crumb.href} 
            sx={styles.breadcrumbLink}
          >
            {crumb.label}
          </Link>
        ))}
        {currentPage && (
          <Typography color="text.primary" sx={styles.currentPage}>
            {currentPage}
          </Typography>
        )}
      </Breadcrumbs>
    </Box>
  )
}

export default PageNavigation

