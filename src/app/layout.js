import './globals.css'
import Providers from './providers'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'

export const viewport = {
  width: 'device-width',
  initialScale: 1
}

export const metadata = {
  title: 'Wavi Aeronautics',
  description: 'Manufacture, distribution and maintenance of Drones. Get updated with the latest trends in technology and advanced VToL equipment.',
  keywords: 'drone, pilotos fpv, fpv, controladora, receptora, baterias para drone, googles, gafas fpv, props, hélices, Kits FPV, Drones RC, Control remoto',
  authors: [{ name: 'Wavi Aeronautics' }],
  other: {
    'X-UA-Compatible': 'IE=edge',
    'msapplication-TileColor': '#ffffff',
    'msapplication-TileImage': '/ms-icon-144x144.png',
    'theme-color': '#ffffff',
    'google-site-verification': '6r-eSIrLWUsVNJ9XHALfxTClL79n1mxBNunxLyceNt0'
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-icon-57x57.png', sizes: '57x57' },
      { url: '/apple-icon-60x60.png', sizes: '60x60' },
      { url: '/apple-icon-72x72.png', sizes: '72x72' },
      { url: '/apple-icon-76x76.png', sizes: '76x76' },
      { url: '/apple-icon-114x114.png', sizes: '114x114' },
      { url: '/apple-icon-120x120.png', sizes: '120x120' },
      { url: '/apple-icon-144x144.png', sizes: '144x144' },
      { url: '/apple-icon-152x152.png', sizes: '152x152' },
      { url: '/apple-icon-180x180.png', sizes: '180x180' }
    ],
    other: [
      { rel: 'icon', url: '/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'manifest', url: '/manifest.json' }
    ]
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Providers>
            {children}
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
