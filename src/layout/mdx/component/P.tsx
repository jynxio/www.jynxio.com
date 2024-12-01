import css from "./P.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
>;

function P({ children, className, ...rest }: Props) {
    return (
        <p className={clsx(css.container, className)} {...rest}>
            {children}
        </p>
    );
}

export { P };
export default P;
