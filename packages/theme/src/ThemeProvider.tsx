import { ReactNode } from 'react';

/**
 * Theme Provider Component
 * 
 * Simple wrapper for now - will be enhanced with theme switching logic
 */
export function Theme({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default Theme;


