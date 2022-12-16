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
  env: {
    MONGO_URL: `mongodb+svr://${process.env.DB_USER}:${DB_PASS}${DB_HOST}`,
    PORT: "3000",
  },
};

module.exports = nextConfig;
