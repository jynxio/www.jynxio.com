import css from "./NativeJsx.module.css";
import { codeToHtml } from "shiki";
import { MDXRemote } from "next-mdx-remote/rsc";
import { readFile } from "@/helper/post";

async function NativeJsx() {
    const code = await readFile(
        "post/build-an-interactive-blog-with-mdx/component/native-jsx/code.txt",
    );
    const html = await codeToHtml(code, { lang: "md", theme: "vitesse-dark" });

    return (
        <div className={css.container}>
            <section>
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: This happens on the server side, so it is secure. */}
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </section>
            <section>
                <MDXRemote source={code} />
            </section>
        </div>
    );
}

export { NativeJsx };
export default NativeJsx;
