/** @type {import('next').NextConfig} */
console.log('NODE_ENV:', process.env.NODE_ENV);
const nextConfig = {

    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'http://192.168.0.11:8080/api' : 'http://localhost:8080/api'),
        NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || (process.env.NODE_ENV === 'production' ? 'http://192.168.0.11:8080/ws' : 'http://localhost:8080/ws'),
    },
};

export default nextConfig;
