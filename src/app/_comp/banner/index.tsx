'use client';

import Button from '@/component/button';
import { Link } from '@/component/link';
import { X } from 'lucide-react';
import { useState } from 'react';
import css from './index.module.css';

function Banner() {
    const [enabled, setEnabled] = useState(true);
    const style = enabled ? undefined : { display: 'none', opacity: '0' };

    return (
        <aside className={css.container} style={style}>
            原博客（
            <Link target="_blank" href="https://xio.kim/">
                www.xio.kim
            </Link>
            ）正迁至此处
            <Button label="close banner" className={css.btn} onClick={() => setEnabled(false)}>
                <X fontSize="0.5rem" />
            </Button>
        </aside>
    );
}

export { Banner };
