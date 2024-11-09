import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

type Props = {
  assistantId: string;
};

export function AssistantSettings({ assistantId }: Props) {
  const handleSubmit = async () => {
    console.log('Submitting for assistant:', assistantId);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Assistant Name</label>
        <Input placeholder="Enter assistant name..." />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Instructions</label>
        <Textarea
          placeholder="Enter instructions for your assistant..."
          className="min-h-[150px]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Files</label>
        <div className="space-y-4">
          <Button variant="outline">Upload Files</Button>
          <div className="text-sm text-gray-500">No files uploaded yet</div>
        </div>
      </div>
    </div>
  );
}
