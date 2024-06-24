import css from "./Pre.module.css";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>;

function Pre({ children, ...rest }: Props) {
    return (
        <pre {...rest} className={css.container}>
            {children}
        </pre>
    );
}

export { Pre };
export default Pre;
