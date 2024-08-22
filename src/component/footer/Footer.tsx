import "@/util/font";
import css from "./Footer.module.css";
import Link from "@/component/link";
import Icon from "@/component/icon";
import { Github, Twitter, Rss } from "lucide-react";

function Footer() {
    return (
        <footer className={css.container}>
            <address>© 2022-2024 Jynxio | CC BY-NC-ND 4.0</address>

            <nav>
                <Link href="https://github.com/jynxio" target="_blank">
                    <Icon label="github">
                        <Github />
                    </Icon>
                </Link>

                <Link href="https://x.com/jyn_xio" target="_blank">
                    <Icon label="twitter">
                        <Twitter />
                    </Icon>
                </Link>

                <Link href="/rss" target="_blank">
                    <Icon label="rss">
                        <Rss />
                    </Icon>
                </Link>
            </nav>
        </footer>
    );
}

export { Footer };
export default Footer;
