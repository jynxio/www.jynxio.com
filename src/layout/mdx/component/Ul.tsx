import css from "./Ul.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;

function Ul({ children, className, ...rest }: Props) {
    return (
        <ul className={clsx(css.container, className)} {...rest}>
            {children}
        </ul>
    );
}

export { Ul };
export default Ul;
