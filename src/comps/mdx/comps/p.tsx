import clsx from 'clsx';
import css from './p.module.css';

type Props = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
>;

function P({ children, className, ...rest }: Props) {
    return (
        <p className={clsx(css.container, className)} {...rest}>
            {children}
        </p>
    );
}

export { P };
