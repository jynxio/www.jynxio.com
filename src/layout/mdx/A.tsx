type Props = React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
>;

function A({ children, ...rest }: Props) {
    return <a {...rest}>{children}</a>;
}

export { A };
export default A;
