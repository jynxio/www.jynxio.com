import css from "./H1.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

function H1({ children, className, ...rest }: Props) {
    return (
        <h1 className={clsx(css.container, className)} {...rest}>
            {children}
        </h1>
    );
}

export { H1 };
export default H1;
