import vanilla from '@eslint/js';
import jynxio from '@jynxio/eslint-plugin';
import { flatConfig as next } from '@next/eslint-plugin-next';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import typescript from 'typescript-eslint';

export default defineConfig([
    /**
     * Global Configuration
     */
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
    { ignores: ['**/.next/', '**/out/', '**/dist/', '**/.build/', '**/.vercel/'] },
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },

    /**
     * Vanilla JS/TS
     */
    vanilla.configs.recommended,
    ...typescript.configs.recommended,
    {
        rules: {
            'no-unused-expressions': 'off',
            'import/no-anonymous-default-export': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
        },
    },

    /**
     * React
     */
    {
        settings: { react: { version: 'detect' } },
        ...react.configs.flat.recommended,
    },
    {
        plugins: { 'react-compiler': reactCompiler },
        rules: { 'react-compiler/react-compiler': 'error' },
    },
    {
        plugins: { 'react-hooks': reactHooks },
        rules: reactHooks.configs.recommended.rules,
    },
    reactRefresh.configs.recommended,
    {
        files: ['**/page.tsx', '**/layout.tsx'],
        rules: {
            'react-refresh/only-export-components': 'off',
        },
    },
    {
        rules: {
            'react/react-in-jsx-scope': 'off',
        },
    },

    /**
     * Next
     */
    next.coreWebVitals, // Refer to https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/src/index.ts

    /**
     * Jynxio
     */
    {
        plugins: {
            jynxio,
        },
        rules: {
            'jynxio/underscore-file-pattern': [
                'error',
                {
                    '$': path.resolve('./'),
                    '@': path.resolve('./app'),
                },
            ],
        },
    },

    /**
     * Prettier
     */
    prettier,
]);
