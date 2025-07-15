import { Icon } from '@/_comps/icon';
import { Link } from '@/_comps/link';
import { Undo2 } from 'lucide-react';

import css from './_not-found.module.css';

function NotFound() {
    return (
        <Link className={css.container} tabIndex={1} href="/">
            <Icon label="Back to Homepage" fontSize="1rem" icon={<Undo2 />} />
            <h1>{`"Nothing here."`}</h1>
        </Link>
    );
}

export default NotFound;
