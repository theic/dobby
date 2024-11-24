import { AssistantBuilder } from '@/components/AssistantBuilder';
import { AssistantTemplate } from '@/components/AssistantTemplate';
import { TopBar } from '@/components/TopBar';

type Props = {
  params: Promise<{ threadId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ThreadSettings({ params, searchParams }: Props) {
  const { threadId } = await params;
  const { assistantId } = await searchParams;

  return (
    <main className="h-dvh flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="fixed top-0 left-0 right-0 z-10">
        <TopBar backUrl="/" />
      </div>
      <div className="flex-1 flex flex-col md:flex-row min-h-0 mt-14">
        <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-200 overflow-auto bg-white/70 backdrop-blur-sm">
          <AssistantBuilder assistantId="builder" templateAssistantId={assistantId as string} />
        </div>
        <div className="flex-1 overflow-auto bg-white/70 backdrop-blur-sm">
          <AssistantTemplate
            threadId={threadId}
            assistantId={assistantId as string}
            previewMessage="Preview your assistant here."
          />
        </div>
      </div>
    </main>
  );
}
