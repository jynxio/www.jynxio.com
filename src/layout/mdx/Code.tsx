type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

function Code({ children, ...rest }: Props) {
    return <code {...rest}>{children}</code>;
}

export { Code };
export default Code;
