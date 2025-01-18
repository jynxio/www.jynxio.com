import Icon from '@/component/icon';
import clsx from 'clsx';
import { Forward, Loader } from 'lucide-react';
import NextLink from 'next/link';
import React from 'react';
import css from './item.module.css';

type Props = Readonly<{
    title: string;
    abstract: string;
    isLoading: boolean;
    navigate: () => void;
}>;

function Item({ title, abstract, isLoading, navigate }: Props) {
    return (
        <div className={css.container}>
            <NextLink
                href=""
                onClick={onClick}
                className={clsx(css.link, isLoading && css.loading)}
                tabIndex={isLoading ? -1 : undefined}
            >
                <h3 className={css.title}>{title}</h3>
                <p className={css.des}>{abstract}</p>
                <Entry />
            </NextLink>

            {isLoading && <Spin />}
        </div>
    );

    function onClick(e: React.MouseEvent) {
        e.preventDefault();
        isLoading || navigate();
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

export default Item;
