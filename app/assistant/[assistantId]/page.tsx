import { Assistant } from '@/components/MyAssistant';

type Props = {
  params: Promise<{ assistantId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AssistantPage({ params }: Props) {
  const { assistantId } = await params;

  return (
    <main className="h-dvh">
      <div className="flex h-full">
        <div className="flex-1">
          <Assistant
            assistantId={assistantId}
            templateAssistantId={assistantId}
            allowImageAttachments={true}
          />
        </div>
      </div>
    </main>
  );
}
