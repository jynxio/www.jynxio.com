import css from "./H5.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

function H5({ children, className, ...rest }: Props) {
    return (
        <h5 className={clsx(css.container, className)} {...rest}>
            {children}
        </h5>
    );
}

export { H5 };
export default H5;
