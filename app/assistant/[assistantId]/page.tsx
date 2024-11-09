import { Assistant } from '@/components/Assistant';
import { TopBar } from '@/components/TopBar';

type Props = {
  params: Promise<{ assistantId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AssistantPage({ params }: Props) {
  const { assistantId } = await params;

  return (
    <main className="h-dvh flex flex-col">
      <TopBar
        backUrl="/"
        showEdit
        editUrl={`/assistant/${assistantId}/build`}
      />
      <div className="flex flex-1">
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
