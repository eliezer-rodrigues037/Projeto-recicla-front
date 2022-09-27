/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // http://localhost:3333
  // 
  env: {
    baseUrl: "http://192.168.0.5:3333",
  },
};

module.exports = nextConfig;
