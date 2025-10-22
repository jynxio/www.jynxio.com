'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import type { MotionProps } from 'motion/react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { useImmer } from 'use-immer';
import css from './_box.module.css';
import { CodeBlock } from './_code-block';

type Props = { html: string; code: string };
type Keyframes = [MotionProps['exit'], MotionProps['exit']] | undefined;

function Box({ html, code }: Props) {
    const ref = React.useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = React.useState(false);
    const [isHidden, setIsHidden] = React.useState(false);
    const [keyframes, setKeyframes] = useImmer<Keyframes>(undefined);

    const [copyTriggerState, copyTriggerOnClick] = useCopy(code);
    const copyTriggerProps = { state: copyTriggerState, onClick: copyTriggerOnClick };

    return (
        <>
            <CodeBlock
                mode="inline"
                ref={ref}
                html={html}
                hidden={isHidden}
                copyTriggerProps={copyTriggerProps}
                modalTriggerProps={{ state: isOpen, onClick: open }}
            />

            <AnimatePresence onExitComplete={() => setIsHidden(false)}>
                {isOpen && (
                    <Dialog.Root open={isOpen} onOpenChange={isOpen => (isOpen ? open() : close())}>
                        <Dialog.Portal>
                            <Dialog.Overlay asChild>
                                <motion.div
                                    key="dialog-overlay"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.7 }}
                                    exit={{ opacity: 0 }}
                                    className={css.modalOverlay}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                />
                            </Dialog.Overlay>

                            <Dialog.Content>
                                <VisuallyHidden.Root>
                                    <Dialog.Title>Code Preview</Dialog.Title>
                                    <Dialog.Description>
                                        Enlarged view of the code block for better readability
                                    </Dialog.Description>
                                </VisuallyHidden.Root>

                                <motion.div
                                    key="dialog-content"
                                    initial={keyframes?.[0]}
                                    animate={keyframes?.[1]}
                                    exit={keyframes?.[0]}
                                    className={css.modalContent}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                >
                                    <CodeBlock
                                        mode="dialog"
                                        html={html}
                                        copyTriggerProps={copyTriggerProps}
                                        modalTriggerProps={{ state: isOpen, onClick: close }}
                                    />
                                </motion.div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>
                )}
            </AnimatePresence>
        </>
    );

    function open() {
        setIsHidden(true);
        setIsOpen(true);
        setKeyframes(createKeyframes(ref.current!));
    }

    function close() {
        setIsOpen(false);
        setKeyframes(createKeyframes(ref.current!));
    }
}

function useCopy(text: string) {
    const [state, setState] = React.useState<'idle' | 'loading' | 'success' | 'failure'>('idle');

    return [state, copy] as const;

    async function copy() {
        if (state !== 'idle') return;

        try {
            setState('loading');
            await navigator.clipboard.writeText(text);
            setState('success');
        } catch {
            setState('failure');
        } finally {
            setTimeout(() => setState('idle'), 1000);
        }
    }
}

function createKeyframes(elem: HTMLElement): Keyframes {
    const rect = elem.getBoundingClientRect();

    const [startW, startH] = [rect.width + 'px', rect.height + 'px'];
    const [startX, startY] = [rect.left + 'px', rect.top + 'px'];

    const [endW, endH] = [`min(calc(100dvw - 2ch), 120ch)`, `calc(100dvh - 2ch)`];
    const [endX, endY] = [`calc((100dvw - ${endW}) / 2)`, `calc((100dvh - ${endH}) / 2)`];

    return [
        {
            height: startH,
            width: startW,
            transform: `translate(${startX}, ${startY})`,
        },
        {
            height: endH,
            width: endW,
            transform: `translate(${endX}, ${endY})`,
        },
    ] as const;
}

export { Box };
