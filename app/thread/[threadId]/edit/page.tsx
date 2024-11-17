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
    <main className="min-h-dvh flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <TopBar backUrl="/" />
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col h-[calc(50dvh-28px)] md:h-[calc(100dvh-56px)] bg-white/70 backdrop-blur-sm">
          <AssistantBuilder assistantId="builder" templateAssistantId={assistantId as string} />
        </div>
        <div className="flex-1 h-[calc(50dvh-28px)] md:h-[calc(100dvh-56px)] bg-white/70 backdrop-blur-sm">
          <AssistantTemplate
            threadId={threadId}
            assistantId={assistantId as string}
            welcomePrompts={['Hello', 'How are you?']}
            previewMessage="Preview your assistant here."
          />
        </div>
      </div>
    </main>
  );
}
