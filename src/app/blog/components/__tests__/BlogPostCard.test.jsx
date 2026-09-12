import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BlogPostCard from '../BlogPostCard'

describe('BlogPostCard Component Tests', () => {
  const mockPost = {
    id: 'tuning-pid-betaflight',
    title: 'Sintonización PID y Filtros en Betaflight 4.5',
    excerpt: 'Domina los algoritmos de control de vuelo y elimina el propwash.',
    image: '/images/blog/tuning.jpg',
    category: 'Sintonización',
    date: '2024-03-01',
    readTime: '10 min',
    author: 'Michael Arias'
  }

  it('renders post title, excerpt, and category badge correctly', () => {
    render(<BlogPostCard post={mockPost} />)

    expect(screen.getByText('Sintonización PID y Filtros en Betaflight 4.5')).toBeInTheDocument()
    expect(screen.getByText(/Domina los algoritmos de control/i)).toBeInTheDocument()
    expect(screen.getByText('Sintonización')).toBeInTheDocument()
  })

  it('renders author, reading time and formatted date', () => {
    render(<BlogPostCard post={mockPost} />)

    expect(screen.getByText('Michael Arias')).toBeInTheDocument()
    expect(screen.getByText('10 min')).toBeInTheDocument()
    // In es-CO locale, '2024-03-01' formats to '1 mar 2024' or '1 de mar. de 2024'
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it('contains links to the individual article page', () => {
    render(<BlogPostCard post={mockPost} />)

    const links = screen.getAllByRole('link')
    expect(links.some((l) => l.getAttribute('href') === '/blog/tuning-pid-betaflight')).toBe(true)
  })

  it('renders fallback tech branding if post has no image', () => {
    const postWithoutImage = { ...mockPost, image: null }
    render(<BlogPostCard post={postWithoutImage} />)

    expect(screen.getByText('FPV TECH')).toBeInTheDocument()
  })
})
