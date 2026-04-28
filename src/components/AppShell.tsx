import type { ReactNode } from 'react';
import AppNav from './AppNav';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#080808',
      color: '#fff',
      fontFamily: "'IBM Plex Mono', monospace",
    }}>
      <AppNav />
      <div style={{ paddingTop: '60px' }}>
        {children}
      </div>
    </div>
  );
}
