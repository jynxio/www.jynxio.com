'use client';

import { Button } from '@/comps/button';
import { Link } from '@/comps/link';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import css from './index.module.css';

function Banner() {
    const pathname = usePathname();
    const isInPostCategoryPage = pathname === '/posts';
    const [isShown, setIsShown] = useState(true);
    const isEnabled = isInPostCategoryPage && isShown;

    return (
        <AnimatePresence initial>
            {isEnabled && (
                <motion.aside
                    key="banner"
                    className={css.container}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    原博客（
                    <Link target="_blank" href="https://xio.kim/">
                        www.xio.kim
                    </Link>
                    ）正迁至此处
                    <Button
                        label="close banner"
                        className={css.btn}
                        onClick={() => setIsShown(false)}
                    >
                        <X fontSize="0.5rem" />
                    </Button>
                </motion.aside>
            )}
        </AnimatePresence>
    );
}

export { Banner };
