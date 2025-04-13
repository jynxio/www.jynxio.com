'use client';

import clsx from 'clsx';
import { useRef } from 'react';
import { useMouseHovered } from 'react-use';
import css from './mouse-position.module.css';

function MousePosition() {
    //
    const ref = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
    const { elX, elY, elW, elH } = useMouseHovered(ref, { bound: true, whenHovered: false });

    // Derived State
    const translate = `${elX + 5}px ${elY + 5}px`;
    const isOutside = elX >= elW || elX <= 0 || elY >= elH || elY <= 0;

    //
    return (
        <div className={css.container} ref={ref}>
            <span className={clsx(css.follower, isOutside && css.hidden)} style={{ translate }}>
                [{elX.toFixed()}, {elY.toFixed()}]
            </span>
        </div>
    );
}

export { MousePosition };
