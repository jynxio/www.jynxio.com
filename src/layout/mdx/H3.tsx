import css from "./H3.module.css";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

function H3({ children, ...rest }: Props) {
    return (
        <h3 {...rest} className={css.container}>
            {children}
        </h3>
    );
}

export { H3 };
export default H3;
