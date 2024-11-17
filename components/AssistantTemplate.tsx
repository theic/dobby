'use client';

import { createThread, getThreadState, sendMessage } from '@/lib/chatApi';
import { getUserId } from '@/lib/localStorage';
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { useLangGraphRuntime } from '@assistant-ui/react-langgraph';
import { useEffect, useRef } from 'react';
import { WebSearchTool } from './tools/web-search/WebSearchTool';
import { ThreadTemplate } from './ui/assistant-ui/thread-template';

export function AssistantTemplate({
  assistantId,
  threadId,
  imageAttachments = false,
}: {
  assistantId: string;
  threadId: string;
  imageAttachments?: boolean;
  welcomePrompts?: string[];
  previewMessage?: string;
}) {
  const threadIdRef = useRef<string | undefined>(threadId);
  const runtime = useLangGraphRuntime({
    threadId: threadIdRef.current,
    stream: async (messages) => {
      if (!threadIdRef.current) {
        threadIdRef.current = threadId;
      }

      const response = await sendMessage({
        threadId,
        messages,
        assistantId,
        config: {
          configurable: {
            assistantId,
            userId: getUserId(),
          },
        },
      });

      return response;
    },
    onSwitchToNewThread: async () => {
      const { thread_id } = await createThread();
      threadIdRef.current = thread_id;
    },
    onSwitchToThread: async (threadId) => {
      const state = await getThreadState(threadId);
      threadIdRef.current = threadId;
      return { messages: state.values.messages || [] };
    },
    unstable_allowImageAttachments: imageAttachments,
  });

  useEffect(() => {
    if (threadId) {
      runtime.switchToThread(threadId);
    }
  }, [threadId, runtime]);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {/* TODO: Add tool support */}
      <ThreadTemplate />
      <WebSearchTool />
    </AssistantRuntimeProvider>
    // <Thread
    //   runtime={runtime}
    //   assistantMessage={{ components: { Text: MarkdownText, ToolFallback } }}
    //   welcome={{
    //     message: previewMessage,
    //     suggestions: welcomePrompts.map((prompt) => ({
    //       prompt,
    //     })),
    //   }}
    // />
  );
}
