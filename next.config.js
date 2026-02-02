/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // This allows ALL Supabase projects
      },
    ],
  },
};

module.exports = nextConfig;