import css from "./H6.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

function H6({ children, className, ...rest }: Props) {
    return (
        <h6 className={clsx(css.container, className)} {...rest}>
            {children}
        </h6>
    );
}

export { H6 };
export default H6;
