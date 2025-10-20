'use client';

import { Scroll } from '@/_comps/scroll';
import clsx from 'clsx';
import React from 'react';
import css from './_code-block.module.scss';
import type { CopyTriggerProps, ModalTriggerProps } from './_trigger';
import { CopyTrigger, ModalTrigger } from './_trigger';

type Props = {
    html: string;
    hidden?: boolean;
    mode: 'inline' | 'dialog';
    ref?: React.RefObject<null | HTMLDivElement>;

    copyTriggerProps: CopyTriggerProps;
    modalTriggerProps: ModalTriggerProps;
};

function CodeBlock({ ref, html, mode, hidden, copyTriggerProps, modalTriggerProps }: Props) {
    return (
        <div
            ref={ref}
            style={{ visibility: hidden ? 'hidden' : 'visible' }}
            className={clsx(css.container, mode === 'dialog' ? css.dialog : css.inline)}
        >
            <Scroll className={css.scroll}>
                <div
                    contentEditable
                    role="textbox"
                    aria-readonly="true"
                    aria-label="Code block"
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
                <ModalTrigger {...modalTriggerProps} />
                <CopyTrigger {...copyTriggerProps} />
            </aside>
        </div>
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
