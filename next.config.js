
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standard build for Netlify
  distDir: '.next',
  
  // Image optimization settings
  images: { 
    unoptimized: true,
    domains: ['localhost', 'beautygo.netlify.app'],
  },
  
  // Experimental features
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
  },
  
  // Build configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Environment variables that should be available at build time
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  
  // Webpack configuration for better compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  
  // Redirect configuration for deployment
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  

};

module.exports = nextConfig;
