import type { ComponentProps } from 'react';

import clsx from 'clsx';
import PrimitiveLink from 'next/link';
import css from './_index.module.css';

type Props = ComponentProps<typeof PrimitiveLink>;

function Link({ children, className, ref, ...rest }: Props) {
    return (
        <PrimitiveLink ref={ref} className={clsx(css.container, className)} {...rest}>
            {children}
        </PrimitiveLink>
    );
}

export { Link };
