/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
},

  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      readline: false,
    };
    return config;
  },
};

module.exports = nextConfig;
