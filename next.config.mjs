/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        outputFileTracingIncludes: {
            "/*": ["./post/**/*"],
        },
    },
    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "jynxio.github.io",
                port: "",
                pathname: "/blog-image-hosting/**",
            },
        ],
    },
};

export default nextConfig;
