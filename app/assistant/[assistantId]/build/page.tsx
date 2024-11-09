import { Assistant } from '@/components/Assistant';
import { AssistantSettings } from '@/components/AssistantSettings';
import { TopBar } from '@/components/TopBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Props = {
  params: Promise<{ assistantId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BuildAssistant({ params }: Props) {
  const { assistantId } = await params;

  return (
    <main className="h-dvh flex flex-col">
      <TopBar backUrl={`/assistant/${assistantId}`} />
      <div className="flex flex-1">
        <div className="flex-1 border-r border-gray-300 flex flex-col">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-2">
              <TabsTrigger value="chat">Assistant</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="flex-1">
              <Assistant
                assistantId="builder"
                templateAssistantId={assistantId}
                welcomePrompts={['Build an assistant that always says hello']}
                previewMessage={`I'll help you build a new GPT. You can say something like, "make a creative who helps generate visuals for new products" or "make a software engineer who helps format my code."\n\nWhat would you like to make?`}
              />
            </TabsContent>
            <TabsContent value="settings" className="flex-1">
              <AssistantSettings assistantId={assistantId} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex-1">
          <Assistant
            assistantId={assistantId}
            templateAssistantId={assistantId}
            allowImageAttachments={true}
            welcomePrompts={['Hello', 'How are you?']}
            previewMessage="Preview your assistant here."
          />
        </div>
      </div>
    </main>
  );
}
