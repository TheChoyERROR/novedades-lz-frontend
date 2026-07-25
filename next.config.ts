import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8080',
      },
    ],
  },
  async rewrites() {
    // Este proxy es solo para desarrollo. En produccion el navegador llama directo a
    // NEXT_PUBLIC_API_BASE_URL, y dejar la regla activa hacia localhost hacia que cualquier
    // peticion a /api en el dominio publico devolviera el error DNS_HOSTNAME_RESOLVED_PRIVATE
    // de Vercel en vez de un 404 normal.
    if (process.env.NODE_ENV !== 'development') {
      return [];
    }

    const target = process.env.DEV_API_PROXY_TARGET ?? 'http://localhost:8080';

    return [
      {
        source: '/api/:path*',
        destination: `${target}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
