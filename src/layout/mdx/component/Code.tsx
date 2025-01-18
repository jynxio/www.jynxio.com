import clsx from 'clsx';
import css from './code.module.css';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

function Code({ children, className, ...rest }: Props) {
    return (
        <code className={clsx(css.container, className)} {...rest}>
            {children}
        </code>
    );
}

export { Code };
export default Code;
