'use client';

import '../public/styles/globals.css';
import UserIdProvider from './providers/UserIdProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserIdProvider>{children}</UserIdProvider>
      </body>
    </html>
  );
}
