type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

function Strong({ children, ...rest }: Props) {
    return <strong {...rest}>{children}</strong>;
}

export { Strong };
export default Strong;
