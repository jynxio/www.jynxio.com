import { useSyncExternalStore } from 'react';

/**
 * Check if the component has hydrated on the client.
 */
function useClient() {
    return useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );
}

export { useClient };
