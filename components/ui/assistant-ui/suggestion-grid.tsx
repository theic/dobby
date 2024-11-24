import { useStore } from '@/lib/store';
import { useThreadRuntime } from '@assistant-ui/react';
import { FC } from 'react';
import { Button } from '../button';

interface Suggestion {
  prompt: string;
  label: string;
  contextMessage?: string;
  actions?: string[];
}

interface SuggestionGridProps {
  suggestions: Suggestion[];
  columns?: number;
}

const CustomSuggestion: FC<{
  suggestion: Suggestion;
  onSelect: (suggestion: Suggestion) => void;
}> = ({ suggestion, onSelect }) => {
  return (
    <Button variant="outline" size="lg" className="w-full" onClick={() => onSelect(suggestion)}>
      {suggestion.label}
    </Button>
  );
};

export const SuggestionGrid: FC<SuggestionGridProps> = ({ suggestions, columns = 2 }) => {
  const threadRuntime = useThreadRuntime();
  const store = useStore();

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    if (!threadRuntime) return;

    store.setSuggestionContext(suggestion.contextMessage);
    threadRuntime.append({
      content: [{ type: 'text', text: suggestion.prompt }],
      role: 'user',
    });
  };

  return (
    <div
      className="grid gap-4 w-full max-w-2xl"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {suggestions?.map((suggestion, index) => (
        <CustomSuggestion key={index} suggestion={suggestion} onSelect={handleSuggestionSelect} />
      ))}
    </div>
  );
};
