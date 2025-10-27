'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import React from 'react';
import { useImmer } from 'use-immer';
import { CodeBlock } from './_code-block';
import css from './_index.module.scss';

type Props = { html: string; code: string };

function CodeBox({ html, code }: Props) {
    const [{ isExpand, setIsExpand }, { layout, layoutRef }] = useExpand(false);
    const expandBtnProps = { isExpand, onClick: () => setIsExpand(!isExpand) };
    const codeBlockProps = { html, code, expandBtnProps };

    return (
        <div className={css.codeBox}>
            <CodeBlock {...codeBlockProps} ref={layoutRef} />

            <Dialog.Root open={isExpand} onOpenChange={setIsExpand}>
                <Dialog.Portal>
                    <Dialog.Overlay className={css.dialogOverlay} />
                    <Dialog.Content style={layout} className={css.dialogContent}>
                        <DialogAria />
                        <CodeBlock {...codeBlockProps} expanded />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}

function DialogAria() {
    return (
        <VisuallyHidden.Root>
            <Dialog.Title>Code Preview</Dialog.Title>
            <Dialog.Description>
                Enlarged view of the code block for better readability
            </Dialog.Description>
        </VisuallyHidden.Root>
    );
}

function useExpand(initial: boolean) {
    const [isExpand, setIsExpand] = React.useState(initial);

    const [layout, updateLayout] = useLayout();
    const layoutRef = React.useRef<HTMLDivElement>(null);

    return [
        { isExpand, setIsExpand: setIsExpandAndUpdateLayout },
        { layout, layoutRef },
    ] as const;

    function setIsExpandAndUpdateLayout(nextIsExpand: boolean) {
        if (!layoutRef.current) return;

        setIsExpand(nextIsExpand);
        updateLayout(layoutRef.current);
    }
}

function useLayout() {
    type CSSPropertiesWithVariable = React.CSSProperties & { [key: string & {}]: string };

    const expandedLayout: Record<'top' | 'right' | 'bottom' | 'left', string> = {
        top: '1ch',
        right: 'calc((100dvw - min(100dvw - 2ch, 120ch)) / 2)',
        bottom: '1ch',
        left: 'calc((100dvw - min(100dvw - 2ch, 120ch)) / 2)',
    };

    const [compactLayout, setCompactLayout] = useImmer(expandedLayout);
    const layout: CSSPropertiesWithVariable = {
        '--compact-top': compactLayout.top,
        '--compact-right': compactLayout.right,
        '--compact-bottom': compactLayout.bottom,
        '--compact-left': compactLayout.left,

        '--expanded-top': expandedLayout.top,
        '--expanded-right': expandedLayout.right,
        '--expanded-bottom': expandedLayout.bottom,
        '--expanded-left': expandedLayout.left,
    };

    return [layout, updateLayout] as const;

    function updateLayout(elem: HTMLElement) {
        const rect = elem.getBoundingClientRect();

        setCompactLayout({
            top: rect.top + 'px',
            right: innerWidth - rect.right + 'px',
            bottom: innerHeight - rect.bottom + 'px',
            left: rect.left + 'px',
        });
    }
}

export { CodeBox };
