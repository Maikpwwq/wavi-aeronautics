import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import BlogPagination, { getPaginationRange, DOTS } from '../BlogPagination'

describe('getPaginationRange utility tests', () => {
  it('returns full sequence when totalPages <= 7 (total numbers needed)', () => {
    expect(getPaginationRange(1, 5, 1)).toEqual([1, 2, 3, 4, 5])
    expect(getPaginationRange(3, 7, 1)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('shows right dots when on first pages of a large dataset', () => {
    const range = getPaginationRange(1, 10, 1)
    expect(range).toEqual([1, 2, 3, 4, 5, DOTS, 10])
  })

  it('shows left dots when on last pages of a large dataset', () => {
    const range = getPaginationRange(10, 10, 1)
    expect(range).toEqual([1, DOTS, 6, 7, 8, 9, 10])
  })

  it('shows both left and right dots when in middle of large dataset', () => {
    const range = getPaginationRange(5, 10, 1)
    expect(range).toEqual([1, DOTS, 4, 5, 6, DOTS, 10])
  })
})

describe('BlogPagination Component Tests', () => {
  it('does not render anything when totalPages <= 1', () => {
    const { container } = render(
      <BlogPagination
        currentPage={1}
        totalPages={1}
        onPageChange={vi.fn()}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders page pills and previous/next navigation buttons', () => {
    render(
      <BlogPagination
        currentPage={1}
        totalPages={3}
        onPageChange={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /Página anterior/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Página siguiente/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ir a la página 1/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ir a la página 2/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ir a la página 3/i })).toBeInTheDocument()
  })

  it('disables previous button on page 1 and enables next button', () => {
    render(
      <BlogPagination
        currentPage={1}
        totalPages={3}
        onPageChange={vi.fn()}
      />
    )

    const prevBtn = screen.getByRole('button', { name: /Página anterior/i })
    const nextBtn = screen.getByRole('button', { name: /Página siguiente/i })

    expect(prevBtn).toBeDisabled()
    expect(nextBtn).not.toBeDisabled()
  })

  it('disables next button on the last page', () => {
    render(
      <BlogPagination
        currentPage={3}
        totalPages={3}
        onPageChange={vi.fn()}
      />
    )

    const nextBtn = screen.getByRole('button', { name: /Página siguiente/i })
    expect(nextBtn).toBeDisabled()
  })

  it('calls onPageChange with new page number when page button clicked', () => {
    const handlePageChange = vi.fn()
    render(
      <BlogPagination
        currentPage={1}
        totalPages={3}
        onPageChange={handlePageChange}
      />
    )

    const page2Btn = screen.getByRole('button', { name: /Ir a la página 2/i })
    fireEvent.click(page2Btn)

    expect(handlePageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with currentPage + 1 when next button clicked', () => {
    const handlePageChange = vi.fn()
    render(
      <BlogPagination
        currentPage={1}
        totalPages={3}
        onPageChange={handlePageChange}
      />
    )

    const nextBtn = screen.getByRole('button', { name: /Página siguiente/i })
    fireEvent.click(nextBtn)

    expect(handlePageChange).toHaveBeenCalledWith(2)
  })

  it('indicates active page with aria-current="page"', () => {
    render(
      <BlogPagination
        currentPage={2}
        totalPages={3}
        onPageChange={vi.fn()}
      />
    )

    const activeBtn = screen.getByRole('button', { name: /Ir a la página 2/i })
    expect(activeBtn).toHaveAttribute('aria-current', 'page')

    const inactiveBtn = screen.getByRole('button', { name: /Ir a la página 1/i })
    expect(inactiveBtn).not.toHaveAttribute('aria-current')
  })
})
