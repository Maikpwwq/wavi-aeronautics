'use client'

import React, { Suspense, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Grid,
  Skeleton,
  Fade
} from '@mui/material'
import AppFooter from '@/modules/views/AppFooter'
import AppAppBar from '@/modules/views/AppAppBar'
import GradientTitle from './components/GradientTitle'
import BlogPostCard from './components/BlogPostCard'
import BlogPagination from './components/BlogPagination'
import { blogPosts } from './blogPosts'

const POSTS_PER_PAGE = 6

/**
 * LoadingSkeleton for Blog Cards
 */
function BlogLoadingSkeleton() {
  return (
    <Grid container spacing={3.5}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Grid key={i} size={{ xs: 12, md: 6, lg: 4 }}>
          <Box
            sx={{
              height: '100%',
              bgcolor: '#0f172a',
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <Skeleton
              variant="rectangular"
              sx={{ width: '100%', aspectRatio: '16/9', bgcolor: '#1e293b' }}
            />
            <Box sx={{ p: 3 }}>
              <Skeleton width="30%" height={24} sx={{ bgcolor: '#334155', mb: 1.5 }} />
              <Skeleton width="90%" height={32} sx={{ bgcolor: '#334155', mb: 1 }} />
              <Skeleton width="100%" height={20} sx={{ bgcolor: '#1e293b' }} />
              <Skeleton width="75%" height={20} sx={{ bgcolor: '#1e293b', mb: 3 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                <Skeleton width="25%" height={20} sx={{ bgcolor: '#1e293b' }} />
                <Skeleton width="35%" height={20} sx={{ bgcolor: '#1e293b' }} />
              </Box>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

/**
 * Inner Blog Content that consumes searchParams
 */
function BlogContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const rawPage = parseInt(searchParams.get('page') || '1', 10)
  const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE) || 1
  const currentPage = isNaN(rawPage) || rawPage < 1 ? 1 : Math.min(rawPage, totalPages)

  // Sliced posts for current page
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const currentPosts = blogPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  const handlePageChange = (newPage) => {
    if (newPage === currentPage) return

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (newPage === 1) {
        params.delete('page')
      } else {
        params.set('page', String(newPage))
      }

      const queryString = params.toString()
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname
      router.push(targetUrl, { scroll: false })
    })

    // Automated smooth scroll to top
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  return (
    <Box sx={{ pb: 10 }}>
      {blogPosts.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 12,
            bgcolor: 'rgba(15, 23, 42, 0.4)',
            borderRadius: 4,
            border: '1px dashed rgba(255, 255, 255, 0.15)'
          }}
        >
          <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
            No hay artículos disponibles
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Pronto publicaremos nuevas guías y tutoriales del mundo FPV.
          </Typography>
        </Box>
      ) : (
        <Fade in={!isPending} timeout={300}>
          <Box>
            <Grid container spacing={3.5}>
              {currentPosts.map((post) => (
                <Grid key={post.id} size={{ xs: 12, md: 6, lg: 4 }}>
                  <BlogPostCard post={post} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination Controls */}
            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              siblingCount={1}
            />
          </Box>
        </Fade>
      )}
    </Box>
  )
}

/**
 * Main Blog Page
 */
export default function BlogPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#080c16',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Suspense fallback={<Box sx={{ height: 64 }} />}>
        <AppAppBar />
      </Suspense>

      {/* Hero Section with Dynamic Gradient Typography */}
      <Box
        component="header"
        sx={{
          position: 'relative',
          pt: { xs: 8, md: 12 },
          pb: { xs: 7, md: 10 },
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.12) 0%, rgba(112, 0, 255, 0.06) 45%, transparent 75%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Eyebrow badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.6,
              mb: 3,
              borderRadius: '9999px',
              bgcolor: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: '#00F0FF',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            <span>Wavi Knowledge Hub</span>
          </Box>

          {/* High-Impact Gradient Title */}
          <GradientTitle
            text="Explora las Fronteras del Vuelo FPV"
            highlight={['Fronteras', 'Vuelo FPV']}
            variant="h2"
            component="h1"
            sx={{
              fontSize: { xs: '2.25rem', sm: '3.25rem', md: '4rem' },
              fontWeight: 900,
              mb: 2.5
            }}
          />

          <Typography
            variant="h6"
            component="p"
            sx={{
              color: 'rgba(255, 255, 255, 0.72)',
              maxWidth: 680,
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.15rem' },
              lineHeight: 1.6,
              fontWeight: 400
            }}
          >
            Guías maestras, análisis de hardware de última generación y tutoriales técnicos
            para pilotos, constructores e innovadores de drones.
          </Typography>
        </Container>
      </Box>

      {/* Main Feed Container */}
      <Container maxWidth="lg" sx={{ mt: { xs: 5, md: 7 }, flexGrow: 1 }}>
        <Suspense fallback={<BlogLoadingSkeleton />}>
          <BlogContent />
        </Suspense>
      </Container>

      <AppFooter />
    </Box>
  )
}
