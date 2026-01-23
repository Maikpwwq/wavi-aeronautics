'use client'

import { Suspense, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
    Box,
    Container,
    Typography,
    Divider,
    Button,
    Paper,
    Chip,
    CircularProgress
} from '@mui/material'
import {
    ArrowBack,
    ArrowForward,
    AccessTime,
    CalendarMonth
} from '@mui/icons-material'
import AppFooter from '@/modules/views/AppFooter'
import AppAppBar from '@/modules/views/AppAppBar'
import { getPostById, getAdjacentPosts } from '../blogPosts'

// ============================================================================
// STYLES
// ============================================================================
const styles = {
    header: {
        background: 'linear-gradient(135deg, #1a2744 0%, #2d3e5f 100%)',
        color: 'white',
        py: { xs: 4, md: 6 }
    },
    backButton: {
        color: 'rgba(255,255,255,0.8)',
        mb: 3,
        '&:hover': {
            color: 'white',
            bgcolor: 'rgba(255,255,255,0.1)'
        }
    },
    category: {
        mb: 2,
        bgcolor: 'rgba(255,255,255,0.2)',
        color: 'white'
    },
    title: {
        fontWeight: 800,
        mb: 3,
        lineHeight: 1.2
    },
    meta: {
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        opacity: 0.9
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 0.5
    },
    article: {
        maxWidth: 800,
        mx: 'auto',
        py: { xs: 4, md: 6 }
    },
    paragraph: {
        fontSize: '1.125rem',
        lineHeight: 1.8,
        color: '#333',
        mb: 3,
        '& a': {
            color: '#1976d2',
            textDecoration: 'none',
            fontWeight: 500,
            '&:hover': {
                textDecoration: 'underline'
            }
        }
    },
    sectionTitle: {
        fontWeight: 700,
        color: '#1a2744',
        mt: 5,
        mb: 3,
        pb: 1,
        borderBottom: '3px solid #00bcd4'
    },
    navigation: {
        mt: 6,
        pt: 4,
        borderTop: '1px solid #e0e0e0'
    },
    navCard: {
        p: 3,
        borderRadius: 2,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'block',
        '&:hover': {
            bgcolor: '#f5f5f5',
            transform: 'translateX(4px)'
        }
    },
    navLabel: {
        fontSize: '0.75rem',
        color: 'text.disabled',
        textTransform: 'uppercase',
        letterSpacing: 1,
        mb: 0.5
    },
    navTitle: {
        fontWeight: 600,
        color: '#1a2744'
    }
}

// ============================================================================
// COMPONENTS
// ============================================================================

function ArticleContent({ content }) {
    return (
        <>
            {content.map((block, index) => {
                if (block.type === 'paragraph') {
                    return (
                        <Typography
                            key={index}
                            sx={styles.paragraph}
                            dangerouslySetInnerHTML={block.isHtml ? { __html: block.text } : undefined}
                        >
                            {!block.isHtml && block.text}
                        </Typography>
                    )
                }

                if (block.type === 'section') {
                    return (
                        <Box key={index}>
                            <Typography variant="h5" sx={styles.sectionTitle}>
                                {block.title}
                            </Typography>
                            {block.paragraphs.map((para, pIndex) => (
                                <Typography
                                    key={pIndex}
                                    sx={styles.paragraph}
                                    dangerouslySetInnerHTML={para.isHtml ? { __html: para.text } : undefined}
                                >
                                    {!para.isHtml && para.text}
                                </Typography>
                            ))}
                        </Box>
                    )
                }

                return null
            })}
        </>
    )
}

function PostNavigation({ prev, next }) {
    return (
        <Box sx={styles.navigation}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                {prev ? (
                    <Link href={`/blog/${prev.id}`} style={{ textDecoration: 'none', flex: 1, minWidth: 200 }}>
                        <Paper variant="outlined" sx={{ ...styles.navCard, '&:hover': { ...styles.navCard['&:hover'], transform: 'translateX(-4px)' } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ArrowBack fontSize="small" color="primary" />
                                <Typography sx={styles.navLabel}>Anterior</Typography>
                            </Box>
                            <Typography sx={styles.navTitle}>{prev.title}</Typography>
                        </Paper>
                    </Link>
                ) : <Box sx={{ flex: 1 }} />}

                {next && (
                    <Link href={`/blog/${next.id}`} style={{ textDecoration: 'none', flex: 1, minWidth: 200 }}>
                        <Paper variant="outlined" sx={{ ...styles.navCard, textAlign: 'right' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                                <Typography sx={styles.navLabel}>Siguiente</Typography>
                                <ArrowForward fontSize="small" color="primary" />
                            </Box>
                            <Typography sx={styles.navTitle}>{next.title}</Typography>
                        </Paper>
                    </Link>
                )}
            </Box>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Link href="/blog" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" size="large">
                        Ver todos los artículos
                    </Button>
                </Link>
            </Box>
        </Box>
    )
}

function NotFound() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fcfcfc' }}>
            <AppAppBar />
            <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Artículo no encontrado
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    El artículo que buscas no existe o ha sido movido.
                </Typography>
                <Link href="/blog" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" startIcon={<ArrowBack />}>
                        Volver al blog
                    </Button>
                </Link>
            </Container>
            <AppFooter />
        </Box>
    )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function BlogPostPage() {
    const params = useParams()
    const postId = params?.id

    const post = useMemo(() => getPostById(postId), [postId])
    const { prev, next } = useMemo(() => getAdjacentPosts(postId), [postId])

    if (!post) {
        return <NotFound />
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fcfcfc' }}>
            <Suspense fallback={<Box sx={{ height: 64 }} />}>
                <AppAppBar />
            </Suspense>

            {/* Header */}
            <Box sx={styles.header}>
                <Container maxWidth="lg">
                    <Link href="/blog" style={{ textDecoration: 'none' }}>
                        <Button startIcon={<ArrowBack />} sx={styles.backButton}>
                            Volver al blog
                        </Button>
                    </Link>

                    <Chip label={post.category} size="small" sx={styles.category} />

                    <Typography variant="h3" sx={styles.title}>
                        {post.title}
                    </Typography>

                    <Box sx={styles.meta}>
                        <Box sx={styles.metaItem}>
                            <CalendarMonth fontSize="small" />
                            <Typography variant="body2">
                                {new Date(post.date).toLocaleDateString('es-CO', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </Typography>
                        </Box>
                        <Box sx={styles.metaItem}>
                            <AccessTime fontSize="small" />
                            <Typography variant="body2">{post.readTime} de lectura</Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Article Content */}
            <Container maxWidth="lg">
                <Box sx={styles.article}>
                    <ArticleContent content={post.content} />
                    <PostNavigation prev={prev} next={next} />
                </Box>
            </Container>

            <AppFooter />
        </Box>
    )
}
