import css from "./H3.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

function H3({ children, className, ...rest }: Props) {
    return (
        <h3 className={clsx(css.container, className)} {...rest}>
            {children}
        </h3>
    );
}

export { H3 };
export default H3;
