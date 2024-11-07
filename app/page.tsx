'use client';

import { createAssistant } from "@/lib/chatApi";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleCreateAssistant = async () => {
    try {
      const assistantId = crypto.randomUUID();

      await createAssistant({
        graphId: "template",
        name: "New Assistant 1",
        assistantId,
      });
      router.push(`/assistant/${assistantId}/build`);
    } catch (error) {
      console.error('Failed to create assistant:', error);
    }
  };

  return (
    <main className="h-dvh flex items-center justify-center">
      <button
        onClick={handleCreateAssistant}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create new assistant
      </button>
    </main>
  );
}
