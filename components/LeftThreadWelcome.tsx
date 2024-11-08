import { ThreadWelcome } from '@assistant-ui/react';
import { ThreadWelcomeSuggestions } from './ThreadWelcomeSuggestions';

export function LeftThreadWelcome() {
  return (
    <ThreadWelcome.Root>
      <ThreadWelcome.Center>
        <ThreadWelcome.Avatar />
        <ThreadWelcome.Message message="Preview your assistant here." />
      </ThreadWelcome.Center>
      <ThreadWelcomeSuggestions />
    </ThreadWelcome.Root>
  );
}
