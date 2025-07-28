/** @type {import('next').NextConfig} */
const nextConfig = {
      env: {
    JWT_SECRET: process.env.JWT_SECRET, 
  },
};


export default nextConfig;

