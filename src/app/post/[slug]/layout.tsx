import type React from 'react';

import Icon from '@/component/icon';
import Link from '@/component/link';
import { Undo2 } from 'lucide-react';
import css from './layout.module.css';

function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div>
            <nav className={css.nav}>
                <Link className={css.link} href="/">
                    <Icon label="return" fontSize="1.2rem" icon={<Undo2 />} />
                    Return
                </Link>
            </nav>

            {children}
        </div>
    );
}

export default Layout;
