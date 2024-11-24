import { ReactNode } from 'react';

type PageWrapperProps = {
  children: ReactNode;
};

export function PageWrapper({ children }: PageWrapperProps) {
  return <div className="min-h-screen pt-14 pb-6">{children}</div>;
}
