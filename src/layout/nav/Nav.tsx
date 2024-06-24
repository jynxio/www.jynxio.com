import css from "./Nav.module.css";
import clsx from "clsx";
import React from "react";
import Link from "@/component/link";
import Icon from "@/component/icon";
import { Tent, Library, DraftingCompass } from "lucide-react";

type Props = Omit<React.HTMLAttributes<HTMLHeadElement>, "children">;

const Nav = React.forwardRef<HTMLHeadElement, Props>(({ className, ...rest }, ref) => {
    return (
        <aside className={clsx(css.container, className)} ref={ref} {...rest}>
            <nav>
                <Link href="/" className={css.link}>
                    <Icon label="home" width={18}>
                        <Tent />
                    </Icon>
                    Home
                </Link>

                <Link href="/post" className={css.link}>
                    <Icon label="post" width={18}>
                        <Library />
                    </Icon>
                    Post
                </Link>

                <Link href="/inder" className={css.link}>
                    <Icon label="idea" width={18}>
                        <DraftingCompass />
                    </Icon>
                    Idea
                </Link>
            </nav>
        </aside>
    );
});

export { Nav };
export default Nav;
