import css from "./Nav.module.css";
import clsx from "clsx";
import React from "react";
import Link from "@/component/link";
import Icon from "@/component/icon";
import Theme from "./Theme";
import { Tent, Library, DraftingCompass, Github } from "lucide-react";

type Props = Omit<React.HTMLAttributes<HTMLHeadElement>, "children">;

const Nav = React.forwardRef<HTMLHeadElement, Props>(({ className, ...rest }, ref) => {
    return (
        <aside className={clsx(css.container, className)} ref={ref} {...rest}>
            <nav>
                <section className={css.page}>
                    <Link href="/" className={css.link}>
                        <Icon label="Home" width={16}>
                            <Tent />
                        </Icon>
                        Home
                    </Link>

                    <Link href="/post" className={css.link}>
                        <Icon label="Post" width={16}>
                            <Library />
                        </Icon>
                        Post
                    </Link>

                    <Link href="/idea" className={css.link}>
                        <Icon label="Idea" width={16}>
                            <DraftingCompass />
                        </Icon>
                        Idea
                    </Link>
                </section>

                <section className={css.function}>
                    <Link href="https://github.com/jynxio" target="_blank" className={css.link}>
                        <Icon label="Home" width={16}>
                            <Github />
                        </Icon>
                    </Link>

                    <Theme />
                </section>
            </nav>
        </aside>
    );
});

export { Nav };
export default Nav;
