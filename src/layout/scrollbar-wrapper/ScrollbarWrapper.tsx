"use client";

import "overlayscrollbars/overlayscrollbars.css";
import "./custom.css";
import React from "react";
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
