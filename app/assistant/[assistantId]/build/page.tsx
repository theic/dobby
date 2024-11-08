import { Assistant } from '@/components/MyAssistant';

type Props = {
  params: Promise<{ assistantId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BuildAssistant({ params }: Props) {
  const { assistantId } = await params;

  return (
    <main className="h-dvh">
      <div className="flex h-full">
        <div className="flex-1 border-r border-gray-300">
          <Assistant
            assistantId="builder"
            templateAssistantId={assistantId}
            welcomePrompts={['Build an assistant that always says hello']}
            previewMessage={`I'll help you build a new GPT. You can say something like, "make a creative who helps generate visuals for new products" or "make a software engineer who helps format my code."\n\nWhat would you like to make?`}
          />
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
