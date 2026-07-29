const BASE_URL = 'https://wavi-aeronautics.vercel.app'

/**
 * Next.js Metadata API — Dynamic Sitemap
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 *
 * Generates sitemap.xml at build time.
 * Google Search Console will automatically discover it via robots.txt
 * or you can submit it manually at:
 *   https://search.google.com/search-console → Sitemaps → Add a new sitemap
 *
 * NOTE: Blog post entries are defined inline because blogPosts.js is a
 *       'use client' module and cannot be imported from a server route.
 *       When adding a new blog post, add its slug here too.
 */
export default function sitemap() {
  const now = new Date().toISOString()

  // ─── Static public pages ───────────────────────────────────────────
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // Store — category pages
    {
      url: `${BASE_URL}/tienda/kit-drones`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tienda/drones`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tienda/drones-fpv-hd`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tienda/accesorios`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tienda/googles`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tienda/trasmisor-receptor`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tienda/radio-control`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tienda/digital-vtx`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tienda/software`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/tienda/escuela`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Blog index
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Legal pages
    {
      url: `${BASE_URL}/condiciones-del-servicio`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/politica-de-privacidad`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/politica-de-envios`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/politica-de-garantia`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/politica-de-reembolso`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/politica-de-devoluciones`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/eliminacion-datos-usuario`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // ─── Blog post pages ──────────────────────────────────────────────
  // Maintained inline since blogPosts.js uses 'use client'.
  // Add new entries here when publishing new blog articles.
  const blogPages = [
    {
      url: `${BASE_URL}/blog/primera-vez-piloto-fpv`,
      lastModified: '2024-01-15T00:00:00.000Z',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/mantenimiento-drones-fpv`,
      lastModified: '2024-02-10T00:00:00.000Z',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  return [...staticPages, ...blogPages]
}
