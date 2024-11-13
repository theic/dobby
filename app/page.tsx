'use client';

import { createAssistant, createThread, getAssistants, getThreads } from '@/lib/chatApi';
import { auth } from '@/lib/firebase';
import { getUserId } from '@/lib/localStorage';
import { Assistant, Thread } from '@langchain/langgraph-sdk';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const [fetchedAssistants, fetchedThreads] = await Promise.all([
            getAssistants(user.uid),
            getThreads(user.uid),
          ]);
          setAssistants(fetchedAssistants);
          setThreads(fetchedThreads);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateThread = async (assistantId: string) => {
    try {
      const { thread_id } = await createThread(assistantId);
      router.push(`/thread/${thread_id}/edit?assistantId=${assistantId}`);
    } catch (error) {
      console.error('Failed to create thread:', error);
    }
  };

  const handleCreateAssistant = async () => {
    try {
      const assistantId = crypto.randomUUID();
      const userId = getUserId();

      await createAssistant({
        graphId: 'template',
        assistantId,
        metadata: {
          userId,
        },
        config: {
          configurable: {
            userId,
          },
        },
      });

      await handleCreateThread(assistantId);
    } catch (error) {
      console.error('Failed to create assistant:', error);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-dvh p-8">
        <div className="max-w-6xl mx-auto">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-8">
          <button
            onClick={handleCreateAssistant}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Create new assistant
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Assistants Column */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Assistants</h2>
            <div className="space-y-4">
              {assistants.length === 0 ? (
                <p className="text-gray-500">No assistants yet</p>
              ) : (
                assistants.map((assistant) => (
                  <button
                    key={assistant.assistant_id}
                    onClick={() => handleCreateThread(assistant.assistant_id)}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium">
                      {assistant.name || `Assistant ${assistant.assistant_id}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      Created {new Date(assistant.created_at).toLocaleDateString()}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Threads Column */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Conversations</h2>
            <div className="space-y-4">
              {threads.length === 0 ? (
                <p className="text-gray-500">No conversations yet</p>
              ) : (
                threads
                  .filter((thread) => thread.metadata?.assistant_id)
                  .map((thread) => (
                    <Link
                      key={thread.thread_id}
                      href={`/thread/${thread.thread_id}?assistantId=${thread.metadata?.assistant_id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium">Thread {thread.thread_id}</div>
                      <div className="text-sm text-gray-500">
                        Created {new Date(thread.created_at).toLocaleDateString()}
                      </div>
                    </Link>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
