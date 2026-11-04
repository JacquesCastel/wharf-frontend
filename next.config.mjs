/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async headers() {
    const privateHeaders = ['/admin/:path*', '/sommaire/:path*', '/projets/:path*', '/clients/:path*', '/prospection/:path*', '/desinscription/:path*', '/login', '/typography-demo'].map(source => ({ source, headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }));
    return [
      {
        source: '/:path*',
        // Scope HSTS to the two HTTPS frontend hosts, excluding local previews and other subdomains.
        has: [{ type: 'host', value: '(?:www\\.)?bywharf\\.com' }],
        headers: [{ key: 'Strict-Transport-Security', value: 'max-age=31536000' }],
      },
      ...privateHeaders,
    ];
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.bywharf.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'bywharf.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

// Updated

export default nextConfig;
