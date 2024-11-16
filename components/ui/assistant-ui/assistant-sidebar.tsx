'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import type { FC, PropsWithChildren } from 'react';

import { ThreadBuilder } from '@/components/ui/assistant-ui/thread-builder';

export const MyAssistantSidebar: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>{children}</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <ThreadBuilder />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
