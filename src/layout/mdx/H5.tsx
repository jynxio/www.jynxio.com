type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

function H5({ children, ...rest }: Props) {
    return <h5 {...rest}>{children}</h5>;
}

export { H5 };
export default H5;
