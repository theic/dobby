import { MyAssistant } from '@/components/MyAssistant';

export default async function BuildAssistant({
  params
}: {
  params: { assistantId: string };
}) {
  const { assistantId } = await params;

  return (
    <main className="h-dvh">
      <div className="flex h-full">
        <div className="flex-1 border-r border-gray-300">
          <MyAssistant assistantId="2f36105d-2244-4bae-8d5b-fd7dea535029" />
        </div>
        <div className="flex-1">
          <MyAssistant assistantId={assistantId} />
        </div>
      </div>
    </main>
  );
}
