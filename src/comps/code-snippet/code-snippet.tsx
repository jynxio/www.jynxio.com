import { codeToHtml } from 'shiki';
import { Box } from './box';
import css from './box.module.css';
import { pretty } from './pretty';

type Props = Readonly<{ children: { props: { className: string; children: string } } }>;

async function CodeSnippet(props: Props) {
    const code = props.children.props.children;
    const lang = props.children.props.className?.split('language-')[1] ?? '';

    const prettierCode = await pretty(code, lang);
    const html = await codeToHtml(prettierCode, {
        lang,
        theme: 'kanagawa-dragon',
        transformers: [{ pre: elem => void (elem.properties = { class: css.pre }) }],
    });

    return <Box html={html} code={prettierCode} />;
}

export { CodeSnippet };
