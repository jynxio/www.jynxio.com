import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';

import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import clsx from 'clsx';
import { isUndefined, merge } from 'lodash-es';
import css from './index.module.css';

type Base<T> = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    icon: ReactNode;
    label?: string;
    color?: string;
} & T;
type Props = Readonly<
    Base<{ width?: string; height?: string; fontSize?: string; ref?: Ref<HTMLDivElement> }>
>;

function Icon(props: Base<{ width: string }>): ReactNode;
function Icon(props: Base<{ height: string }>): ReactNode;
function Icon(props: Base<{ fontSize: string }>): ReactNode;
function Icon(props: Base<{ width: string; height: string }>): ReactNode;
function Icon(props: Props): ReactNode {
    const { icon, label, fontSize, width, height, color, ref, className, style, ...rest } = props;
    const presetStyle: CSSProperties = (() => {
        if (is(fontSize)) return { fontSize, width: '1em', height: '1em' };
        if (is(width) && is(height)) return { width, height };
        if (is(width)) return { width, height: width };
        if (is(height)) return { width: height, height };

        return { width: '1em', height: '1rem' };
    })();

    if (is(color)) presetStyle.color = color;

    const settledStyle = merge({}, presetStyle, style);

    return (
        <div ref={ref} style={settledStyle} className={clsx(css.container, className)} {...rest}>
            <div>
                <AccessibleIcon.Root label={label ?? ''}>{icon}</AccessibleIcon.Root>
            </div>
        </div>
    );
}

function is(i: unknown) {
    return !isUndefined(i);
}

export { Icon };
