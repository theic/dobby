import { Client, ThreadState, Assistant, Config, Metadata } from "@langchain/langgraph-sdk";
import { LangChainMessage } from "@assistant-ui/react-langgraph";

const createClient = () => {
  const apiUrl =
    process.env["NEXT_PUBLIC_LANGGRAPH_API_URL"] ||
    new URL("/api", window.location.href).href;
  return new Client({
    apiUrl,
  });
};

export const createThread = async () => {
  const client = createClient();
  return client.threads.create();
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
}) => {
  const client = createClient();
  return client.runs.stream(
    params.threadId,
    params.assistantId,
    {
      input: {
        messages: params.messages,
      },
      streamMode: "messages",
    }
  );
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
