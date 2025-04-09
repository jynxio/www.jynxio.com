'use client';

import Button from '@/component/button';
import { Link } from '@/component/link';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import css from './index.module.css';

function Banner() {
    const isRoot = usePathname() === '/';
    const [isShown, setIsShown] = useState(true);
    const isEnabled = isRoot && isShown;

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
