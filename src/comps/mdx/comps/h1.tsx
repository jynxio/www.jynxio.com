import clsx from 'clsx';
import css from './h1.module.css';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

function H1({ children, className, ...rest }: Props) {
    return (
        <h1 className={clsx(css.container, className)} {...rest}>
            {children}
        </h1>
    );
}

export { H1 };
