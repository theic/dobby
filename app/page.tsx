'use client';

import { createAssistant, getAssistants } from '@/lib/chatApi';
import { getUserId } from '@/lib/localStorage';
import { Assistant } from '@langchain/langgraph-sdk';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [assistants, setAssistants] = useState<Assistant[]>([]);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const userId = getUserId();
        const fetchedAssistants = await getAssistants(userId);
        setAssistants(fetchedAssistants);
      } catch (error) {
        console.error('Failed to fetch assistants:', error);
      }
    };

    fetchAssistants();
  }, []);

  const handleCreateAssistant = async () => {
    try {
      const assistantId = crypto.randomUUID();
      const userId = getUserId();

      await createAssistant({
        graphId: 'template',
        assistantId,
        metadata: {
          userId
        },
        config: {
          configurable: {
            userId
          }
        }
      });

      router.push(`/assistant/${assistantId}/build`);
    } catch (error) {
      console.error('Failed to create assistant:', error);
    }
  };

  return (
    <main className="min-h-dvh p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-8">
          <button
            onClick={handleCreateAssistant}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Create new assistant
          </button>
        </div>

        <div className="space-y-4">
          {assistants.map((assistant) => (
            <Link
              key={assistant.assistant_id}
              href={`/assistant/${assistant.assistant_id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Assistant {assistant.assistant_id}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
