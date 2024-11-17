/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  BranchPickerPrimitiveRootProps,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from '@assistant-ui/react';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { ToolFallback } from '@/components/tools/ToolFallback';
import { TooltipIconButton } from '@/components/ui/assistant-ui/tooltip-icon-button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { makeMarkdownText } from '@assistant-ui/react-markdown';
import {
  ArrowDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  RefreshCwIcon,
  SendHorizontalIcon,
} from 'lucide-react';

const MarkdownText = makeMarkdownText();

const AutoTypingMessage =
  'I\'ll help you build a new GPT. You can say something like, "make a creative who helps generate visuals for new products" or "make a software engineer who helps format my code."';

// Add the interface for props
interface ThreadBuilderProps {
  autoType?: boolean;
}

// Update the component to accept props
export const ThreadBuilder: FC<ThreadBuilderProps> = ({ autoType = false }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    if (!autoType) return;

    // Start typing effect after a short delay
    const timeout = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;

      const typingInterval = setInterval(() => {
        if (currentIndex < AutoTypingMessage.length) {
          setCurrentMessage(AutoTypingMessage.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          // Small delay before "sending" the message
          setTimeout(() => {
            setIsTyping(false);
            // Simulate clicking the send button by dispatching a click event
            const sendButton = document.querySelector('[data-composer-send]');
            if (sendButton instanceof HTMLElement) {
              sendButton.click();
            }
          }, 500);
        }
      }, 15);

      return () => clearInterval(typingInterval);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [autoType]);

  return (
    <ThreadPrimitive.Root className="bg-neutral-100 h-full">
      <ThreadPrimitive.Viewport className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8">
        <MyThreadWelcome />

        <ThreadPrimitive.Messages
          components={{
            UserMessage: MyUserMessage,
            EditComposer: MyEditComposer,
            AssistantMessage: MyAssistantMessage,
          }}
        />

        <div className="min-h-8 flex-grow" />

        <div className="sticky bottom-0 mt-3 flex w-full max-w-2xl flex-col items-center justify-end rounded-t-lg bg-inherit pb-4">
          <MyThreadScrollToBottom />
          <MyComposer isTyping={isTyping} currentMessage={currentMessage} />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const MyThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-8 rounded-full border-neutral-300 bg-white/80 text-neutral-600 hover:bg-white hover:text-neutral-800 disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const MyThreadWelcome: FC = () => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex flex-grow flex-col items-center justify-center">
        <Avatar className="bg-neutral-200 text-neutral-700">
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
        <p className="mt-4 font-medium text-neutral-600 max-w-xl text-center">
          I&apos;ll help you build a new GPT. You can say something like, &quot;make a creative who
          helps generate visuals for new products&quot; or &quot;make a software engineer who helps
          format my code.&quot;
        </p>
      </div>
    </ThreadPrimitive.Empty>
  );
};

const MyComposer: FC<{ isTyping?: boolean; currentMessage?: string }> = ({
  isTyping = false,
  currentMessage = '',
}) => {
  const [userInput, setUserInput] = useState('');

  return (
    <ComposerPrimitive.Root
      className="focus-within:border-neutral-400 flex w-full flex-wrap items-end rounded-lg border border-neutral-300 bg-white/90 px-2.5 shadow-sm backdrop-blur-sm transition-colors ease-in"
      // onSubmit={(e) => {
      //   // Prevent default form submission
      //   e.preventDefault();
      //   // Clear input after submission
      //   setUserInput('');
      // }}
    >
      <ComposerPrimitive.Input
        autoFocus
        // value={isTyping ? currentMessage : userInput}
        onChange={(e) => !isTyping && setUserInput(e.target.value)}
        placeholder="Write a message..."
        rows={1}
        className="placeholder:text-neutral-400 text-neutral-700 max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
        readOnly={isTyping}
      />
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            data-composer-send
            tooltip="Send"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in bg-neutral-200/80 text-neutral-700 hover:bg-neutral-300"
            disabled={isTyping}
          >
            <SendHorizontalIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <TooltipIconButton
            tooltip="Cancel"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in bg-neutral-700/70 text-neutral-300 hover:bg-neutral-700"
          >
            <CircleStopIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </ComposerPrimitive.Root>
  );
};

const MyUserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid w-full max-w-2xl auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 py-4">
      <MyUserActionBar />

      <div className="bg-white text-neutral-800 col-start-2 row-start-1 max-w-xl break-words rounded-3xl px-5 py-2.5 shadow-sm">
        <MessagePrimitive.Content />
      </div>

      <MyBranchPicker className="col-span-full col-start-1 row-start-2 -mr-1 justify-end" />
    </MessagePrimitive.Root>
  );
};

const MyUserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="col-start-1 mr-3 mt-2.5 flex flex-col items-end"
    >
      {/* <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton
          tooltip="Edit"
          className="text-neutral-400 hover:text-neutral-300 hover:bg-neutral-700/50"
        >
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit> */}
    </ActionBarPrimitive.Root>
  );
};

const MyEditComposer: FC = () => {
  return (
    <ComposerPrimitive.Root className="bg-white/90 my-4 flex w-full max-w-2xl flex-col gap-2 rounded-xl border border-neutral-300 backdrop-blur-sm shadow-sm">
      <ComposerPrimitive.Input className="text-neutral-700 flex h-8 w-full resize-none border-none bg-transparent p-4 pb-0 outline-none focus:ring-0" />

      <div className="mx-3 mb-3 flex items-center justify-center gap-2 self-end">
        <ComposerPrimitive.Cancel asChild>
          <Button
            variant="ghost"
            className="text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100"
          >
            Cancel
          </Button>
        </ComposerPrimitive.Cancel>
        <ComposerPrimitive.Send asChild>
          <Button className="bg-neutral-200 text-neutral-700 hover:bg-neutral-300">Send</Button>
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
};

const MyAssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="relative grid w-full max-w-2xl grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] py-4">
      <Avatar className="col-start-1 row-span-full row-start-1 mr-4 bg-neutral-200 text-neutral-700">
        <AvatarFallback>A</AvatarFallback>
      </Avatar>

      <div className="bg-white text-neutral-800 col-span-2 col-start-2 row-start-1 my-1.5 max-w-xl break-words rounded-xl px-4 py-2 leading-7 shadow-sm">
        <MessagePrimitive.Content
          components={{ Text: MarkdownText, tools: { Fallback: ToolFallback } }}
        />
      </div>

      <MyAssistantActionBar />

      <MyBranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />
    </MessagePrimitive.Root>
  );
};

const MyAssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="text-neutral-500 data-[floating]:bg-white/90 col-start-3 row-start-2 -ml-1 flex gap-1 data-[floating]:absolute data-[floating]:rounded-md data-[floating]:border data-[floating]:border-neutral-200 data-[floating]:p-1 data-[floating]:shadow-sm data-[floating]:backdrop-blur-sm"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy" className="hover:text-neutral-700 hover:bg-neutral-100">
          <MessagePrimitive.If copied>
            <CheckIcon />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton
          tooltip="Refresh"
          className="hover:text-neutral-300 hover:bg-neutral-700/50"
        >
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const MyBranchPicker: FC<BranchPickerPrimitiveRootProps> = ({ className, ...rest }) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn('text-neutral-500 inline-flex items-center text-xs', className)}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton
          tooltip="Previous"
          className="hover:text-neutral-700 hover:bg-neutral-100"
        >
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton
          tooltip="Next"
          className="hover:text-neutral-300 hover:bg-neutral-700/50"
        >
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

const CircleStopIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      width="16"
      height="16"
    >
      <rect width="10" height="10" x="3" y="3" rx="2" />
    </svg>
  );
};
