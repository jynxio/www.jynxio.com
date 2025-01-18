import clsx from 'clsx';
import css from './pre.module.css';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>;

function Pre({ children, className, ...rest }: Props) {
    return (
        <pre className={clsx(css.container, className)} {...rest}>
            {children}
        </pre>
    );
}

export { Pre };
export default Pre;
