import css from "./P.module.css";

type Props = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
>;

function P({ children, ...rest }: Props) {
    return (
        <p {...rest} className={css.container}>
            {children}
        </p>
    );
}

export { P };
export default P;
