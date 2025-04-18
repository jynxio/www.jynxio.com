import pluginVanilla from '@eslint/js';
import { flatConfig as pluginNext } from '@next/eslint-plugin-next';
import pluginPrettier from 'eslint-config-prettier';
import pluginReact from 'eslint-plugin-react';
import pluginReactCompiler from 'eslint-plugin-react-compiler';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import pluginTypescript from 'typescript-eslint';

const pluginReactWrapper = {
    settings: { react: { version: 'detect' } },
    ...pluginReact.configs.flat.recommended,
};
const pluginReactHooksWrapper = {
    plugins: { 'react-hooks': pluginReactHooks },
    rules: pluginReactHooks.configs.recommended.rules,
};

const pluginReactCompilerWrapper = {
    plugins: { 'react-compiler': pluginReactCompiler },
    rules: { 'react-compiler/react-compiler': 'error' },
};

const eslintConfig = [
    /**
     * Base
     */
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
    { ignores: ['**/.next/', '**/out/', '**/dist/', '**/.build/', '**/.vercel/'] },
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },

    /**
     * Plugin
     */
    pluginVanilla.configs.recommended,
    pluginReactWrapper,
    pluginReactHooksWrapper,
    pluginReactRefresh.configs.recommended,
    pluginReactCompilerWrapper,
    pluginNext.coreWebVitals, // Refer to https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/src/index.ts
    ...pluginTypescript.configs.recommended,
    pluginPrettier,

    /**
     * Overrides
     */
    {
        rules: {
            'no-unused-expressions': 'off',
            'react/react-in-jsx-scope': 'off',
            'import/no-anonymous-default-export': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
        },
    },

    {
        files: ['**/page.tsx', '**/layout.tsx'],
        rules: {
            'react-refresh/only-export-components': 'off',
        },
    },
];

export default eslintConfig;
