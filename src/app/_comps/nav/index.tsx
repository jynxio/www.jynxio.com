import type { PropsWithChildren } from 'react';

import { Link } from '@/comps/link';
import css from './index.module.css';

function Nav() {
    return (
        <nav className={css.container}>
            <Link href="/posts">Posts</Link>
            <i>·</i>
            <Link href="/shorts">Shorts</Link>

            <i>|</i>

            <ExternalLink href="https://github.com/jynxio">GitHub</ExternalLink>
            <i>·</i>
            <ExternalLink href="https://x.com/jyn_xio">Twitter</ExternalLink>
        </nav>
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
