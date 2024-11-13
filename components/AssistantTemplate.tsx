'use client';

import { useLangGraphRuntime } from '@assistant-ui/react-langgraph';
import { makeMarkdownText } from '@assistant-ui/react-markdown';
import { useEffect, useRef } from 'react';

import { createThread, getThreadState, sendMessage } from '@/lib/chatApi';
import { getUserId } from '@/lib/localStorage';
import { Thread } from '@assistant-ui/react';
import { ToolFallback } from './tools/ToolFallback';

const MarkdownText = makeMarkdownText();

export function AssistantTemplate({
  assistantId,
  threadId,
  welcomePrompts = [],
  previewMessage = '',
}: {
  assistantId: string;
  threadId: string;
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
  });

  useEffect(() => {
    if (threadId) {
      runtime.switchToThread(threadId);
    }
  }, [threadId, runtime]);

  return (
    <Thread
      runtime={runtime}
      assistantMessage={{ components: { Text: MarkdownText, ToolFallback } }}
      welcome={{
        message: previewMessage,
        suggestions: welcomePrompts.map((prompt) => ({
          prompt,
        })),
      }}
    />
  );
}
