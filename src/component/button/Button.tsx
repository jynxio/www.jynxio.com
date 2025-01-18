import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import clsx from 'clsx';
import React from 'react';
import css from './button.module.css';

type Props = React.HTMLAttributes<HTMLButtonElement> & {
    label: string;
    ref?: React.Ref<HTMLButtonElement>;
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
export default Button;
