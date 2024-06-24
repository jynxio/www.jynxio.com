type Props = React.DetailedHTMLProps<React.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;

function Ol({ children, ...rest }: Props) {
    return <ol {...rest}>{children}</ol>;
}

export { Ol };
export default Ol;
