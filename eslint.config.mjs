import { FlatCompat } from '@eslint/eslintrc';
import pluginVanilla from '@eslint/js';
import pluginPrettier from 'eslint-config-prettier';
import pluginReactCompiler from 'eslint-plugin-react-compiler';
import globals from 'globals';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pluginTypescript from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const pluginReactCompilerWrapper = {
    plugins: { 'react-compiler': pluginReactCompiler },
    rules: { 'react-compiler/react-compiler': 'error' },
};

const eslintConfig = [
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        ignores: ['**/.next/', '**/out/', '**/dist/', '**/.build/', '**/.vercel/'],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },

    pluginVanilla.configs.recommended,
    pluginPrettier,
    ...pluginTypescript.configs.recommended,
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    pluginReactCompilerWrapper,

    {
        rules: {
            'no-unused-expressions': 'off',
            'react/react-in-jsx-scope': 'off',
            'import/no-anonymous-default-export': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
        },
    },
];

export default eslintConfig;
