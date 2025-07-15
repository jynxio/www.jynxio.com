import type { Metadata } from 'next';

import { Icon } from '@/_comps/icon';
import { Link } from '@/_comps/link';
import { APP_URL } from '@/_consts';
import { Undo2 } from 'lucide-react';

import css from './_page.module.css';

function Page() {
    return (
        <Link className={css.container} tabIndex={1} href="/">
            <Icon label="Back to Homepage" fontSize="1rem" icon={<Undo2 />} />
            <h1>{`"Yup, I've taken it down."`}</h1>
        </Link>
    );
}

export function generateMetadata(): Metadata {
    return {
        title: 'Shorts',
        alternates: { canonical: new URL(`/shorts`, APP_URL).toString() },
    };
}

export default Page;
