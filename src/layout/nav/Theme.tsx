"use client";

import React from "react";
import Icon from "@/component/icon";
import css from "./Theme.module.css";
import twoPassRender from "@/util/twoPassRender";
import * as Toggle from "@radix-ui/react-toggle";
import { Sparkles, MoonStar, Bot, Loader } from "lucide-react";

const LOCALSTORAGE_KEY = "theme";
const THEMES = ["auto", "dark", "light"] as const;

function Theme() {
    const [theme, setTheme] = React.useState(getTheme());
    const styles = THEMES.map((item) => {
        const style: Record<string, string> = {
            opacity: theme === item ? "1" : "0",
            translate: theme === item ? "0% 0%" : createRandomTranslate(),
        };

        return style;
    });

    return (
        <Toggle.Root aria-label="Toggle theme" className={css.container} onClick={handleClick}>
            <section>
                <Icon width={19} />
            </section>

            <section className={css.icon} style={styles[0]}>
                <Icon label="Auto theme" width={19}>
                    <Bot />
                </Icon>
            </section>

            <section className={css.icon} style={styles[1]}>
                <Icon label="Dark theme" width={19}>
                    <MoonStar />
                </Icon>
            </section>

            <section className={css.icon} style={styles[2]}>
                <Icon label="Light theme" width={19}>
                    <Sparkles />
                </Icon>
            </section>
        </Toggle.Root>
    );

    function handleClick() {
        const currIdx = THEMES.findIndex((item) => item === theme);
        const nextIdx = (currIdx + 1) % THEMES.length;
        const nextTheme = THEMES[nextIdx];

        setTheme(nextTheme);
        globalThis.localStorage.setItem("theme", nextTheme);
        document.documentElement.dataset.theme = nextTheme;
    }
}

function Spin() {
    return (
        <div className={css.spin}>
            <Icon label="Loading" width={19}>
                <Loader />
            </Icon>
        </div>
    );
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

function getTheme() {
    // Storage
    const themeFromLocalStorage = globalThis.localStorage.getItem(LOCALSTORAGE_KEY) as
        | "dark"
        | "auto"
        | "light"
        | null;

    if (themeFromLocalStorage) return themeFromLocalStorage;
    if (checkPrefersColorSchemeSupport()) {
        globalThis.localStorage.setItem(LOCALSTORAGE_KEY, "auto");
        return "auto";
    }

    globalThis.localStorage.setItem(LOCALSTORAGE_KEY, "dark");
    return "dark";

    function checkPrefersColorSchemeSupport() {
        return (
            globalThis.matchMedia("(prefers-color-scheme: light)").matches ||
            globalThis.matchMedia("(prefers-color-scheme: dark)").matches
        );
    }
}

export default twoPassRender(Theme, Spin);
