import css from "./H2.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

function H2({ children, className, ...rest }: Props) {
    return (
        <h2 className={clsx(css.container, className)} {...rest}>
            {children}
        </h2>
    );
}

export { H2 };
export default H2;
