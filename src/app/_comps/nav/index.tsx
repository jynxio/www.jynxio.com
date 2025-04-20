'use client';

import type { PropsWithChildren } from 'react';

import { Link } from '@/comps/link';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import css from './index.module.scss';

function Nav() {
    const pathname = usePathname();
    const isInShortsPage = pathname === '/shorts';
    const isInPostCategoryPage = pathname === '/posts';
    const isShown = isInShortsPage || isInPostCategoryPage;

    return (
        <AnimatePresence initial>
            {isShown && (
                <motion.nav
                    key="navigation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={css.container}
                >
                    <Link href="/posts">Posts</Link>
                    <i>·</i>
                    <Link href="/shorts">Shorts</Link>

                    <i>|</i>

                    <ExternalLink href="https://github.com/jynxio">GitHub</ExternalLink>
                </motion.nav>
            )}
        </AnimatePresence>
    );
}

function ExternalLink({ children, href }: PropsWithChildren<{ href: string }>) {
    return (
        <Link target="_blank" href={href} style={{ cursor: 'alias' }}>
            {children}
        </Link>
    );
}

export { Nav };
