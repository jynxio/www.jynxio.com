import { codeToHtml } from "shiki";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement> & {
    // biome-ignore lint/suspicious/noExplicitAny: I don't know how to write this tyoe.
    children?: any;
};

async function CodeSnippet(props: Props) {
    const code = props.children.props.children;
    const lang = props.children.props.className?.split("language-")[1] ?? "";
    const html = await codeToHtml(code, { lang, theme: "vitesse-dark" });

    // biome-ignore lint/security/noDangerouslySetInnerHtml: This happens on the server side, so it is secure.
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export { CodeSnippet };
export default CodeSnippet;
