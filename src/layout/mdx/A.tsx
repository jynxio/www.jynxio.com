import css from "./A.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
>;

function A({ children, className, ...rest }: Props) {
    return (
        <a className={clsx(css.container, className)} {...rest}>
            {children}
        </a>
    );
}

export { A };
export default A;
