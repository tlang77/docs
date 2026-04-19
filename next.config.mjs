/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: '*.r2.cloudflarestorage.com' },
      { hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
