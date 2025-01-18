import clsx from 'clsx';
import css from './table.module.css';

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
