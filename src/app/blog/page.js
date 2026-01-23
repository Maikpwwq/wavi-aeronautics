'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Skeleton
} from '@mui/material'
import { AccessTime, ArrowForward } from '@mui/icons-material'
import AppFooter from '@/modules/views/AppFooter'
import AppAppBar from '@/modules/views/AppAppBar'
import { blogPosts } from './blogPosts'

// ============================================================================
// STYLES
// ============================================================================
const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1a2744 0%, #2d3e5f 100%)',
    color: 'white',
    py: { xs: 6, md: 10 },
    mb: 6
  },
  heroTitle: {
    fontWeight: 800,
    mb: 2
  },
  heroSubtitle: {
    opacity: 0.9,
    maxWidth: 600,
    mx: 'auto'
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    borderRadius: 3,
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
    }
  },
  cardMedia: {
    height: 200,
    background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    p: 3
  },
  category: {
    mb: 1.5,
    fontSize: '0.75rem',
    fontWeight: 600
  },
  title: {
    fontWeight: 700,
    mb: 2,
    lineHeight: 1.3,
    color: '#1a2744'
  },
  excerpt: {
    color: 'text.secondary',
    mb: 2,
    flexGrow: 1,
    lineHeight: 1.6
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    color: 'text.disabled',
    fontSize: '0.85rem',
    mt: 'auto'
  },
  readMore: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    color: '#1976d2',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'gap 0.2s ease',
    '&:hover': {
      gap: 1
    }
  }
}

// ============================================================================
// COMPONENTS
// ============================================================================

function BlogCard({ post }) {
  return (
    <Card sx={styles.card} elevation={0} variant="outlined">
      <Box sx={styles.cardMedia}>
        <Typography variant="h3" sx={{ color: 'white', opacity: 0.3, fontWeight: 800 }}>
          FPV
        </Typography>
      </Box>
      <CardContent sx={styles.cardContent}>
        <Chip
          label={post.category}
          size="small"
          color="primary"
          sx={styles.category}
        />
        <Typography variant="h6" sx={styles.title}>
          {post.title}
        </Typography>
        <Typography variant="body2" sx={styles.excerpt}>
          {post.excerpt}
        </Typography>
        <Box sx={styles.meta}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime fontSize="small" />
            {post.readTime}
          </Box>
          <Typography variant="body2">
            {new Date(post.date).toLocaleDateString('es-CO', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Link href={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
            <Box sx={styles.readMore}>
              Leer artículo <ArrowForward fontSize="small" />
            </Box>
          </Link>
        </Box>
      </CardContent>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <Grid container spacing={4}>
      {[1, 2, 3].map((i) => (
        <Grid item xs={12} md={4} key={i}>
          <Card sx={{ borderRadius: 3 }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton width="30%" height={24} />
              <Skeleton width="80%" height={32} sx={{ my: 1 }} />
              <Skeleton width="100%" />
              <Skeleton width="60%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function BlogPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fcfcfc' }}>
      <Suspense fallback={<Box sx={{ height: 64 }} />}>
        <AppAppBar />
      </Suspense>

      {/* Hero Section */}
      <Box sx={styles.hero}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={styles.heroTitle}
          >
            Blog FPV
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={styles.heroSubtitle}
          >
            Guías, tutoriales y noticias del mundo de los drones FPV
          </Typography>
        </Container>
      </Box>

      {/* Posts Grid */}
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Suspense fallback={<LoadingSkeleton />}>
          <Grid container spacing={4}>
            {blogPosts.map((post) => (
              <Grid item xs={12} md={6} lg={4} key={post.id}>
                <BlogCard post={post} />
              </Grid>
            ))}
          </Grid>
        </Suspense>

        {/* Empty State */}
        {blogPosts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h5" color="text.secondary">
              Próximamente más contenido
            </Typography>
          </Box>
        )}
      </Container>

      <AppFooter />
    </Box>
  )
}
