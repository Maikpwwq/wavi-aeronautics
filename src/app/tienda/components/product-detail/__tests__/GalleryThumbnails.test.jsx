import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import GalleryThumbnails from '../GalleryThumbnails'

describe('GalleryThumbnails Component Tests', () => {
  const mockImages = [
    'https://example.com/img1.jpg',
    'https://example.com/img2.jpg',
    'https://example.com/img3.jpg'
  ]

  it('returns null when images array is empty', () => {
    const { container } = render(<GalleryThumbnails images={[]} onSelectImage={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders all visible thumbnails with correct labels', () => {
    render(
      <GalleryThumbnails
        images={mockImages}
        activeImage={0}
        onSelectImage={vi.fn()}
      />
    )

    expect(screen.getByTestId('gallery-thumbnails')).toBeInTheDocument()
    expect(screen.getByTestId('gallery-thumbnail-0')).toBeInTheDocument()
    expect(screen.getByTestId('gallery-thumbnail-1')).toBeInTheDocument()
    expect(screen.getByTestId('gallery-thumbnail-2')).toBeInTheDocument()
  })

  it('calls onSelectImage with thumbnail index when clicked', () => {
    const handleSelect = vi.fn()
    render(
      <GalleryThumbnails
        images={mockImages}
        activeImage={0}
        onSelectImage={handleSelect}
      />
    )

    fireEvent.click(screen.getByTestId('gallery-thumbnail-1'))
    expect(handleSelect).toHaveBeenCalledWith(1)
  })

  it('renders video thumbnail button when videoUrl is provided', () => {
    const handleVideoSelect = vi.fn()
    render(
      <GalleryThumbnails
        images={mockImages}
        activeImage={0}
        onSelectImage={vi.fn()}
        videoUrl="https://youtube.com/watch?v=123"
        onSelectVideo={handleVideoSelect}
      />
    )

    const videoBtn = screen.getByTestId('gallery-thumbnail-video')
    expect(videoBtn).toBeInTheDocument()
    expect(screen.getByText('VIDEO')).toBeInTheDocument()

    fireEvent.click(videoBtn)
    expect(handleVideoSelect).toHaveBeenCalled()
  })

  it('renders +N extra count badge when images exceed maxVisible', () => {
    const manyImages = [
      'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg', 'img7.jpg', 'img8.jpg'
    ]

    render(
      <GalleryThumbnails
        images={manyImages}
        activeImage={0}
        onSelectImage={vi.fn()}
        maxVisible={5}
      />
    )

    expect(screen.getByTestId('thumbnail-extra-count')).toBeInTheDocument()
    expect(screen.getByText('+3')).toBeInTheDocument()
  })
})
