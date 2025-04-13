import pluginBabel from 'prettier/plugins/babel';
import pluginEstree from 'prettier/plugins/estree';
import pluginHtml from 'prettier/plugins/html';
import pluginMd from 'prettier/plugins/markdown';
import pluginPostcss from 'prettier/plugins/postcss';
import pluginTs from 'prettier/plugins/typescript';
import pluginYaml from 'prettier/plugins/yaml';
import prettier from 'prettier/standalone';

const supportLang = {
    html: 'html',

    css: 'css',
    scss: 'scss',

    js: 'typescript',
    jsx: 'typescript',
    javascript: 'typescript',
    ts: 'typescript',
    tsx: 'typescript',
    typescript: 'typescript',

    vue: 'vue',

    md: 'markdown',
    mdx: 'markdown',
    markdown: 'markdown',

    json: 'json',
    jsonc: 'jsonc',
    yaml: 'yaml',
} as const;

function pretty(code: string, lang: string) {
    const isSupported = checkLanguageSupport(lang);
    if (!isSupported) return code;

    return prettier.format(code, {
        parser: supportLang[lang],
        plugins: [
            pluginBabel,
            pluginTs,
            pluginEstree,
            pluginHtml,
            pluginPostcss,
            pluginYaml,
            pluginMd,
        ],
        singleQuote: true,
    });
}

function checkLanguageSupport(lang: string): lang is keyof typeof supportLang {
    return lang in supportLang;
}

export { pretty };
