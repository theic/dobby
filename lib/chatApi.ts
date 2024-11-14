import { LangChainMessage } from '@assistant-ui/react-langgraph';
import { Assistant, Client, Config, Metadata, Thread, ThreadState } from '@langchain/langgraph-sdk';
import { getUserId } from './firebase-store';

interface Item {
  namespace: string[];
  key: string;
  value: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

const createClient = () => {
  const apiUrl = new URL('/api', window.location.href).href;
  return new Client({
    apiUrl,
  });
};

export const createThread = async (assistantId?: string): Promise<{ thread_id: string }> => {
  const client = createClient();
  const userId = getUserId();
  const thread = await client.threads.create({
    metadata: {
      user_id: userId,
      assistant_id: assistantId,
    },
  });
  return { thread_id: thread.thread_id };
};

export const deleteThread = async (threadId: string) => {
  const client = createClient();
  return client.threads.delete(threadId);
};

export const getThreadState = async (
  threadId: string
): Promise<ThreadState<{ messages: LangChainMessage[] }>> => {
  const client = createClient();
  return client.threads.getState(threadId);
};

export const sendMessage = async (params: {
  threadId: string;
  messages: LangChainMessage[];
  assistantId: string;
  config?: Config;
}) => {
  const client = createClient();
  return client.runs.stream(params.threadId, params.assistantId, {
    input: {
      messages: params.messages,
    },
    streamMode: 'messages',
    config: params.config,
  });
};

export const createAssistant = async (params: {
  graphId: string;
  name?: string;
  config?: Config;
  metadata?: Metadata;
  assistantId?: string;
}) => {
  const client = createClient();
  return client.assistants.create({
    graphId: params.graphId,
    name: params.name,
    config: params.config,
    metadata: params.metadata,
    assistantId: params.assistantId,
  });
};

export const getAssistant = async (assistantId: string): Promise<Assistant> => {
  const client = createClient();
  return client.assistants.get(assistantId);
};

export const updateAssistant = async (
  assistantId: string,
  params: {
    graphId?: string;
    name?: string;
    config?: Config;
    metadata?: Metadata;
  }
) => {
  const client = createClient();
  return client.assistants.update(assistantId, params);
};

export const deleteAssistant = async (assistantId: string) => {
  const client = createClient();
  return client.assistants.delete(assistantId);
};

export const getAssistants = async (userId: string): Promise<Assistant[]> => {
  const client = createClient();
  return client.assistants.search({
    metadata: {
      userId,
    },
  });
};

export const getThreads = async (userId: string): Promise<Thread[]> => {
  const client = createClient();
  return client.threads.search({
    metadata: {
      user_id: userId,
    },
  });
};

export const getThreadMetadata = async (threadId: string): Promise<Metadata> => {
  const client = createClient();
  const thread = await client.threads.get(threadId);
  return thread.metadata;
};

export const getStoreItem = async (key: string): Promise<Item | null> => {
  const client = createClient();
  return client.store.getItem(['system_messages', getUserId()], key);
};
