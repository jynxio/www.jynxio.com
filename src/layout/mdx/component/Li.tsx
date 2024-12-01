type Props = React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;

function Li({ children, ...rest }: Props) {
    return <li {...rest}>{children}</li>;
}

export { Li };
export default Li;
