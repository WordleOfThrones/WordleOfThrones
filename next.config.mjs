// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "thrones.appspot.com" 
    ],
  },
};

export default nextConfig;
