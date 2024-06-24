type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

function Em({ children, ...rest }: Props) {
    return <em {...rest}>{children}</em>;
}

export { Em };
export default Em;
