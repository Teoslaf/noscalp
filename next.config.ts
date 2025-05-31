import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['static.usernames.app-backend.toolsforhumanity.com'],
  },
  // Configure allowed development origins for World App
  allowedDevOrigins: [
    'http://localhost:3001',
    'https://*.ngrok-free.app', // Allow all ngrok-free.app subdomains
  ],
  reactStrictMode: false,
};

export default nextConfig;
