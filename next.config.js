const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.accessibilitydays.it'],
  },
};

module.exports = withContentlayer(nextConfig);
