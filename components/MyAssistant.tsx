'use client';

import { Thread } from '@assistant-ui/react';
import { useLangGraphRuntime } from '@assistant-ui/react-langgraph';
import { makeMarkdownText } from '@assistant-ui/react-markdown';
import { useRef } from 'react';

import { createThread, getThreadState, sendMessage } from '@/lib/chatApi';
import { getUserId } from '@/lib/localStorage';

const MarkdownText = makeMarkdownText();

export function MyAssistant({
  assistantId,
  templateAssistantId,
  allowImageAttachments = false
}: {
  assistantId: string;
  templateAssistantId: string;
  allowImageAttachments?: boolean;
}) {
  const threadIdRef = useRef<string | undefined>();
  const runtime = useLangGraphRuntime({
    threadId: threadIdRef.current,
    stream: async (messages) => {
      if (!threadIdRef.current) {
        const { thread_id } = await createThread();
        threadIdRef.current = thread_id;
      }
      const threadId = threadIdRef.current;

      const userId = getUserId();

      const config = {
        configurable: {
          assistantId: templateAssistantId,
          userId
        }
      };

      return sendMessage({
        threadId,
        messages,
        assistantId,
        config
      });
    },
    onSwitchToNewThread: async () => {
      const { thread_id } = await createThread();
      threadIdRef.current = thread_id;
    },
    onSwitchToThread: async (threadId) => {
      const state = await getThreadState(threadId);
      threadIdRef.current = threadId;
      return { messages: state.values.messages };
    },
    unstable_allowImageAttachments: allowImageAttachments
  });

  return (
    <Thread
      runtime={runtime}
      assistantMessage={{ components: { Text: MarkdownText } }}
    />
  );
}
