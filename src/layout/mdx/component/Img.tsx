import clsx from 'clsx';
import css from './img.module.css';

/**
 * TODO:
 * next/image不支持SSG，除非我需要自定义优化器（详见：https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#image-optimization），
 * 但是，next/image需要传入明确的width和height，而这是不可能的，因此next/image或许根本就不适合此组件。如果你只是想要做图像压缩，那么可以使用Vite插件。
 */
type Props = Readonly<React.ImgHTMLAttributes<HTMLImageElement> & { postSlug: string }>;
type ImgCtx = {
    src: string;
    width: number;
    height: number;
    blurDataURL: string;
    blueHeight: number;
    blurWidth: number;
};

async function Img({ alt, src: originalSrc, className, postSlug, ...rest }: Props) {
    if (!originalSrc) return;

    const name = originalSrc.split('/').at(-1);
    if (!name) return;

    const imgModule = await import(`$/post/${postSlug}/img/${name}`);
    const { src } = imgModule.default as ImgCtx;

    return <img {...rest} src={src} alt={alt ?? ''} className={clsx(css.container, className)} />;
}

export { Img };
export default Img;
