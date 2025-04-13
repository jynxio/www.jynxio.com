import clsx from 'clsx';
import css from './hr.module.css';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement>;

function Hr({ className, ...rest }: Props) {
    return <hr className={clsx(css.container, className)} {...rest} />;
}

export { Hr };
