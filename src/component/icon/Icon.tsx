"use client";

import css from "./Icon.module.css";
import React from "react";
import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import clsx from "clsx";

// 代表仅作为占位符来使用
interface PlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    width?: number;
    height?: number;
    children: React.ReactNode;
}
interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
    label?: never;
    children?: never;
    width?: number;
    height?: number;
}

type Props = PlaceholderProps | IconProps;

const Icon = React.forwardRef<HTMLDivElement, Props>(
    ({ label, width, height, children, className, style, ...rest }: Props, ref) => {
        const blockSize = height === undefined ? "fit-content" : `calc(${height} / 16 * 1rem)`;
        const inlineSize = width === undefined ? "fit-content" : `calc(${width}  / 16 * 1rem)`;

        return (
            <div
                ref={ref}
                className={clsx(css.container, className)}
                style={{ blockSize, inlineSize, ...style }}
                {...rest}
            >
                {label && <AccessibleIcon.Root label={label}>{children}</AccessibleIcon.Root>}
            </div>
        );
    },
);

export { Icon };
export default Icon;
