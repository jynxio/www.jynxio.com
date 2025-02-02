import clsx from 'clsx';
import css from './table.module.css';

import Scroll from '@/layout/scroll';
type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableElement>, HTMLTableElement>;

function Table({ children, className, ...rest }: Props) {
    return (
        <Scroll>
            <table className={clsx(css.container, className)} {...rest}>
                {children}
            </table>
        </Scroll>
    );
}

export { Table };
export default Table;
