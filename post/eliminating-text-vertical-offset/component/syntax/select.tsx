function Select<A extends readonly string[]>({
    value,
    onChange,
    disabledOptions,
    availableOptions,
    disabled = false,
}: {
    value: A[number];
    onChange: (nextValue: A[number]) => void;
    disabledOptions?: readonly string[];
    availableOptions: A;
    disabled?: boolean;
}) {
    return (
        <select value={value} disabled={disabled} onChange={e => onChange(e.target.value)}>
            {availableOptions.map(item => (
                <option key={item} value={item}>
                    {item}
                </option>
            ))}

            {disabledOptions && (
                <>
                    <hr />
                    {disabledOptions.map(item => (
                        <option key={item} value={item} disabled>
                            {item}
                        </option>
                    ))}
                </>
            )}
        </select>
    );
}

export { Select };
