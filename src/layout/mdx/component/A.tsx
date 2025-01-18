import Link from '@/component/link';
import clsx from 'clsx';
import css from './a.module.css';

type Props = React.ComponentProps<typeof Link>;

function A({ children, className, href, ...rest }: Props): React.ReactElement {
    return (
        <Link href={href} className={clsx(css.container, className)} target="_blank" {...rest}>
            {children}
        </Link>
    );
}

export { A };
export default A;
