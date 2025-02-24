/** @type {import('next').NextConfig} */
const nextConfig = {
  // Autres configurations existantes...
  async headers() {
    return [
      {
        source: '/content/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Range',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/content/:path*',
        destination: '/api/content/:path*',
      },
    ]
  },
}

module.exports = nextConfig 