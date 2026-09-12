'use client'

import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {
  Card,
  CardContent,
  Box,
  Typography
} from '@mui/material'
import {
  AccessTime,
  CalendarMonth,
  ArrowForward,
  PersonOutline
} from '@mui/icons-material'

/**
 * BlogPostCard
 * Modern, uniform tech media card with locked 16:9 aspect ratio,
 * glassmorphic category badge, hardware-accelerated zoom, and ambient cyan glow.
 */
export default function BlogPostCard({ post }) {
  if (!post) return null

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : ''

  return (
    <Card
      component="article"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          borderColor: 'rgba(0, 240, 255, 0.35)',
          boxShadow: '0 20px 40px rgba(0, 240, 255, 0.09), 0 0 25px rgba(0, 240, 255, 0.05)',
          '& .blog-card-image': {
            transform: 'scale(1.06)'
          },
          '& .blog-card-title': {
            color: '#00F0FF'
          },
          '& .blog-card-arrow': {
            transform: 'translateX(4px)'
          }
        }
      }}
    >
      {/* Media Container with Locked 16:9 Aspect Ratio */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          overflow: 'hidden',
          bgcolor: '#1e293b'
        }}
      >
        {/* Category Pill with Glassmorphism */}
        {post.category && (
          <Box
            sx={{
              position: 'absolute',
              top: 14,
              left: 14,
              zIndex: 2,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              bgcolor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(0, 240, 255, 0.35)',
              color: '#00F0FF',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              px: 1.5,
              py: 0.5,
              borderRadius: '9999px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
            }}
          >
            {post.category}
          </Box>
        )}

        {/* Cover Image or Styled Tech Graphic */}
        {post.image ? (
          <Box
            component="img"
            src={post.image}
            alt={post.title}
            className="blog-card-image"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        ) : (
          <Box
            className="blog-card-image"
            sx={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #0b1d3a 0%, #173059 50%, #00aCe4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                opacity: 0.18,
                fontWeight: 900,
                letterSpacing: '0.15em'
              }}
            >
              FPV TECH
            </Typography>
          </Box>
        )}
      </Box>

      {/* Card Body with Baseline Alignment */}
      <CardContent
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1
        }}
      >
        {/* Title */}
        <Link
          href={`/blog/${post.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Typography
            variant="h6"
            className="blog-card-title"
            sx={{
              color: '#ffffff',
              fontWeight: 700,
              lineHeight: 1.35,
              mb: 1.5,
              fontSize: '1.15rem',
              transition: 'color 0.25s ease',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {post.title}
          </Typography>
        </Link>

        {/* Excerpt */}
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.65)',
            lineHeight: 1.6,
            mb: 3,
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {post.excerpt}
        </Typography>

        {/* Footer Meta */}
        <Box
          sx={{
            mt: 'auto',
            pt: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.8rem',
              flexWrap: 'wrap',
              gap: 1
            }}
          >
            {post.author && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PersonOutline sx={{ fontSize: '0.95rem', color: '#00F0FF' }} />
                <span>{post.author}</span>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
              {formattedDate && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                  <CalendarMonth sx={{ fontSize: '0.85rem' }} />
                  <span>{formattedDate}</span>
                </Box>
              )}
              {post.readTime && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                  <AccessTime sx={{ fontSize: '0.85rem' }} />
                  <span>{post.readTime}</span>
                </Box>
              )}
            </Box>
          </Box>

          {/* Read Article Action */}
          <Link
            href={`/blog/${post.id}`}
            style={{ textDecoration: 'none' }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                color: '#00aCe4',
                fontWeight: 600,
                fontSize: '0.88rem',
                mt: 0.5,
                '&:hover': {
                  color: '#00F0FF'
                }
              }}
            >
              <span>Leer artículo</span>
              <ArrowForward
                className="blog-card-arrow"
                sx={{
                  fontSize: '1rem',
                  transition: 'transform 0.25s ease'
                }}
              />
            </Box>
          </Link>
        </Box>
      </CardContent>
    </Card>
  )
}

BlogPostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string,
    image: PropTypes.string,
    category: PropTypes.string,
    date: PropTypes.string,
    readTime: PropTypes.string,
    author: PropTypes.string
  }).isRequired
}
