import css from "./H2.module.css";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

function H2({ children, ...rest }: Props) {
    return (
        <h2 {...rest} className={css.container}>
            {children}
        </h2>
    );
}

export { H2 };
export default H2;
