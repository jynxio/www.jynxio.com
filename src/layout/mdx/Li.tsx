import css from "./Li.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;

function Li({ children, className, ...rest }: Props) {
    return (
        <li className={clsx(css.container, className)} {...rest}>
            {children}
        </li>
    );
}

export { Li };
export default Li;
