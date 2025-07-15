'use client';

import type { PropsWithChildren, ReactNode } from 'react';
import { useEffect, useState } from 'react';

function Client({ children, fallback }: PropsWithChildren<{ fallback: ReactNode }>) {
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => setHasHydrated(true), []);

    if (hasHydrated) return children;
    if (fallback) return fallback;

    return null;
}

export { Client };
