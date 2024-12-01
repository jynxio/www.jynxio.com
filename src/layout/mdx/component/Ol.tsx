import css from "./Ol.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<React.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;

function Ol({ children, className, ...rest }: Props) {
    return (
        <ol className={clsx(css.container, className)} {...rest}>
            {children}
        </ol>
    );
}

export { Ol };
export default Ol;
