'use client';

import { AssistantRuntime, AssistantRuntimeProvider, useThreadRuntime } from '@assistant-ui/react';

interface LanggraphAssistantRuntimeProviderProps {
  children: React.ReactNode;
  runtime: AssistantRuntime;
}

function RuntimeLogger() {
  const { getState } = useThreadRuntime();

  setTimeout(() => {
    console.log('thread runtime state', getState());
  }, 2000);

  return null;
}

export function LanggraphAssistantRuntimeProvider({
  children,
  runtime,
}: LanggraphAssistantRuntimeProviderProps) {
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <RuntimeLogger />
      {children}
    </AssistantRuntimeProvider>
  );
}
