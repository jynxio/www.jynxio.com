import css from './Header.module.css';

import React from 'react';
import Search from '@/component/search';
import Theme from '@/component/theme';
import Link from '@/component/link';
import * as Avatar from '@/component/avatar';
import Icon from '@/component/icon';
import avatar from '@/asset/jynxio-avatar.png';
import { Github, Twitter, Rss } from 'lucide-react';

export default function Header() {
    return (
        <div className={css.container}>
            <section className={css.avatar}>
                <Avatar.Root>
                    <Avatar.Image src={avatar.src} alt="Jynxio's avatar" width={20} height={20} />
                    {/* FIXME: 填充 fallback */}
                    <Avatar.Fallback>Fallback</Avatar.Fallback>
                </Avatar.Root>
            </section>

            <section className={css.chapter}>
                <Link href="/">Home</Link>
                <Link href="/blog">Blog</Link>
            </section>

            <section className={css.control}>
                <Search />

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

                <Theme />
            </section>
        </div>
    );
}
