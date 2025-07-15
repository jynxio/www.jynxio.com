import { Link } from '@/_comps/link';
import clsx from 'clsx';
import css from './h2.module.css';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

function H2({ children, className, ...rest }: Props) {
    const id = String(children).split(' ').join('-');
    const anchor = `#${id}`;

    return (
        <h2 id={id} className={clsx(css.container, className)} {...rest}>
            <Link href={anchor} className={css.link}>
                # {children}
            </Link>
        </h2>
    );
}

export { H2 };
