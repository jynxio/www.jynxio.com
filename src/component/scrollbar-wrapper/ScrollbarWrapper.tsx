"use client";

import React from "react";
import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import type { OverlayScrollbarsComponentRef } from "overlayscrollbars-react";

type Props = React.HTMLAttributes<HTMLDivElement>;

const ScrollbarWrapper = React.forwardRef<HTMLDivElement, Props>(
    ({ children, ...rest }: Props, ref) => {
        const options: React.ComponentProps<typeof OverlayScrollbarsComponent>["options"] = {
            scrollbars: { theme: "os-theme-light", autoHide: "move", autoHideSuspend: true },
        };

        return (
            <OverlayScrollbarsComponent
                defer
                element="div"
                options={options}
                ref={ref as unknown as React.ForwardedRef<OverlayScrollbarsComponentRef<"div">>}
                {...rest}
            >
                {children}
            </OverlayScrollbarsComponent>
        );
    },
);

export { ScrollbarWrapper };
export default ScrollbarWrapper;
