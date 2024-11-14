import { AssistantTemplate } from '@/components/AssistantTemplate';
import { TopBar } from '@/components/TopBar';

type Props = {
  params: Promise<{ threadId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ThreadPage({ params, searchParams }: Props) {
  const { threadId } = await params;
  const { assistantId } = await searchParams;

  return (
    <main className="h-dvh flex flex-col">
      <TopBar
        backUrl="/"
        showEdit
        editUrl={`/thread/${threadId}/edit?assistantId=${assistantId}`}
      />
      <div className="flex flex-1">
        <div className="flex-1">
          <AssistantTemplate
            threadId={threadId}
            assistantId={assistantId as string}
            imageAttachments={true}
          />
        </div>
      </div>
    </main>
  );
}
