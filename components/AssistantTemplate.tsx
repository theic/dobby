'use client';

import { createThread, getThreadState, sendMessage } from '@/lib/chatApi';
import { getUserId } from '@/lib/localStorage';
import { useStore } from '@/lib/store';
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { useLangGraphRuntime } from '@assistant-ui/react-langgraph';
import { useEffect, useRef } from 'react';
import { InlineControl } from './tools/inline-control/InlineControl';
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
  previewMessage?: string;
}) {
  const threadIdRef = useRef<string | undefined>(threadId);
  const store = useStore();

  const runtime = useLangGraphRuntime({
    threadId: threadIdRef.current,
    stream: async (messages) => {
      if (!threadIdRef.current) {
        threadIdRef.current = threadId;
      }

      const params = {
        threadId,
        messages: messages.map((message) => ({
          ...message,
        })),
        assistantId,
        config: {
          configurable: {
            assistantId,
            userId: getUserId(),
            inlineOptionContext: store.suggestionContext ?? '',
          },
        },
      };

      store.setSuggestionContext('');

      console.debug('sending message params', params);

      const response = await sendMessage(params);

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

  console.debug('Current suggestion context:', store.suggestionContext);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ThreadTemplate />
      <WebSearchTool />
      <InlineControl />
    </AssistantRuntimeProvider>
  );
}
