/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  },
  experimental: {
    excludeExperimentalFiles: [
      'app/[locale]/[slug]/**/*',
    ],
  },
  dynamicRoutes: {
    '/[locale]/[slug]': { dynamic: true },
  }
};

export default nextConfig;
