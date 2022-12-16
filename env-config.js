const prod = process.env.NODE_ENV === "production";

module.exports = {
  "process.env.HOSTNAME": prod
    ? "https://space-shop.up.railway.app"
    : "https://localhost:3000",
};
