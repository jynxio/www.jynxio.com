type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

function H4({ children, ...rest }: Props) {
    return <h4 {...rest}>{children}</h4>;
}

export { H4 };
export default H4;
