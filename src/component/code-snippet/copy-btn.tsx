'use client';

import Button from '@/component/button';
import clsx from 'clsx';
import { Check, Clipboard, Loader, X } from 'lucide-react';
import React from 'react';
import css from './btn.module.css';

type Props = Readonly<{ text: string }>;

function Copy({ text }: Props) {
    const [state, setState] = React.useState<'idle' | 'loading' | 'success' | 'failure'>('idle');

    return (
        <Button label="copy" onClick={handleClick} className={css.copyBtn}>
            <X className={clsx(css.failure, state === 'failure' && css.active)} />
            <Check className={clsx(css.success, state === 'success' && css.active)} />
            <Loader className={clsx(css.loading, state === 'loading' && css.active)} />
            <Clipboard className={clsx(css.idle, state === 'idle' && css.active)} />
        </Button>
    );

    async function handleClick() {
        if (state !== 'idle') return;

        try {
            setState('loading');
            await navigator.clipboard.writeText(text);
            setState('success');
        } catch {
            setState('failure');
        } finally {
            setTimeout(() => setState('idle'), 1000);
        }
    }
}

export { Copy };
export default Copy;
