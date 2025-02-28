import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurations pour les en-têtes CORS
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
  
  // Règles de réécriture pour rediriger les requêtes
  async rewrites() {
    return [
      {
        source: '/content/:path*',
        destination: '/api/content/:path*',
      },
    ]
  },
};

export default nextConfig;
