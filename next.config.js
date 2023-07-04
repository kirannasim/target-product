/** @type {import('next').NextConfig} */

const path = require('path');
const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');

dotenvLoad();

const withNextEnv = nextEnv();

const nextConfig = withNextEnv({
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
})

module.exports = nextConfig
