/**
 * Next.js Metadata API — Dynamic robots.txt
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 *
 * Generates /robots.txt at build time.
 * Tells Google which areas to crawl and where to find the sitemap.
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/auth/',
          '/profile/',
          '/orders/',
          '/security/',
          '/posts/',
          '/tienda/ver-carrito/',
          '/tienda/detalles-envio/',
          '/tienda/pago-exitoso/',
          '/tienda/pago-fallido/',
          '/tienda/pago-pendiente/',
          '/tienda/pse-resultado/',
          '/tienda/producto/',
        ],
      },
    ],
    sitemap: 'https://wavi-aeronautics.vercel.app/sitemap.xml',
  }
}
