'use client';

import './custom.css';

import { merge } from 'lodash-es';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';
import React from 'react';

type Props = React.ComponentProps<typeof OverlayScrollbarsComponent>;

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
            theme: 'os-theme-light',
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
export default Scroll;
