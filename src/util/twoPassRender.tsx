'use client';

import React from 'react';

function twoPassRender(Comp: React.ComponentType, Fallback?: React.ComponentType) {
    const WrapperComp = () => {
        const [hasHydrated, setHasHydrated] = React.useState(false);

        React.useEffect(() => setHasHydrated(true), []);

        if (hasHydrated) return <Comp />;
        if (Fallback) return <Fallback />;

        return null;
    };

    WrapperComp.displayName = Comp.displayName;

    return WrapperComp;
}

export { twoPassRender };
export default twoPassRender;
