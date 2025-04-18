'use client';

import css from './comment.module.css';

import { range } from 'lodash-es';
import { motion, useAnimate } from 'motion/react';
import { useEffect, type PropsWithChildren } from 'react';
import { useInView } from 'react-intersection-observer';

type Props = PropsWithChildren<{ date: string; mode: 'left' | 'right' }>;

const initialMotion = { scale: 0.9, opacity: 0 } as const;

function Comment(props: Props) {
    const [ref1, animate] = useAnimate<HTMLElement>();
    const { ref: ref2, entry } = useInView({ threshold: range(101).map(item => item / 100) });

    useEffect(() => {
        ref2(ref1.current);
        return () => ref2(null);
    }, [ref1, ref2]);

    useEffect(() => {
        const isIntersected = entry?.isIntersecting;
        if (!isIntersected) return;

        const position = entry.intersectionRect.top === 0 ? 'top' : 'bottom';
        if (position === 'top') return;

        const ratio = entry.intersectionRatio;
        const { scale, opacity } = initialMotion;
        const nextMotion = {
            scale: scale + ratio * (1 - scale),
            opacity: opacity + ratio * (1 - opacity),
        };

        animate(ref1.current, nextMotion, { duration: 0.1 });
    }, [entry, animate, ref1]);

    return (
        <motion.section ref={ref1} initial={initialMotion}>
            <Card {...props} />
        </motion.section>
    );
}

function Card({ children, date, mode }: Props) {
    const style = mode === 'left' ? { left: '1ch' } : { right: '1ch' };

    return (
        <div className={css.outer}>
            <div className={css.inner}>
                <article>{children}</article>
                <time className={css.date} dateTime={date} style={style}>
                    {date}
                </time>
            </div>
        </div>
    );
}

export { Comment };
