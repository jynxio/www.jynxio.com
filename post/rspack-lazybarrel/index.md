---
title: "Rspack v1.5 Introduces lazyBarrel Feature"

abstract: "Rspack v1.5 brings a new lazyBarrel feature, I compared it with Next.js and Vite, and briefly explained how it works."

publishedDate: "2025-08-26T00:00:00+08:00"

updatedDate:  "2025-08-26T00:00:00+08:00"

tags: ["Bundler"]

hero: "hero.png"
---

Today, Rspack v1.5 ships with a brand‑new experimental feature — [lazyBarrel](https://github.com/web-infra-dev/rspack/blob/864edbd373fda33c8f8ea611a840bef35ab6694c/website/docs/en/config/experiments.mdx?plain=1#L853).

`lazyBarrel` is designed to optimize the build performance of barrel files, resulting in faster cold starts for the dev server and reduced bundle times. Compared with the approach in Next.js@15.5, Rspack’s implementation is superior. Here’s a quick comparison:

> Not familiar with barrel files? A barrel file is essentially an `index.ts` that re‑exports other modules. It simplifies imports and provides centralized access control, but comes at the cost of increased build overhead.
>
> For a deeper dive, check out my other post: [What Do I Think of the Barrel Pattern?](https://www.jynxio.com/posts/what-i-think-of-barrel-pattern).

|               | Third‑Party Packages | Project Source Code |
| ------------- | -------------------- | ------------------- |
| Rspack v1.5   | ✅                    | ✅                   |
| Next.js v15.5 | ✅                    | ❌                   |
| Vite v7.1     | ❌                    | ❌                   |

Another highlight: Rspack handles third‑party libraries automatically, while Next.js requires developers to manually configure [optimizePackageImports](https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports). Regardless of the tool, the underlying principle remains roughly the same.

![principle](./img/principle.png)
