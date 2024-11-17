'use client';

import { makeAssistantToolUI } from '@assistant-ui/react';
import { diffChars } from 'diff';
import { CheckCircle } from 'lucide-react';
import YAML from 'yaml';

type UpsertSystemArgs = {
  name: string;
  system_message: string;
};

type UpsertSystemResult = {
  success: boolean;
  system_message: string;
  name: string;
  system_message_old: string;
  name_old: string;
};

function formatYaml(content: string) {
  try {
    const obj = JSON.parse(content);
    return YAML.stringify(obj);
  } catch {
    // If not JSON, try to parse as YAML or return as is
    try {
      const obj = YAML.parse(content);
      return YAML.stringify(obj);
    } catch {
      return content;
    }
  }
}

function DiffView({ oldText, newText }: { oldText: string; newText: string }) {
  const diff = diffChars(oldText, newText);

  return (
    <pre className="w-full overflow-y-auto rounded-lg bg-gray-50 p-4 font-mono text-sm whitespace-pre-wrap break-words">
      {diff.map((part, i) => {
        let className = 'inline';
        if (part.added) {
          className += ' text-green-600 bg-green-50';
        } else if (part.removed) {
          className += ' text-red-600 bg-red-50';
        }
        return (
          <span key={i} className={className}>
            {part.value}
          </span>
        );
      })}
    </pre>
  );
}

export const UpsertSystemTool = makeAssistantToolUI<UpsertSystemArgs, string>({
  toolName: 'upsert_system',
  render: function UpsertSystemUI({ args, result }) {
    let resultObj: UpsertSystemResult;
    try {
      resultObj = result
        ? JSON.parse(result)
        : {
            success: false,
            system_message: '',
            name: '',
            system_message_old: '',
            name_old: '',
          };
    } catch {
      resultObj = {
        success: false,
        system_message: '',
        name: '',
        system_message_old: '',
        name_old: '',
      };
    }

    console.log('resultObj', resultObj);

    // Don't process if we don't have the required data
    if (!args?.name && !args?.system_message) {
      return <p className="text-gray-500">Waiting for data...</p>;
    }

    // Format the complete state as YAML for diffing
    const oldState = {
      name: resultObj.name_old,
      system_message: resultObj.system_message_old,
    };

    const newState = {
      name: resultObj.name,
      system_message: resultObj.system_message,
    };

    console.log('newState', newState);

    const formattedOldState = formatYaml(JSON.stringify(oldState));
    const formattedNewState = formatYaml(JSON.stringify(newState));

    return (
      <div className="mb-4 flex flex-col items-center gap-4">
        <div className="w-full max-w-2xl">
          <DiffView oldText={formattedOldState} newText={formattedNewState} />
        </div>

        {resultObj.success ? (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-md">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Assistant Updated Successfully</span>
          </div>
        ) : (
          <p className="text-red-500">Update failed</p>
        )}
      </div>
    );
  },
});
