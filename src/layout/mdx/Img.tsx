import Image from "next/image";

type Props = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

async function Img({ alt, src, ...rest }: Props) {
    if (!src) return <></>;

    return <Image {...rest} src={src} alt={alt ?? ""} width={500} height={500} />;
}

export { Img };
export default Img;
