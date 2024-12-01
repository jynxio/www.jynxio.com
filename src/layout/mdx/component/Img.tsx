import css from "./Img.module.css";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

async function Img({ alt, src, className, ...rest }: Props) {
    if (!src) return <></>;

    return <img {...rest} src={src} alt={alt ?? ""} className={clsx(css.container, className)} />;
}

export { Img };
export default Img;
