type Props = React.DetailedHTMLProps<
    React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
    HTMLQuoteElement
>;

function Blockquote({ children, ...rest }: Props) {
    return <blockquote {...rest}>{children}</blockquote>;
}

export { Blockquote };
export default Blockquote;
