import css from "./Table.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableElement>, HTMLTableElement>;

function Table({ children, className, ...rest }: Props) {
    return (
        <table className={clsx(css.container, className)} {...rest}>
            {children}
        </table>
    );
}

export { Table };
export default Table;
