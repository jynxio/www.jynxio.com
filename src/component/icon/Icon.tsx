'use client';

import css from './Icon.module.css';
import React from 'react';
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

// 代表仅作为占位符来使用
type PlaceholderProps = {
    label: string;
    children: React.ReactNode;
    size?: number;
};
type IconProps = {
    label?: never;
    children?: never;
    size?: number;
} & React.HTMLAttributes<HTMLDivElement>;
type Props = PlaceholderProps | IconProps;

const Icon = React.forwardRef<HTMLDivElement, Props>(
    ({ label, size = 18, children }: Props, ref) => {
        return (
            <div
                ref={ref}
                className={css.container}
                style={{
                    blockSize: `calc(${size} / 16 * 1rem)`,
                    inlineSize: `calc(${size} / 16 * 1rem)`,
                }}
            >
                {label && <AccessibleIcon.Root label={label}>{children}</AccessibleIcon.Root>}
            </div>
        );
    },
);

export { Icon };
export default Icon;
