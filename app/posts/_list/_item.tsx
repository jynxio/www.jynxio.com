'use client';

import { useTransition, type MouseEvent } from 'react';

import { Icon } from '@/_comps/icon';
import clsx from 'clsx';
import { Forward, Loader } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import css from './_item.module.css';

type Props = Readonly<{
    title: string;
    abstract: string;
    href: string;
}>;

function Item({ title, abstract, href }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return (
        <div className={css.container}>
            <NextLink
                href=""
                onClick={handleClick}
                className={clsx(css.link, isPending && css.loading)}
                tabIndex={isPending ? -1 : undefined}
            >
                <h3 className={css.title}>{title}</h3>
                <p className={css.des}>{abstract}</p>
                <Entry />
            </NextLink>

            {isPending && <Spin />}
        </div>
    );

    function handleClick(e: MouseEvent) {
        e.preventDefault();
        isPending || startTransition(() => router.push(href));
    }
}

function Entry() {
    return (
        <span className={css.entry}>
            Read now
            <Icon label="read now" fontSize="1.2rem" icon={<Forward />} />
        </span>
    );
}

function Spin() {
    return <Icon className={css.spin} label="spin" fontSize="2rem" icon={<Loader />} />;
}

export { Item };
