export interface Assistant {
  assistantId: string;
  name: string;
  graphId: string;
  userId: string;
  createdAt: string;
}

export interface Thread {
  threadId: string;
  assistantId: string;
  userId: string;
  createdAt: string;
}

const STORAGE_KEYS = {
  USER_ID: 'userId',
  ASSISTANTS: 'assistants',
  THREADS: 'threads'
} as const;

export function getUserId(): string {
  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }

  return userId;
}

export function saveAssistant(assistant: Assistant): void {
  const assistants = getAssistants();
  assistants.push(assistant);
  localStorage.setItem(STORAGE_KEYS.ASSISTANTS, JSON.stringify(assistants));
}

export function getAssistants(): Assistant[] {
  const assistants = localStorage.getItem(STORAGE_KEYS.ASSISTANTS);
  return assistants ? JSON.parse(assistants) : [];
}

export function saveThread(thread: Thread): void {
  const threads = getThreads();
  threads.push(thread);
  localStorage.setItem(STORAGE_KEYS.THREADS, JSON.stringify(threads));
}

export function getThreads(): Thread[] {
  const threads = localStorage.getItem(STORAGE_KEYS.THREADS);
  return threads ? JSON.parse(threads) : [];
}
