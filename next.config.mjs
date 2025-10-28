/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yziqvcjchqzycdtrrcks.supabase.co',
        pathname: '/storage/v1/object/public/blog-media/**',
      },
    ],
  },
};

// Use "export default" em vez de "module.exports"
export default nextConfig;