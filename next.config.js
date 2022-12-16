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
    HOST_NAME: "https://space-shop.up.railway.app",
    MONGO_URL:
      "mongodb+srv://space_shop:auth9**@backend-cafe.y7fo5.mongodb.net/spacedb",
    PORT: 3000,
    SECRET_KEY_JWT: "my_secret33@@",
    NEXTAUTH_SECRET: "mynextauth123@",
    NEXT_PUBLIC_TAX_RATE: 0.15,
    DEFAULT_LIMIT: 5,
    GITHUB_ID: "be8044fe723fed45df1c",
    GITHUB_SECRET: "8d2dfec911e576215c0fb86993670bfe301a3346",
    CLOUDINARY_URL:
      "cloudinary://784527415311958:efadsVCcIjvuCGRpMNO6tfBeY2A@servidor-depruebas-backend",
  },
};

module.exports = nextConfig;
