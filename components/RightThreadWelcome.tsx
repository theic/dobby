import { ThreadWelcome } from '@assistant-ui/react';
import { ThreadWelcomeSuggestions } from './ThreadWelcomeSuggestions';

export function RightThreadWelcome() {
  return (
    <ThreadWelcome.Root>
      <ThreadWelcome.Center>
        <ThreadWelcome.Avatar />
        <ThreadWelcome.Message message="I'm your assistant for the right window. I can help you test and validate your code." />
      </ThreadWelcome.Center>
      <ThreadWelcomeSuggestions />
    </ThreadWelcome.Root>
  );
}
