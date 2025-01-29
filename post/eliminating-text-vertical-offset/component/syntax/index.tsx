'use client';

import React from 'react';

import dict from './const';
import css from './index.module.css';
import Select from './select';

type CssPropsWithTextBox = React.CSSProperties & { textBox?: string };

function Syntax() {
    type Trim = (typeof dict)['textBoxTrim']['availableValues'][number];
    type EdgeTop = (typeof dict)['textBoxEdge']['top']['availableValues'][number];
    type EdgeBottom = (typeof dict)['textBoxEdge']['bottom']['availableValues'][number];

    const [trim, setTrim] = React.useState<Trim>('trim-both');
    const [edgeTop, setEdgeTop] = React.useState<EdgeTop>('ex');
    const [edgeBottom, setEdgeBottom] = React.useState<EdgeBottom>('alphabetic');

    const isEdgeTopDisabled = trim === 'none';
    const isEdgeBottomDisabled = trim === 'none';

    const ruleValue = trim === 'none' ? 'none' : `${trim} ${edgeTop} ${edgeBottom}`;
    const style: CssPropsWithTextBox = { textBox: ruleValue };

    return (
        <div className={css.container}>
            <section className={css.select}>
                <label>
                    <span>text-box-trim</span>
                    <Select
                        value={trim}
                        onChange={setTrim}
                        availableOptions={dict.textBoxTrim.availableValues}
                    />
                </label>

                <label>
                    <span>text-bpx-edge (Start)</span>
                    <Select
                        value={edgeTop}
                        onChange={setEdgeTop}
                        disabled={isEdgeTopDisabled}
                        availableOptions={dict.textBoxEdge.top.availableValues}
                        disabledOptions={dict.textBoxEdge.top.disabledValues}
                    />
                </label>

                <label className={css.edgeOption}>
                    <span>text-box-edge (Bottom)</span>
                    <Select
                        value={edgeBottom}
                        onChange={setEdgeBottom}
                        disabled={isEdgeBottomDisabled}
                        availableOptions={dict.textBoxEdge.bottom.availableValues}
                        disabledOptions={dict.textBoxEdge.bottom.disabledValues}
                    />
                </label>
            </section>

            <section className={css.syntax}>text-box: {ruleValue}</section>

            <section className={css.effect}>
                <span style={style}>Firefox</span>
            </section>
        </div>
    );
}

export { Syntax };
export default Syntax;
