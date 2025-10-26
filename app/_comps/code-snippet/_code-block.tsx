'use client';

import { Button } from '@/_comps/button';
import { Scroll } from '@/_comps/scroll';
import clsx from 'clsx';
import { Check, Clipboard, Loader, Maximize, Minimize, X } from 'lucide-react';
import React from 'react';
import css from './_index.module.scss';

type Props = {
    html: string;
    code: string;
    expanded?: true;
    expandBtnProps: ExpandBtnProps;
    ref?: React.RefObject<HTMLDivElement | null>;
};

type ExpandBtnProps = { isExpand: boolean; onClick: () => void };

function CodeBlock({ ref, html, code, expanded, expandBtnProps }: Props) {
    return (
        <div ref={ref} data-state={expanded ? 'expanded' : 'compact'} className={css.codeBlock}>
            <Scroll className={css.scroll}>
                <div
                    aria-readonly
                    contentEditable
                    role="textbox"
                    aria-label="Code block"
                    inputMode="none"
                    tabIndex={-1}
                    style={{ outline: 'none' }}
                    onKeyDown={onKeyDown}
                    onDrop={e => e.preventDefault()}
                    onPaste={e => e.preventDefault()}
                    onDragStart={e => e.preventDefault()}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </Scroll>

            <aside className={css.control}>
                <CopyBtn code={code} />
                <ExpandBtn {...expandBtnProps} />
            </aside>
        </div>
    );
}

function CopyBtn({ code }: { code: string }) {
    const [state, setState] = React.useState<'idle' | 'loading' | 'success' | 'failure'>('idle');

    return (
        <Button label="copy" className={css.copyBtn} onClick={handleClick}>
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
            await navigator.clipboard.writeText(code);
            setState('success');
        } catch {
            setState('failure');
        } finally {
            setTimeout(() => setState('idle'), 1000);
        }
    }
}

function ExpandBtn({ isExpand, onClick }: { isExpand: boolean; onClick: () => void }) {
    return (
        <Button label="expand" className={css.expandBtn} onClick={onClick}>
            <Minimize className={clsx(css.compact, isExpand && css.active)} />
            <Maximize className={clsx(css.expand, isExpand || css.active)} />
        </Button>
    );
}

function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const allowedKeySet = new Set([
        'Home',
        'End',
        'PageUp',
        'PageDown',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
    ]);

    if (e.code === 'Escape') return e.currentTarget.blur();

    const isAllowedKey = allowedKeySet.has(e.code);
    if (isAllowedKey) return;

    const isModifierKeyCombo = e.metaKey || e.ctrlKey || e.altKey;
    if (isModifierKeyCombo) return;

    e.preventDefault();
}

export { CodeBlock };
