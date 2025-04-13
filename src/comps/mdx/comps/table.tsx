import { Scroll } from '@/comps/scroll';
import clsx from 'clsx';
import css from './table.module.css';

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
