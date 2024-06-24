import css from "./H1.module.css";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

function H1({ children, ...rest }: Props) {
    return (
        <h1 {...rest} className={css.container}>
            {children}
        </h1>
    );
}

export { H1 };
export default H1;
