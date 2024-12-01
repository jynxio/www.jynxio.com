import css from "./Pre.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>;

function Pre({ children, className, ...rest }: Props) {
    return (
        <pre className={clsx(css.container, className)} {...rest}>
            {children}
        </pre>
    );
}

export { Pre };
export default Pre;
