import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import clsx from 'clsx';
import { isUndefined, merge } from 'lodash-es';
import React from 'react';
import css from './index.module.css';

type Base<T> = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    icon: React.ReactNode;
    label?: string;
    color?: string;
} & T;
type Props = Readonly<
    Base<{ width?: string; height?: string; fontSize?: string; ref?: React.Ref<HTMLDivElement> }>
>;

function Icon(props: Base<{ width: string }>): React.ReactNode;
function Icon(props: Base<{ height: string }>): React.ReactNode;
function Icon(props: Base<{ fontSize: string }>): React.ReactNode;
function Icon(props: Base<{ width: string; height: string }>): React.ReactNode;
function Icon(props: Props): React.ReactNode {
    const { icon, label, fontSize, width, height, color, ref, className, style, ...rest } = props;
    const presetStyle: React.CSSProperties = (() => {
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
export default Icon;
