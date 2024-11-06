import { MyAssistant } from "@/components/MyAssistant";

export default function Home() {
  return (
    <main className="h-dvh">
      <div className="flex h-full">
        <div className="flex-1 border-r border-gray-300">
          <MyAssistant assistantId="641a6612-ae03-4c73-91a5-eb3012815f2a" />
        </div>
        <div className="flex-1">
          <MyAssistant assistantId="ca225744-5c0c-479c-b852-382695213580" />
        </div>
      </div>
    </main>
  );
}
