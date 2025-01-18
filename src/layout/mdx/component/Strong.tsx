import clsx from 'clsx';
import css from './strong.module.css';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

function Strong({ children, className, ...rest }: Props) {
    return (
        <strong className={clsx(css.container, className)} {...rest}>
            {children}
        </strong>
    );
}

export { Strong };
export default Strong;
