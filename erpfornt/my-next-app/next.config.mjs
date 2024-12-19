/** @type {import('next').NextConfig} */
console.log('NODE_ENV:', process.env.NODE_ENV);
const nextConfig = {

  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://192.168.0.11:8081/api' : 'https://localhost:8081/api'),
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || (process.env.NODE_ENV === 'production' ? 'https://192.168.0.11:8081/ws' : 'https://localhost:8081/ws'),
  },
};

export default nextConfig;
