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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        net: false,
        fs: false,
        tls: false
      }
    }

    return config
  }
}

module.exports = nextConfig
