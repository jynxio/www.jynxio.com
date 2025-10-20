'use client';

import { Button } from '@/_comps/button';
import clsx from 'clsx';
import { Check, Clipboard, Loader, Maximize, Minimize, X } from 'lucide-react';
import css from './_trigger.module.css';

type CopyTriggerProps = {
    state: 'idle' | 'loading' | 'success' | 'failure';
    onClick: () => void;
};

function CopyTrigger({ state, onClick }: CopyTriggerProps) {
    return (
        <Button label="copy" onClick={onClick} className={css.copy}>
            <X className={clsx(css.failure, state === 'failure' && css.active)} />
            <Check className={clsx(css.success, state === 'success' && css.active)} />
            <Loader className={clsx(css.loading, state === 'loading' && css.active)} />
            <Clipboard className={clsx(css.idle, state === 'idle' && css.active)} />
        </Button>
    );
}

type ModalTriggerProps = {
    state: boolean;
    onClick: () => void;
};

function ModalTrigger({ state, onClick }: ModalTriggerProps) {
    return (
        <Button label="expand" className={css.modal} onClick={onClick}>
            {/* @todo Animation */}
            {state ? <Minimize /> : <Maximize />}
        </Button>
    );
}

export { CopyTrigger, ModalTrigger };
export type { CopyTriggerProps, ModalTriggerProps };
