'use client';

import { Scroll } from '@/comps/scroll';
import { useState, type ComponentProps } from 'react';
import css from './box.module.css';
import { Copy } from './copy-btn';
import { ExpandBtn } from './expand-btn';

type Props = Readonly<{ html: string; code: string }>;
type Event = ComponentProps<typeof Scroll>['events'];

function Box({ html, code }: Props) {
    const [isExpandable, setIsExpandable] = useState(false);
    const event: Event = {
        updated: inst => void (inst.state().hasOverflow.y && setIsExpandable(true)),
    };

    return (
        <div className={css.container}>
            <Scroll className={css.scroll} events={event}>
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </Scroll>

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

export { Box };
