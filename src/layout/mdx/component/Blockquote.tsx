import clsx from 'clsx';
import css from './blockquote.module.css';

type Props = React.DetailedHTMLProps<
    React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
    HTMLQuoteElement
>;

function Blockquote({ children, className, ...rest }: Props) {
    return (
        <blockquote className={clsx(css.container, className)} {...rest}>
            {children}
        </blockquote>
    );
}

export { Blockquote };
export default Blockquote;
