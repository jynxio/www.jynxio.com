import clsx from "clsx";
import css from "./Button.module.css";
import React from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}

const Button = React.forwardRef<HTMLButtonElement, Props>(
    ({ label, className, children, ...rest }: Props, ref) => {
        return (
            <button ref={ref} className={clsx(css.container, className)} {...rest}>
                {children}
                <VisuallyHidden.Root>{label}</VisuallyHidden.Root>
            </button>
        );
    },
);

export { Button };
export default Button;
