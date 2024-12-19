/** @type {import('next').NextConfig} */
console.log('NODE_ENV:', process.env.NODE_ENV);

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'http://192.168.0.11:8080/api' : 'http://localhost:8080/api'),
        NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || (process.env.NODE_ENV === 'production' ? 'http://192.168.0.11:8080/ws' : 'http://localhost:8080/ws'),
    },
    webpack: (config) => {
        // 경로 alias 설정
        config.resolve.alias['@'] = join(__dirname, 'src');
        return config;
    },
};

export default nextConfig;
