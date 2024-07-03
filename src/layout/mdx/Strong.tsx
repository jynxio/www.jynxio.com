import css from "./Strong.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

function Strong({ children, className, ...rest }: Props) {
    return (
        <strong className={clsx(css.container, className)} {...rest}>
            {children}
        </strong>
    );
}

export { Strong };
export default Strong;
