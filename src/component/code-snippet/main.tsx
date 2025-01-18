'use client';

import React from 'react';

import PrimitiveScroll from '@/layout/scroll';
import Copy from './copy-btn';
import ExpandBtn from './expand-btn';
import css from './main.module.css';

type Props = Readonly<{ html: string; code: string }>;
type Event = React.ComponentProps<typeof PrimitiveScroll>['events'];

function Scroll({ html, code }: Props) {
    const [isExpandable, setIsExpandable] = React.useState(false);
    const event: Event = {
        updated: inst => void (inst.state().hasOverflow.y && setIsExpandable(true)),
    };

    return (
        <div className={css.container}>
            <PrimitiveScroll className={css.scroll} events={event}>
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </PrimitiveScroll>

            <aside className={css.control}>
                {isExpandable && banExpandBtn() && <ExpandBtn />}
                <Copy text={code} />
            </aside>
        </div>
    );
}

function banExpandBtn() {
    return false;
}

export { Scroll };
export default Scroll;
