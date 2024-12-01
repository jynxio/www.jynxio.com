import css from "./Code.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

function Code({ children, className, ...rest }: Props) {
    return (
        <code className={clsx(css.container, className)} {...rest}>
            {children}
        </code>
    );
}

export { Code };
export default Code;
