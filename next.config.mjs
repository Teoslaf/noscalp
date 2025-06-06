/** @type {import('next').NextConfig} */
const config = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' }
        ],
      },
    ]
  },
  // Allow ngrok domains in development
  experimental: {
    allowedDevOrigins: ['195f-195-113-187-136.ngrok-free.app'],
  }
}

export default config; 