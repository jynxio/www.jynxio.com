'use client';

import './custom.css';

import type { ComponentProps } from 'react';

import { merge } from 'lodash-es';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';

type Props = ComponentProps<typeof OverlayScrollbarsComponent>;

function Scroll({ defer, options: option, element, children, ...rest }: Props) {
    const presetElement: Props['element'] = 'div';
    const settledElement = element ?? presetElement;

    const presetDefer = true;
    const settledDefer = defer ?? presetDefer;

    const presetOption: Props['options'] = {
        paddingAbsolute: true,
        scrollbars: {
            autoHide: 'move',
            autoHideDelay: 200,
        },
    };
    const settledOption = merge({}, presetOption, option);

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
