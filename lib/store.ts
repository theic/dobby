type Store = {
  suggestionContext?: string;
  suggestions: Array<{ prompt: string; label: string }>;
  setSuggestionContext: (context?: string) => void;
  setSuggestions: (suggestions: Array<{ prompt: string; label: string }>) => void;
};

const store: Store = {
  suggestionContext: undefined,
  suggestions: [],
  setSuggestionContext: (context?: string) => {
    store.suggestionContext = context;
  },
  setSuggestions: (suggestions) => {
    store.suggestions = suggestions;
  },
};

export const useStore = () => store;
