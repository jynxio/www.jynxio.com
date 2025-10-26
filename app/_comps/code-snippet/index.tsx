import { codeToHtml } from 'shiki';
import { CodeBox } from './_code-box';
import css from './_index.module.scss';
import { pretty } from './_pretty';

type Props = { children: { props: { className: string; children: string } } };

async function CodeSnippet(props: Props) {
    const code = props.children.props.children;
    const lang = props.children.props.className?.split('language-')[1] ?? '';

    const prettierCode = await pretty(code, lang);
    const html = await codeToHtml(prettierCode, {
        lang,
        theme: 'kanagawa-dragon',
        transformers: [{ pre: elem => void (elem.properties = { class: css.pre }) }],
    });

    return <CodeBox html={html} code={prettierCode} />;
}

export { CodeSnippet };
