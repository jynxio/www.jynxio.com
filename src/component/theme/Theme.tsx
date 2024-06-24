"use client";

import React from "react";
import Icon from "@/component/icon";
import css from "./Theme.module.css";
import * as Toggle from "@radix-ui/react-toggle";
import { range } from "lodash-es";
import { Sparkles, MoonStar, Bot } from "lucide-react";

type TriState = 0 | 1 | 2;

export default function () {
    const [state, setState] = React.useState<TriState>(0);
    const [isHydrated, setIsHydrated] = React.useState(false);
    const styles = range(3).map((i) => {
        const style: Record<string, string> = {
            opacity: state === i ? "1" : "0",
            translate: isHydrated ? (state === i ? "0% 0%" : createRandomTranslate()) : "",
        };

        return style;
    });

    React.useEffect(() => setIsHydrated(true), []);

    return (
        <Toggle.Root aria-label="Toggle theme" className={css.container} onClick={handleClick}>
            <section>
                <Icon width={28} />
            </section>

            <section className={css.icon} style={styles[0]}>
                <Icon label="Dark theme" width={28}>
                    <MoonStar />
                </Icon>
            </section>

            <section className={css.icon} style={styles[1]}>
                <Icon label="Auto theme" width={28}>
                    <Bot />
                </Icon>
            </section>

            <section className={css.icon} style={styles[2]}>
                <Icon label="Light theme" width={28}>
                    <Sparkles />
                </Icon>
            </section>
        </Toggle.Root>
    );

    function handleClick() {
        setState((prev) => ((prev + 1) % 3) as TriState);
    }
}

function createRandomTranslate() {
    const xSign = randPlusMinusZero();
    const ySign = xSign === 0 ? randPlusMinus() : randPlusMinusZero();

    return `${xSign * 100}% ${ySign * 100}%`;

    function randPlusMinus() {
        const values = [1, -1] as const;
        const randomIndex = Math.floor(Math.random() * values.length);
        return values[randomIndex];
    }

    function randPlusMinusZero() {
        const values = [1, -1, 0] as const;
        const randomIndex = Math.floor(Math.random() * values.length);
        return values[randomIndex];
    }
}
