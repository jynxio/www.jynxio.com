type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;

function Ul({ children, ...rest }: Props) {
    return <ul {...rest}>{children}</ul>;
}

export { Ul };
export default Ul;
