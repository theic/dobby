'use client';

import { useLangGraphRuntime } from '@assistant-ui/react-langgraph';
import { makeMarkdownText } from '@assistant-ui/react-markdown';
import { useRef } from 'react';

import { createThread, getThreadState, sendMessage } from '@/lib/chatApi';
import { getUserId } from '@/lib/localStorage';
import { Thread } from '@assistant-ui/react';
import { ToolFallback } from './tools/ToolFallback';

const MarkdownText = makeMarkdownText();

export function AssistantBuilder({
  assistantId,
  templateAssistantId,
  welcomePrompts = [],
  previewMessage = '',
}: {
  assistantId: string;
  templateAssistantId: string;
  welcomePrompts?: string[];
  previewMessage?: string;
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
          userId,
        },
      };

      return sendMessage({
        threadId,
        messages,
        assistantId,
        config,
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
  });

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
      // tools={[UpsertSystemTool]}
      // components={{
      //   ThreadWelcome: () =>
      //     welcomePosition === 'left' ? (
      //       <LeftThreadWelcome />
      //     ) : (
      //       <RightThreadWelcome />
      //     )
      // }}
    />
  );
}
