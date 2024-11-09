'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { makeAssistantToolUI } from '@assistant-ui/react';
import { CheckCircle } from 'lucide-react';

type UpsertSystemArgs = {
  message: string;
};

type UpsertSystemResult = {
  success: boolean;
  message: string;
};

export const UpsertSystemTool = makeAssistantToolUI<UpsertSystemArgs, string>({
  toolName: 'upsertSystemMessage',
  render: function UpsertSystemUI({ part: { args, result } }) {
    let resultObj: UpsertSystemResult;
    try {
      resultObj = result ? JSON.parse(result) : { success: false, message: '' };
    } catch (e) {
      resultObj = { success: false, message: result || 'Error parsing result' };
    }

    return (
      <div className="mb-4 flex flex-col items-center gap-2">
        <pre className="whitespace-pre-wrap break-all text-center">
          upsert_system({JSON.stringify(args)})
        </pre>
        {resultObj.success ? (
          <Card className="mx-auto w-full max-w-md">
            <CardHeader className="text-center">
              <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
              <CardTitle className="text-2xl font-bold text-green-700">
                System Message Updated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-green-600">{resultObj.message}</p>
            </CardContent>
          </Card>
        ) : (
          <p className="text-red-500">{resultObj.message}</p>
        )}
      </div>
    );
  }
});
