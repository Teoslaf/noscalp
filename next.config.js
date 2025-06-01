/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Add your image domains here (e.g., event image CDNs)
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      // },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // Optimize for mobile performance
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig 