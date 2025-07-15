'use client';

import type { DetailedHTMLProps, HTMLAttributes } from 'react';

import clsx from 'clsx';
import { PowerGlitch } from 'powerglitch';
import css from './code.module.css';

type Props = Omit<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>, 'children'> & {
    children: string;
};

function Code({ children, className, ...rest }: Props) {
    return (
        <code
            ref={handleRef}
            onClick={handleClick}
            className={clsx(css.container, className)}
            {...rest}
        >
            {children}
        </code>
    );

    async function handleClick() {
        await navigator.clipboard.writeText(children);
    }

    function handleRef(dom: HTMLElement) {
        PowerGlitch.glitch(dom, {
            playMode: 'click',
            timing: { duration: 400, easing: 'ease-in-out' },
        });

        return () => {};
    }
}

export { Code };
