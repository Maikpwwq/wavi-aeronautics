/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {},
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
}

module.exports = nextConfig
