/** @type {import('next').NextConfig} */
const config = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }
        ],
      },
    ]
  },
  // Allow ngrok domains in development
  experimental: {
    allowedDevOrigins: ['*.ngrok-free.app'],
  }
}

export default config; 