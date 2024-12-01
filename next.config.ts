import type { NextConfig } from "next";

// TODO:
// 由于next/image自带的优化器不支持SSG，因此我需要自定义优化器（请使用Sharp），定义方式请见：https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#image-optimization
// 目前，没有使用next/image，对应代码请见：src/layout/mdx/Img.tsx

const nextConfig: NextConfig = {
    output: "export",
    reactStrictMode: true,
    // TODO: 该配置似乎是无用的，请考虑移除
    outputFileTracingIncludes: {
        "/*": ["./post/**/*"],
    },
};

export default nextConfig;
