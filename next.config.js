/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {},
  // turbopack: {
  //   root: path.join(__dirname, '..'),
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/5.x/identicon/svg'
      },
      {
        hostname: 'firebasestorage.googleapis.com'
      }
    ]
  },
  // webpack5: true,
  turbo: {
    resolveAlias: {
      canvas: './src/utilities/emptyModule.js',
      net: './src/utilities/emptyModule.js',
      fs: './src/utilities/emptyModule.js',
      tls: './src/utilities/emptyModule.js',
    },
  },
  async redirects() {
    return [
      {
        source: '/tienda',
        destination: '/tienda/kit-drones',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
