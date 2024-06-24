import css from "./Header.module.css";
import clsx from "clsx";
import React from "react";
import Link from "@/component/link";

type Props = Omit<React.HTMLAttributes<HTMLHeadElement>, "children">;

const Header = React.forwardRef<HTMLHeadElement, Props>(({ className, ...rest }, ref) => {
    return (
        <header className={clsx(css.container, className)} ref={ref} {...rest}>
            <nav>
                <Link href="/">Home</Link>
                <Link href="/post">Post</Link>
                <Link href="/inder">Idea</Link>
            </nav>
        </header>
    );
});

export { Header };
export default Header;
