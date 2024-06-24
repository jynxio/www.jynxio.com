import css from "./Link.module.css";
import React from "react";
import NextLink from "next/link";
import clsx from "clsx";

type Props = React.ComponentProps<typeof NextLink>;

const Link = React.forwardRef<HTMLAnchorElement, Props>(
    ({ children, className, ...rest }: Props, ref) => {
        return (
            <NextLink ref={ref} className={clsx(css.container, className)} {...rest}>
                {children}
            </NextLink>
        );
    },
);

export { Link };
export default Link;
