import type { HTMLAttributes, Ref } from 'react';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import clsx from 'clsx';
import css from './button.module.css';

type Props = HTMLAttributes<HTMLButtonElement> & {
    label: string;
    ref?: Ref<HTMLButtonElement>;
};

function Button({ label, className, children, ref, ...rest }: Props) {
    return (
        <button ref={ref} className={clsx(css.container, className)} {...rest}>
            {children}
            <VisuallyHidden.Root>{label}</VisuallyHidden.Root>
        </button>
    );
}

export { Button };
