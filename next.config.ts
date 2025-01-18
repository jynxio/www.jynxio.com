import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'export',
    reactStrictMode: true,
    experimental: {
        reactCompiler: true,
    },
};

export default nextConfig;
