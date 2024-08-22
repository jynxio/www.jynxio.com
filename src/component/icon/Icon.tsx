"use client";

import css from "./Icon.module.css";
import React from "react";
import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import clsx from "clsx";

/**
 * 作为占位符来使用
 */
interface PlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
    label?: never;
    children?: never;
    width?: number;
    height?: number;
}

/**
 * 作为图标来使用
 */
interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    width?: number;
    height?: number;
    children: React.ReactNode;
}

type Props = PlaceholderProps | IconProps;

const Icon = React.forwardRef<HTMLDivElement, Props>(
    ({ label, width, height, children, className, style, ...rest }: Props, ref) => {
        let blockSize: string;
        let inlineSize: string;
        const type = label || children ? "icon" : "placeholder";

        if (type === "icon") {
            blockSize = height === undefined ? "fit-content" : `calc(${height} / 16 * 1rem)`;
            inlineSize = width === undefined ? "fit-content" : `calc(${width}  / 16 * 1rem)`;
        } else {
            blockSize = height === undefined ? "fit-content" : `calc(${height} / 16 * 1rem)`;
            inlineSize = width === undefined ? "fit-content" : `calc(${width}  / 16 * 1rem)`;

            if (blockSize === "fit-content" && inlineSize === "fit-content")
                throw new Error("Icon that use to be placeholder must have a width or height");

            if (blockSize === "fit-content") blockSize = inlineSize;
            if (inlineSize === "fit-content") inlineSize = blockSize;
        }

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
