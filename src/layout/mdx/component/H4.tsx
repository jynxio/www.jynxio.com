import css from "./H4.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

function H4({ children, className, ...rest }: Props) {
    return (
        <h4 className={clsx(css.container, className)} {...rest}>
            {children}
        </h4>
    );
}

export { H4 };
export default H4;
