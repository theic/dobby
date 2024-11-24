import { SuggestionGrid } from '@/components/ui/assistant-ui/suggestion-grid';
import { useStore } from '@/lib/store';
import { makeAssistantToolUI } from '@assistant-ui/react';

type InlineControlArgs = {
  contextMessage: string;
};

type InlineControlResult = {
  inlineOptions: string[];
  mainOptions: string[];
};

export const InlineControl = makeAssistantToolUI<InlineControlArgs, string>({
  toolName: 'inline_action',
  render: function InlineControlUI({ result, args }) {
    const { setSuggestions } = useStore();

    let resultParsed: InlineControlResult;
    try {
      resultParsed = result ? JSON.parse(result) : {};
    } catch {
      return (
        <div className="mb-4">
          <p className="text-red-500">Error parsing search results: {result}</p>
        </div>
      );
    }

    console.debug('inlineOptions', resultParsed.inlineOptions);
    console.debug('mainOptions', resultParsed.mainOptions);

    setSuggestions(
      resultParsed.mainOptions?.map((option) => ({
        label: option.length > 30 ? option.slice(0, 30) + '...' : option,
        prompt: option,
      }))
    );

    return (
      <div>
        <SuggestionGrid
          suggestions={resultParsed.inlineOptions?.map((action) => ({
            label: action.length > 30 ? action.slice(0, 30) + '...' : action,
            prompt: action,
            contextMessage: args.contextMessage,
            actions: resultParsed.inlineOptions,
          }))}
        />
      </div>
    );
  },
});
