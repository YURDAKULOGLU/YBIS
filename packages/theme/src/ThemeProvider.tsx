import type { ReactNode, JSX } from 'react';

/**
 * Theme Provider Component
 *
 * Simple wrapper for now - will be enhanced with theme switching logic
 */
export function Theme({ children }: { children: ReactNode }): JSX.Element {
  return <>{children}</>;
}

export default Theme;


