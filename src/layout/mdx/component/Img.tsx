import css from "./Img.module.css";
import clsx from "clsx";

/**
 * TODO:
 * next/image不支持SSG，除非我需要自定义优化器（详见：https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#image-optimization），
 * 但是，next/image需要传入明确的width和height，而这是不可能的，因此next/image或许根本就不适合此组件。如果你只是想要做图像压缩，那么可以使用Vite插件。
 */

type Props = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

async function Img({ alt, src, className, ...rest }: Props) {
    if (!src) return <></>;

    return <img {...rest} src={src} alt={alt ?? ""} className={clsx(css.container, className)} />;
}

export { Img };
export default Img;
