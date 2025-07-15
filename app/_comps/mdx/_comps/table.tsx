import { Scroll } from '@/_comps/scroll';
import clsx from 'clsx';
import css from './table.module.css';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableElement>, HTMLTableElement>;

function Table({ children, className, ...rest }: Props) {
    return (
        <Scroll className={css.container}>
            <table className={clsx(css.table, className)} {...rest}>
                {children}
            </table>
        </Scroll>
    );
}

export { Table };
