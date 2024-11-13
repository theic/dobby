import { AssistantBuilder } from '@/components/AssistantBuilder';
import { AssistantSettings } from '@/components/AssistantSettings';
import { AssistantTemplate } from '@/components/AssistantTemplate';
import { TopBar } from '@/components/TopBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Props = {
  params: Promise<{ threadId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ThreadSettings({ params, searchParams }: Props) {
  const { threadId } = await params;
  const { assistantId } = await searchParams;

  return (
    <main className="h-dvh flex flex-col">
      <TopBar backUrl={`/thread/${threadId}?assistantId=${assistantId}`} />
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-300 flex flex-col h-[calc(50dvh-28px)] md:h-[calc(100dvh-56px)]">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-2">
              <TabsTrigger value="chat">Assistant</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="flex-1 overflow-hidden">
              <AssistantBuilder
                assistantId="builder"
                templateAssistantId={assistantId as string}
                welcomePrompts={['Build an assistant that always says hello']}
                previewMessage={`I'll help you build a new GPT. You can say something like, "make a creative who helps generate visuals for new products" or "make a software engineer who helps format my code."\n\nWhat would you like to make?`}
              />
            </TabsContent>
            <TabsContent value="settings" className="flex-1 overflow-hidden">
              <AssistantSettings assistantId={assistantId as string} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex-1 h-[calc(50dvh-28px)] md:h-[calc(100dvh-56px)]">
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
