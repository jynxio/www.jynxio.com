'use client';

import { motion, useAnimate } from 'motion/react';
import { useEffect, type PropsWithChildren } from 'react';
import { useInView } from 'react-intersection-observer';
import { range } from 'remeda';

const initialMotion = { scale: 0.9, opacity: 0 } as const;

function Fade({ children }: PropsWithChildren) {
    const [ref1, animate] = useAnimate<HTMLDivElement>();
    const { ref: ref2, entry } = useInView({ threshold: range(0, 101).map(item => item / 100) });

    useEffect(() => {
        ref2(ref1.current);
        return () => ref2(null);
    }, [ref1, ref2]);

    useEffect(() => {
        const isIntersected = entry?.isIntersecting;
        if (!isIntersected) return;

        const ratio = entry.intersectionRatio;
        const { scale, opacity } = initialMotion;
        const position = entry.intersectionRect.top === 0 ? 'top' : 'bottom';
        const nextMotion = {
            opacity: opacity + ratio * (1 - opacity),
            scale: position === 'top' ? 1 : scale + ratio * (1 - scale),
        };

        animate(ref1.current, nextMotion, { duration: 0.1 });
    }, [entry, animate, ref1]);

    return (
        <motion.div ref={ref1} initial={initialMotion}>
            {children}
        </motion.div>
    );
}

export { Fade };
