import type { ReactNode } from 'react';

import { Icon } from '@/comps/icon';
import { Link } from '@/comps/link';
import { Scroll } from '@/comps/scroll';
import layoutScrollCss from '@/helpers/layout-scroll.module.css';
import { Undo2 } from 'lucide-react';
import css from './layout.module.scss';

function Layout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <Scroll className={layoutScrollCss.style}>{children}</Scroll>

            <nav className={css.nav}>
                <Link className={css.link} href="/">
                    <Icon label="return" fontSize="1.2rem" icon={<Undo2 />} />
                    Return
                </Link>
            </nav>
        </>
    );
}

export default Layout;
