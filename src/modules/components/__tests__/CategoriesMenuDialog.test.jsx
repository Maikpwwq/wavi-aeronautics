import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CategoriesMenuDialog, { CATEGORY_GROUPS } from '@/modules/components/CategoriesMenuDialog'

describe('CategoriesMenuDialog Component Tests', () => {
  const expectedCategories = [
    { name: "Kits de Drones FPV", href: '/tienda/kit-drones', slug: 'kit-drones' },
    { name: 'Drones RC', href: '/tienda/drones', slug: 'drones' },
    { name: 'Drones FPV HD', href: '/tienda/drones-fpv-hd', slug: 'drones-fpv-hd' },
    { name: 'Goggles FPV', href: '/tienda/googles', slug: 'googles' },
    { name: 'Radio Control', href: '/tienda/radio-control', slug: 'radio-control' },
    { name: 'Digital VTX', href: '/tienda/digital-vtx', slug: 'digital-vtx' },
    { name: 'Transmisor / Receptor', href: '/tienda/trasmisor-receptor', slug: 'trasmisor-receptor' },
    { name: 'Accesorios y Repuestos', href: '/tienda/accesorios', slug: 'accesorios' }
  ]

  it('does not render dialog content when open is false', () => {
    render(<CategoriesMenuDialog open={false} onClose={vi.fn()} />)
    expect(screen.queryByText('Categorías de la Tienda')).not.toBeInTheDocument()
  })

  it('renders dialog header, title, and all 4 thematic groups when open is true', () => {
    render(<CategoriesMenuDialog open={true} onClose={vi.fn()} />)

    expect(screen.getByText('Categorías de la Tienda')).toBeInTheDocument()

    // 4 Thematic groups
    expect(screen.getByText('Drones y Kits')).toBeInTheDocument()
    expect(screen.getByText('Equipo de Vuelo FPV')).toBeInTheDocument()
    expect(screen.getByText('Electrónica y Transmisión')).toBeInTheDocument()
    expect(screen.getByText('Accesorios')).toBeInTheDocument()
  })

  it('renders all 8 expected categories with correct hrefs', () => {
    render(<CategoriesMenuDialog open={true} onClose={vi.fn()} />)

    expectedCategories.forEach((cat) => {
      const link = screen.getByRole('link', { name: new RegExp(cat.name, 'i') })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', cat.href)
    })
  })

  it('triggers onClose when clicking the close button', () => {
    const handleClose = vi.fn()
    render(<CategoriesMenuDialog open={true} onClose={handleClose} />)

    const closeBtn = screen.getByLabelText('Cerrar menú de categorías')
    expect(closeBtn).toBeInTheDocument()
    fireEvent.click(closeBtn)

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('triggers onClose when clicking any category link', () => {
    const handleClose = vi.fn()
    render(<CategoriesMenuDialog open={true} onClose={handleClose} />)

    const firstCategoryLink = screen.getByRole('link', { name: new RegExp(expectedCategories[0].name, 'i') })
    fireEvent.click(firstCategoryLink)

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('contains exactly 8 unique category items defined across all groups', () => {
    const totalCategories = CATEGORY_GROUPS.reduce((acc, group) => acc.concat(group.categories), [])
    expect(totalCategories).toHaveLength(8)

    const slugs = totalCategories.map((c) => c.slug)
    const expectedSlugs = [
      'kit-drones',
      'drones',
      'drones-fpv-hd',
      'googles',
      'radio-control',
      'digital-vtx',
      'trasmisor-receptor',
      'accesorios'
    ]
    expect(slugs.sort()).toEqual(expectedSlugs.sort())
  })
})
