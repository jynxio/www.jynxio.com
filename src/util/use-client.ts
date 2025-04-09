import { useEffect, useState } from 'react';

function useClient() {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => setIsHydrated(true), []);

    return isHydrated;
}

export { useClient };
