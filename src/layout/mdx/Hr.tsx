import css from "./Hr.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement>;

function Hr({ className, ...rest }: Props) {
    return <hr className={clsx(css.container, className)} {...rest} />;
}

export { Hr };
export default Hr;
