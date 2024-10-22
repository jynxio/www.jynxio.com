/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    reactStrictMode: true,
    outputFileTracingIncludes: {
        "/*": ["./post/**/*"],
    },
};

export default nextConfig;
