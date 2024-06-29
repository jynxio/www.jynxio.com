"use client";

import css from "./MousePosition.module.css";
import React from "react";
import clsx from "clsx";
import { useMouseHovered } from "react-use";

function MousePosition() {
    //
    const ref = React.useRef(null);
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
export default MousePosition;
