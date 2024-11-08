import { ThreadWelcome } from '@assistant-ui/react';
import { FC } from 'react';

export const ThreadWelcomeSuggestions: FC = () => {
  return (
    <div className="aui-thread-welcome-suggestion-container">
      <ThreadWelcome.Suggestion
        suggestion={{
          text: 'Write me a poem about the weather',
          prompt: 'Write me a poem about the weather'
        }}
      />
      <ThreadWelcome.Suggestion
        suggestion={{
          text: 'What is assistant-ui?',
          prompt: 'What is assistant-ui?'
        }}
      />
    </div>
  );
};
