import clsx from 'clsx';
import css from './em.module.css';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

function Em({ children, className, ...rest }: Props) {
    return (
        <em className={clsx(css.container, className)} {...rest}>
            {children}
        </em>
    );
}

export { Em };
