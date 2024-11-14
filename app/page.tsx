'use client';

import {
  createAssistant,
  createThread,
  deleteAssistant,
  deleteThread,
  getAssistants,
  getThreads,
} from '@/lib/chatApi';
import { auth } from '@/lib/firebase';
import { getUserId } from '@/lib/localStorage';
import { ChatBubbleLeftIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
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

  const handleDeleteAssistant = async (assistantId: string) => {
    if (!confirm('Are you sure you want to delete this assistant?')) return;

    try {
      await deleteAssistant(assistantId);
      setAssistants(assistants.filter((a) => a.assistant_id !== assistantId));
    } catch (error) {
      console.error('Failed to delete assistant:', error);
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      await deleteThread(threadId);
      setThreads(threads.filter((t) => t.thread_id !== threadId));
    } catch (error) {
      console.error('Failed to delete thread:', error);
    }
  };

  const handleEditAssistant = (assistantId: string) => {
    // Find the most recent thread for this assistant
    const latestThread = threads
      .filter((thread) => thread.metadata?.assistant_id === assistantId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    if (latestThread) {
      // If found, open the existing thread
      router.push(`/thread/${latestThread.thread_id}/edit?assistantId=${assistantId}`);
    } else {
      // If no thread exists, create a new one
      handleCreateThread(assistantId);
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
            <ChatBubbleLeftIcon className="w-4 h-4 mr-2" />
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
                  <div
                    key={assistant.assistant_id}
                    className="w-full p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="font-medium">
                      {assistant.name || `Assistant ${assistant.assistant_id}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(assistant.created_at).toLocaleDateString()} at{' '}
                      {new Date(assistant.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleCreateThread(assistant.assistant_id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                      >
                        <ChatBubbleLeftIcon className="w-4 h-4" />
                        <span>New chat</span>
                      </button>
                      <button
                        onClick={() => handleEditAssistant(assistant.assistant_id)}
                        className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        title="Edit assistant"
                      >
                        <PencilSquareIcon className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssistant(assistant.assistant_id)}
                        className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        title="Delete assistant"
                      >
                        <TrashIcon className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
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
                    <div
                      key={thread.thread_id}
                      className="flex items-start gap-2 p-4 border border-gray-200 rounded-lg"
                    >
                      <Link
                        href={`/thread/${thread.thread_id}?assistantId=${thread.metadata?.assistant_id}`}
                        className="flex-1"
                      >
                        <div className="font-medium">
                          {assistants.find((a) => a.assistant_id === thread.metadata?.assistant_id)
                            ?.name || `Untitled`}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(thread.created_at).toLocaleDateString()} at{' '}
                          {new Date(thread.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </Link>
                      <button
                        onClick={() => handleDeleteThread(thread.thread_id)}
                        className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        title="Delete conversation"
                      >
                        <TrashIcon className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
