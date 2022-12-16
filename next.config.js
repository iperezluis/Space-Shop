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
    MONGO_URL:
      "mongodb+srv://space_shop:auth9**@backend-cafe.y7fo5.mongodb.net/spacedb",
    PORT: 3000,
    SECRET_KEY_JWT: "my_secret33@@",
    NEXTAUTH_SECRET: "mynextauth123@",
    NEXT_PUBLIC_TAX_RATE: 0.15,
    DEFAULT_LIMIT: 5,
    GITHUB_ID: "be8044fe723fed45df1c",
    GITHUB_SECRET: "8d2dfec911e576215c0fb86993670bfe301a3346",
  },
};

module.exports = nextConfig;
