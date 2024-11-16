'use client';

import { useLangGraphRuntime } from '@assistant-ui/react-langgraph';
import { makeMarkdownText } from '@assistant-ui/react-markdown';
import { useEffect, useRef } from 'react';

import {
  createThread,
  getStoreItem,
  getThreadState,
  sendMessage,
  updateAssistant,
} from '@/lib/chatApi';
import { getUserId } from '@/lib/localStorage';
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { ThreadBuilder } from './ui/assistant-ui/thread-builder';

const MarkdownText = makeMarkdownText();

export function AssistantBuilder({
  assistantId,
  templateAssistantId,
}: {
  assistantId: string;
  templateAssistantId: string;
}) {
  const threadIdRef = useRef<string | undefined>();

  // TODO: Replace with a GCP event
  useEffect(() => {
    const checkNameUpdate = async () => {
      const storeItem = await getStoreItem(templateAssistantId);
      if (storeItem?.value.name) {
        await updateAssistant(templateAssistantId, {
          name: storeItem.value.name as string,
        });
      }
    };

    checkNameUpdate();

    const intervalId = setInterval(checkNameUpdate, 10000);

    return () => clearInterval(intervalId);
  }, [templateAssistantId]);

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

      const response = await sendMessage({
        threadId,
        messages,
        assistantId,
        config,
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
      return { messages: state.values.messages };
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {/* TODO: Add tool support */}
      <ThreadBuilder />
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
