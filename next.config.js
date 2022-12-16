// const dotenv = require("dotenv");
/** @type {import('next').NextConfig} 
// /** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // time in seconds of no pages generating during static
  // generation before timing out
  staticPageGenerationTimeout: 100,
  experimental: {
    esmExternals: false,
  },
  env: {},
};

module.exports = nextConfig;
