import css from "./Em.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

function Em({ children, className, ...rest }: Props) {
    return (
        <em className={clsx(css.container, className)} {...rest}>
            {children}
        </em>
    );
}

export { Em };
export default Em;
