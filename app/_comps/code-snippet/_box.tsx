'use client';

import { Scroll } from '@/_comps/scroll';
import { useState, type ComponentProps } from 'react';
import css from './_box.module.css';
import { Copy } from './_copy-btn';
import { ExpandBtn } from './_expand-btn';

type Props = Readonly<{ html: string; code: string }>;
type Event = ComponentProps<typeof Scroll>['events'];

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

function Box({ html, code }: Props) {
    const [isExpandable, setIsExpandable] = useState(false);
    const event: Event = {
        updated: inst => void (inst.state().hasOverflow.y && setIsExpandable(true)),
    };

    return (
        <div className={css.container}>
            <Scroll className={css.scroll} events={event}>
                <div
                    contentEditable
                    role="textbox"
                    aria-readonly="true"
                    aria-label="Code block"
                    tabIndex={-1}
                    dangerouslySetInnerHTML={{ __html: html }}
                    onKeyDown={onKeyDown}
                    onDrop={e => e.preventDefault()}
                    onPaste={e => e.preventDefault()}
                    onDragStart={e => e.preventDefault()}
                />
            </Scroll>

            <aside className={css.control}>
                {isExpandable && banExpandBtn() && <ExpandBtn />}
                <Copy text={code} />
            </aside>
        </div>
    );
}

function banExpandBtn() {
    return false;
}

function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.code === 'Escape') return e.currentTarget.blur();

    const isAllowedKey = allowedKeySet.has(e.code);
    if (isAllowedKey) return;

    const isModifierKeyCombo = e.metaKey || e.ctrlKey || e.altKey;
    if (isModifierKeyCombo) return;

    e.preventDefault();
}

export { Box };
