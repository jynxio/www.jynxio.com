'use client';

import { useClient } from '$/app/_utils/use-client';
import type { PropsWithChildren, ReactNode } from 'react';

function Client({ children, fallback }: PropsWithChildren<{ fallback: ReactNode }>) {
    const hasHydrated = useClient();

    if (hasHydrated) return children;
    if (fallback) return fallback;

    return null;
}

export { Client };
