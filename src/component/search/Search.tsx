"use client";

import React from "react";
import css from "./Search.module.css";
import Button from "@/component/button";
import localFont from "next/font/local";
import clsx from "clsx";
import Dialog from "@/component/dialog";
import Icon from "@/component/icon";
import Link from "@/component/link";
import { X } from "lucide-react";
import { range } from "lodash-es";
import { useEvent } from "react-use";

const interRegularSubset = localFont({
    src: "./inter-regular-subset.woff2",
    display: "swap",
    weight: "normal",
    style: "normal",
});

const fakePostNames = range(8).map((i) => ({ uuid: crypto.randomUUID(), name: `post-${i}` }));

export default function Search() {
    const linkRefs = React.useRef<(HTMLAnchorElement | null)[]>([]); // TODO: 如果post更新了，那么就需要清空该数组，否则会造成内存泄漏

    const [text, setText] = React.useState("");
    const [selected, setSelected] = React.useState(-1);
    const [visible, setVisible] = React.useState(false);

    useEvent("keydown", (e: Event) => onKeydown(e as KeyboardEvent), globalThis);
    React.useEffect(() => void (visible && setSelected(-1)), [visible]);

    return (
        <Dialog.Root open={visible} onOpenChange={setVisible}>
            <Dialog.Trigger>
                <Button label="search" className={css.trigger}>
                    Type to search...
                    <kbd className={clsx(css.kbd, interRegularSubset.className)}>⌘K</kbd>
                </Button>
            </Dialog.Trigger>

            <Dialog.Content className={css.modal}>
                <section className={css.search}>
                    <input
                        className={css.input}
                        placeholder="Type to search..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <Button
                        label="close"
                        className={css.close}
                        onClick={() => setVisible(false)}
                        onKeyDown={(e) => e.stopPropagation()}
                    >
                        <Icon label="close" width={16}>
                            <X />
                        </Icon>
                    </Button>
                </section>

                <hr className={css.hr} />

                <section className={css.result}>
                    {!fakePostNames.length ? (
                        <div>No results.</div>
                    ) : (
                        <ul>
                            {fakePostNames.map(({ uuid, name }, i) => (
                                <li key={uuid} className={i === selected ? css.selected : ""}>
                                    <Link
                                        href={`/${name}`}
                                        tabIndex={-1}
                                        className={css.link}
                                        ref={(e) => void (linkRefs.current[i] = e)}
                                        onMouseEnter={() => setSelected(i)}
                                    >
                                        {name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </Dialog.Content>
        </Dialog.Root>
    );

    function onKeydown(e: KeyboardEvent) {
        switch (e.key.toLowerCase()) {
            case "/":
                visible || e.preventDefault();
                setVisible(true);
                break;

            case "k":
                e.metaKey && setVisible((prev) => !prev);
                break;

            case "arrowup":
                e.preventDefault();
                setSelected((prev) => (prev + fakePostNames.length - 1) % fakePostNames.length);
                break;

            case "arrowdown":
                e.preventDefault();
                setSelected((prev) => (prev + 1) % fakePostNames.length);
                break;

            case "enter":
                linkRefs.current[selected]?.click();
                setVisible(false);
                break;
        }
    }
}
