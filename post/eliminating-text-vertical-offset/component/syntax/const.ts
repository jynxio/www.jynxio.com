const dict = {
    textBoxTrim: {
        availableValues: ['none', 'trim-start', 'trim-ed', 'trim-both'],
    },
    textBoxEdge: {
        top: {
            availableValues: ['ex', 'cap', 'text'],
            disabledValues: ['ideographic', 'ideographic-ink'],
        },
        bottom: {
            availableValues: ['text', 'alphabetic'],
            disabledValues: ['ideographic', 'ideographic-ink'],
        },
    },
} as const;

export default dict;
