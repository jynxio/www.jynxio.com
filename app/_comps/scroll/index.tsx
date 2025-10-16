'use client';

import './_custom.css';

import type { ComponentProps } from 'react';

import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';
import { mergeDeep } from 'remeda';

type Props = ComponentProps<typeof OverlayScrollbarsComponent>;

function Scroll({ defer, options: option, element, children, ...rest }: Props) {
    const presetElement: Props['element'] = 'div';
    const settledElement = element ?? presetElement;

    const presetDefer = true;
    const settledDefer = defer ?? presetDefer;

    const presetOption = {
        paddingAbsolute: true,
        scrollbars: {
            autoHide: 'move',
            autoHideDelay: 200,
        },
    } as const satisfies Props['options'];
    const settledOption = mergeDeep(mergeDeep({}, presetOption), option || {});

    return (
        <OverlayScrollbarsComponent
            defer={settledDefer}
            options={settledOption}
            element={settledElement}
            {...rest}
        >
            {children}
        </OverlayScrollbarsComponent>
    );
}

export { Scroll };
