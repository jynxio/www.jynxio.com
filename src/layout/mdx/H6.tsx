type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

function H6({ children, ...rest }: Props) {
    return <h6 {...rest}>{children}</h6>;
}

export { H6 };
export default H6;
