'use client'

import React, { Suspense, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Avatar,
  Card,
  CardContent,
  Grid,
  Stack,
  Divider,
  Paper
} from '@mui/material'
import {
  ArrowBack,
  ArrowForward,
  AccessTime,
  CalendarMonth,
  PersonOutline,
  ShoppingBag,
  WhatsApp,
  LightbulbOutlined,
  MenuBook,
  FlightTakeoff
} from '@mui/icons-material'
import AppFooter from '@/modules/views/AppFooter'
import AppAppBar from '@/modules/views/AppAppBar'
import { getPostById, getAdjacentPosts } from '@/app/blog/blogPosts'

/**
 * Renders the article body with structured section cards,
 * styled lead paragraphs, and formatted hyperlinks.
 */
function ArticleContent({ content }) {
  if (!content || !Array.isArray(content)) return null

  return (
    <Box sx={{ mt: 1 }}>
      {content.map((block, index) => {
        // Lead or standalone paragraph
        if (block.type === 'paragraph') {
          return (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                mb: 4,
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderLeft: '5px solid #00aCe4',
                borderRadius: '0 16px 16px 0',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)'
              }}
            >
              {block.isHtml ? (
                <Typography
                  sx={{
                    fontSize: { xs: '1.05rem', md: '1.18rem' },
                    lineHeight: 1.85,
                    color: '#1e293b',
                    fontWeight: 500,
                    '& a': {
                      color: '#00aCe4',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: block.text }}
                />
              ) : (
                <Typography
                  sx={{
                    fontSize: { xs: '1.05rem', md: '1.18rem' },
                    lineHeight: 1.85,
                    color: '#1e293b',
                    fontWeight: 500
                  }}
                >
                  {block.text}
                </Typography>
              )}
            </Paper>
          )
        }

        // Structured section block
        if (block.type === 'section') {
          return (
            <Card
              key={index}
              elevation={0}
              sx={{
                mb: 4,
                borderRadius: 3.5,
                border: '1px solid #e2e8f0',
                bgcolor: '#ffffff',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                overflow: 'hidden',
                transition: 'border-color 0.25s ease',
                '&:hover': {
                  borderColor: '#cbd5e1'
                }
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
                {/* Section Title with Index Accent */}
                <Box sx={{ mb: 2.5 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1
                    }}
                  >
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        bgcolor: 'rgba(0, 172, 228, 0.1)',
                        color: '#00aCe4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 800
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: '1.3rem', sm: '1.55rem' },
                        letterSpacing: '-0.02em',
                        color: '#0f172a',
                        lineHeight: 1.3
                      }}
                    >
                      {block.title}
                    </Typography>
                  </Box>

                  {/* Wavi Mini Accent Bar */}
                  <Box
                    sx={{
                      width: 44,
                      height: 3,
                      bgcolor: '#00aCe4',
                      borderRadius: 1.5,
                      ml: 0.5
                    }}
                  />
                </Box>

                {/* Section Paragraphs */}
                <Stack spacing={2.5}>
                  {block.paragraphs.map((para, pIndex) =>
                    para.isHtml ? (
                      <Typography
                        key={pIndex}
                        sx={{
                          fontSize: { xs: '1rem', md: '1.06rem' },
                          lineHeight: 1.85,
                          color: '#334155',
                          '& a': {
                            color: '#0284c7',
                            fontWeight: 600,
                            textDecoration: 'none',
                            borderBottom: '1px dashed #0284c7',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              color: '#00aCe4',
                              borderBottomStyle: 'solid'
                            }
                          }
                        }}
                        dangerouslySetInnerHTML={{ __html: para.text }}
                      />
                    ) : (
                      <Typography
                        key={pIndex}
                        sx={{
                          fontSize: { xs: '1rem', md: '1.06rem' },
                          lineHeight: 1.85,
                          color: '#334155'
                        }}
                      >
                        {para.text}
                      </Typography>
                    )
                  )}
                </Stack>
              </CardContent>
            </Card>
          )
        }

        return null
      })}
    </Box>
  )
}

/**
 * Modern Next/Previous Post Navigation
 */
function PostNavigation({ prev, next }) {
  if (!prev && !next) return null

  return (
    <Box sx={{ mt: 6, mb: 4 }}>
      <Typography
        variant="subtitle2"
        sx={{
          color: '#64748b',
          fontWeight: 700,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          mb: 2.5,
          textAlign: 'center'
        }}
      >
        Continúa leyendo en el Blog
      </Typography>

      <Grid container spacing={3}>
        {/* Previous Post */}
        <Grid size={{ xs: 12, sm: 6 }}>
          {prev ? (
            <Card
              component={Link}
              href={`/blog/${prev.id}`}
              elevation={0}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                p: 3,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                bgcolor: '#ffffff',
                textDecoration: 'none',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: '#00aCe4',
                  boxShadow: '0 12px 28px rgba(0, 172, 228, 0.08)',
                  '& .nav-arrow': {
                    transform: 'translateX(-4px)'
                  },
                  '& .nav-title': {
                    color: '#00aCe4'
                  }
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#64748b',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  mb: 1.2
                }}
              >
                <ArrowBack
                  className="nav-arrow"
                  sx={{
                    fontSize: '0.95rem',
                    color: '#00aCe4',
                    transition: 'transform 0.2s ease'
                  }}
                />
                <span>Artículo Anterior</span>
              </Box>

              <Typography
                variant="subtitle1"
                className="nav-title"
                sx={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#0f172a',
                  lineHeight: 1.4,
                  transition: 'color 0.2s ease',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {prev.title}
              </Typography>
            </Card>
          ) : (
            <Box
              sx={{
                height: '100%',
                p: 3,
                borderRadius: 3,
                border: '1px dashed #e2e8f0',
                bgcolor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                fontSize: '0.85rem'
              }}
            >
              Inicio de las publicaciones
            </Box>
          )}
        </Grid>

        {/* Next Post */}
        <Grid size={{ xs: 12, sm: 6 }}>
          {next ? (
            <Card
              component={Link}
              href={`/blog/${next.id}`}
              elevation={0}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                p: 3,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                bgcolor: '#ffffff',
                textDecoration: 'none',
                textAlign: 'right',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: '#00aCe4',
                  boxShadow: '0 12px 28px rgba(0, 172, 228, 0.08)',
                  '& .nav-arrow': {
                    transform: 'translateX(4px)'
                  },
                  '& .nav-title': {
                    color: '#00aCe4'
                  }
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 1,
                  color: '#64748b',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  mb: 1.2
                }}
              >
                <span>Siguiente Artículo</span>
                <ArrowForward
                  className="nav-arrow"
                  sx={{
                    fontSize: '0.95rem',
                    color: '#00aCe4',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </Box>

              <Typography
                variant="subtitle1"
                className="nav-title"
                sx={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#0f172a',
                  lineHeight: 1.4,
                  transition: 'color 0.2s ease',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {next.title}
              </Typography>
            </Card>
          ) : (
            <Box
              sx={{
                height: '100%',
                p: 3,
                borderRadius: 3,
                border: '1px dashed #e2e8f0',
                bgcolor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                fontSize: '0.85rem'
              }}
            >
              Último artículo publicado
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Button to Return to Full Feed */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          component={Link}
          href="/blog"
          variant="outlined"
          size="medium"
          startIcon={<MenuBook />}
          sx={{
            borderColor: '#cbd5e1',
            color: '#334155',
            fontWeight: 700,
            fontSize: '0.9rem',
            textTransform: 'none',
            py: 1.2,
            px: 3,
            borderRadius: 2.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#00aCe4',
              color: '#00aCe4',
              bgcolor: 'rgba(0, 172, 228, 0.04)'
            }
          }}
        >
          Ver todos los artículos del Blog
        </Button>
      </Box>
    </Box>
  )
}

/**
 * Not Found State View
 */
function NotFoundView() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <AppAppBar isHome />
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <Chip
          label="404"
          size="small"
          sx={{
            fontWeight: 800,
            bgcolor: 'rgba(211, 47, 47, 0.1)',
            color: '#d32f2f',
            mb: 2
          }}
        />
        <Typography
          variant="h3"
          sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5 }}
        >
          Artículo no encontrado
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#64748b', mb: 4, maxWidth: 480, mx: 'auto' }}
        >
          El artículo que estás buscando no existe o fue reubicado en nuestro archivo técnico.
        </Typography>
        <Button
          component={Link}
          href="/blog"
          variant="contained"
          startIcon={<ArrowBack />}
          sx={{
            bgcolor: '#00aCe4',
            fontWeight: 700,
            borderRadius: 2.5,
            py: 1.3,
            px: 3.5,
            textTransform: 'none',
            '&:hover': { bgcolor: '#0284c7' }
          }}
        >
          Regresar al Blog
        </Button>
      </Container>
      <AppFooter />
    </Box>
  )
}

/**
 * Main Article Page Component
 */
export default function BlogPostPage() {
  const params = useParams()
  const postId = params?.id

  const post = useMemo(() => getPostById(postId), [postId])
  const { prev, next } = useMemo(() => getAdjacentPosts(postId), [postId])

  if (!post) {
    return <NotFoundView />
  }

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : ''

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Suspense fallback={<Box sx={{ height: 64 }} />}>
        <AppAppBar isHome />
      </Suspense>

      {/* ================================================================= */}
      {/* EDITORIAL HERO HEADER                                             */}
      {/* ================================================================= */}
      <Box
        component="header"
        sx={{
          background: 'radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.14) 0%, rgba(15, 23, 42, 0.95) 60%, #080c16 100%)',
          color: '#ffffff',
          pt: { xs: 5, md: 8 },
          pb: { xs: 6, md: 9 },
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative'
        }}
      >
        <Container maxWidth="md">
          {/* Back Button */}
          <Button
            component={Link}
            href="/blog"
            startIcon={<ArrowBack />}
            size="small"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'none',
              mb: 3,
              px: 1.5,
              py: 0.6,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: '#00F0FF',
                borderColor: 'rgba(0, 240, 255, 0.4)',
                bgcolor: 'rgba(0, 240, 255, 0.08)'
              }
            }}
          >
            Volver al Blog
          </Button>

          {/* Category Chip */}
          {post.category && (
            <Box sx={{ mb: 2 }}>
              <Chip
                label={post.category}
                size="small"
                sx={{
                  bgcolor: 'rgba(0, 240, 255, 0.12)',
                  border: '1px solid rgba(0, 240, 255, 0.35)',
                  color: '#00F0FF',
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  px: 1
                }}
              />
            </Box>
          )}

          {/* Article Title */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.85rem', sm: '2.5rem', md: '3.1rem' },
              letterSpacing: '-0.025em',
              lineHeight: 1.22,
              color: '#ffffff',
              mb: 2.5
            }}
          >
            {post.title}
          </Typography>

          {/* Wavi Accent Bar */}
          <Box
            sx={{
              width: 56,
              height: 4,
              bgcolor: '#00aCe4',
              borderRadius: 2,
              mb: 3.5
            }}
          />

          {/* Meta and Author Information */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2.5,
              pt: 2.5,
              borderTop: '1px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            {/* Author */}
            {post.author && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  src={post.avatar}
                  alt={post.author}
                  sx={{
                    width: 44,
                    height: 44,
                    border: '2px solid rgba(0, 240, 255, 0.4)',
                    bgcolor: '#00aCe4',
                    fontWeight: 700
                  }}
                >
                  {post.author.charAt(0)}
                </Avatar>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}
                  >
                    Escrito por
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: '#ffffff', fontSize: '0.92rem' }}
                  >
                    {post.author}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Date & Read Time */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2.5,
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.84rem'
              }}
            >
              {formattedDate && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <CalendarMonth sx={{ fontSize: '1rem', color: '#00aCe4' }} />
                  <span>{formattedDate}</span>
                </Box>
              )}
              {post.readTime && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <AccessTime sx={{ fontSize: '1rem', color: '#00aCe4' }} />
                  <span>{post.readTime} de lectura</span>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ================================================================= */}
      {/* MAIN ARTICLE BODY & SECTIONS                                      */}
      {/* ================================================================= */}
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 }, flexGrow: 1 }}>
        {/* Cover image if available */}
        {post.image && (
          <Box
            sx={{
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: 4,
              overflow: 'hidden',
              mb: 5,
              border: '1px solid #e2e8f0',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)'
            }}
          >
            <Box
              component="img"
              src={post.image}
              alt={post.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </Box>
        )}

        {/* Structured Article Blocks */}
        <ArticleContent content={post.content} />

        {/* Informative Pilot Advisory Note */}
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            mb: 6,
            p: 3,
            borderRadius: 3.5,
            bgcolor: 'rgba(0, 172, 228, 0.05)',
            border: '1px solid rgba(0, 172, 228, 0.25)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              bgcolor: '#00aCe4',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0, 172, 228, 0.3)'
            }}
          >
            <LightbulbOutlined sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                color: '#0f172a',
                fontSize: '0.95rem',
                mb: 0.5
              }}
            >
              Criterio Operativo & Buenas Prácticas
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#475569', lineHeight: 1.65 }}
            >
              En Wavi Aeronautics fomentamos la cultura del vuelo seguro y responsable.
              Recuerda siempre realizar la verificación previa al vuelo (pre-flight checklist),
              revisar la polarización de tus antenas y respetar las zonas protegidas y reguladas.
            </Typography>
          </Box>
        </Paper>

        {/* =============================================================== */}
        {/* CLOSING BANNER CONNECTING TO STORE EQUIPMENT                    */}
        {/* =============================================================== */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: 4,
            p: { xs: 3.5, sm: 5 },
            color: '#ffffff',
            border: '1px solid rgba(0, 172, 228, 0.25)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
            position: 'relative',
            overflow: 'hidden',
            mb: 7
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <Box
            sx={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 220,
              height: 220,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 172, 228, 0.22) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <Chip
            label="Tecnología & Equipamiento FPV"
            size="small"
            sx={{
              mb: 2,
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              bgcolor: 'rgba(0, 240, 255, 0.12)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: '#00F0FF',
              px: 1
            }}
          />

          <Typography
            variant="h4"
            component="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.45rem', sm: '1.85rem' },
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              mb: 1.5
            }}
          >
            Equípate con lo mejor para tus vuelos
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.78)',
              fontSize: { xs: '0.94rem', sm: '1.02rem' },
              lineHeight: 1.7,
              maxWidth: 680,
              mb: 3.5
            }}
          >
            No somos una academia certificadora bajo RAC 100: nuestro propósito es acercarte al conocimiento técnico y poner a tu disposición los mejores drones, radiomandos, gafas FPV, baterías y repuestos del mercado con envíos a toda Colombia.
          </Typography>

          {/* Action CTAs */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
          >
            <Button
              component={Link}
              href="/tienda/drones-fpv-hd"
              variant="contained"
              size="large"
              startIcon={<ShoppingBag />}
              sx={{
                background: 'linear-gradient(135deg, #00aCe4 0%, #0284c7 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                textTransform: 'none',
                py: 1.4,
                px: 3.2,
                borderRadius: 2.5,
                boxShadow: '0 4px 16px rgba(0, 172, 228, 0.35)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0, 172, 228, 0.45)'
                }
              }}
            >
              Explorar Drones & Repuestos en la Tienda
            </Button>

            <Button
              component="a"
              href="https://wa.me/573245464166?text=Hola%20Wavi%20Aeronautics,%20le%C3%AD%20su%20art%C3%ADculo%20en%20el%20blog%20y%20quiero%20asesor%C3%ADa%20sobre%20equipos%20FPV."
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="large"
              startIcon={<WhatsApp sx={{ color: '#25D366' }} />}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                textTransform: 'none',
                py: 1.4,
                px: 3,
                borderRadius: 2.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#25D366',
                  bgcolor: 'rgba(37, 211, 102, 0.08)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Asesoría Técnica por WhatsApp
            </Button>
          </Stack>
        </Box>

        {/* Adjacent Posts Navigation */}
        <PostNavigation prev={prev} next={next} />
      </Container>

      <AppFooter />
    </Box>
  )
}
