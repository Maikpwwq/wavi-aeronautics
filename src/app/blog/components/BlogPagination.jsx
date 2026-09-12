'use client'

import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Box, ButtonBase } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'

export const DOTS = '...'

/**
 * Generate pagination range array with sibling count and ellipsis
 */
export function getPaginationRange(currentPage, totalPages, siblingCount = 1) {
  // Total page numbers to display: first + last + current + 2*siblings + 2*dots = 2*siblings + 5
  const totalNumbers = siblingCount * 2 + 5

  // Case 1: If page count is less than the page numbers we want to show
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

  const shouldShowLeftDots = leftSiblingIndex > 2
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2

  const firstPageIndex = 1
  const lastPageIndex = totalPages

  // Case 2: No left dots to show, but right dots to show
  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
    return [...leftRange, DOTS, totalPages]
  }

  // Case 3: No right dots to show, but left dots to show
  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    )
    return [firstPageIndex, DOTS, ...rightRange]
  }

  // Case 4: Both left and right dots to show
  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    )
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
  }

  return []
}

/**
 * BlogPagination
 * High-performance, accessible pagination component with dynamic range calculation,
 * responsive pills, and electric cyan active glow.
 */
export default function BlogPagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1
}) {
  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount]
  )

  if (totalPages <= 1 || paginationRange.length === 0) {
    return null
  }

  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= totalPages

  return (
    <Box
      component="nav"
      aria-label="Paginación de artículos del blog"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 0.75, sm: 1.25 },
        mt: { xs: 6, md: 8 },
        mb: 2,
        flexWrap: 'wrap'
      }}
    >
      {/* Previous Page Button */}
      <ButtonBase
        component="button"
        type="button"
        onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        aria-label="Página anterior"
        sx={{
          minWidth: 42,
          height: 42,
          px: 1.5,
          borderRadius: 2.5,
          bgcolor: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: isFirstPage ? 'rgba(255, 255, 255, 0.25)' : '#ffffff',
          cursor: isFirstPage ? 'not-allowed' : 'pointer',
          opacity: isFirstPage ? 0.4 : 1,
          transition: 'all 0.2s ease',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          fontSize: '0.875rem',
          fontWeight: 600,
          '&:hover': !isFirstPage
            ? {
                borderColor: '#00F0FF',
                color: '#00F0FF',
                bgcolor: 'rgba(0, 240, 255, 0.08)',
                boxShadow: '0 0 12px rgba(0, 240, 255, 0.2)'
              }
            : {},
          '&:focus-visible': {
            outline: '2px solid #00F0FF',
            outlineOffset: 2
          }
        }}
      >
        <ChevronLeft sx={{ fontSize: '1.25rem' }} />
        <Box
          component="span"
          sx={{ display: { xs: 'none', sm: 'inline' } }}
        >
          Anterior
        </Box>
      </ButtonBase>

      {/* Page Numbers & Ellipses */}
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <Box
              key={`dots-${index}`}
              component="span"
              sx={{
                width: 32,
                height: 42,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.4)',
                fontWeight: 700,
                letterSpacing: '0.15em',
                userSelect: 'none'
              }}
            >
              &#8230;
            </Box>
          )
        }

        const isActive = pageNumber === currentPage

        return (
          <ButtonBase
            key={pageNumber}
            component="button"
            type="button"
            onClick={() => onPageChange(pageNumber)}
            aria-label={`Ir a la página ${pageNumber}`}
            aria-current={isActive ? 'page' : undefined}
            sx={{
              width: 42,
              height: 42,
              minWidth: 42,
              borderRadius: 2.5,
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.92rem',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...(isActive
                ? {
                    background: 'linear-gradient(135deg, #00F0FF 0%, #0072ff 100%)',
                    color: '#ffffff',
                    border: '1px solid #00F0FF',
                    boxShadow: '0 0 18px rgba(0, 240, 255, 0.45)',
                    transform: 'scale(1.05)'
                  }
                : {
                    bgcolor: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      borderColor: '#00F0FF',
                      color: '#00F0FF',
                      bgcolor: 'rgba(0, 240, 255, 0.08)',
                      boxShadow: '0 0 10px rgba(0, 240, 255, 0.15)'
                    }
                  }),
              '&:focus-visible': {
                outline: '2px solid #00F0FF',
                outlineOffset: 2
              }
            }}
          >
            {pageNumber}
          </ButtonBase>
        )
      })}

      {/* Next Page Button */}
      <ButtonBase
        component="button"
        type="button"
        onClick={() => !isLastPage && onPageChange(currentPage + 1)}
        disabled={isLastPage}
        aria-label="Página siguiente"
        sx={{
          minWidth: 42,
          height: 42,
          px: 1.5,
          borderRadius: 2.5,
          bgcolor: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: isLastPage ? 'rgba(255, 255, 255, 0.25)' : '#ffffff',
          cursor: isLastPage ? 'not-allowed' : 'pointer',
          opacity: isLastPage ? 0.4 : 1,
          transition: 'all 0.2s ease',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          fontSize: '0.875rem',
          fontWeight: 600,
          '&:hover': !isLastPage
            ? {
                borderColor: '#00F0FF',
                color: '#00F0FF',
                bgcolor: 'rgba(0, 240, 255, 0.08)',
                boxShadow: '0 0 12px rgba(0, 240, 255, 0.2)'
              }
            : {},
          '&:focus-visible': {
            outline: '2px solid #00F0FF',
            outlineOffset: 2
          }
        }}
      >
        <Box
          component="span"
          sx={{ display: { xs: 'none', sm: 'inline' } }}
        >
          Siguiente
        </Box>
        <ChevronRight sx={{ fontSize: '1.25rem' }} />
      </ButtonBase>
    </Box>
  )
}

BlogPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  siblingCount: PropTypes.number
}
