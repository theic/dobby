'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { makeAssistantToolUI } from '@assistant-ui/react';
import { ExternalLinkIcon } from 'lucide-react';

type WebSearchArgs = {
  query: string;
};

type WebSearchResult = {
  title: string;
  description: string;
  url: string;
  content: string;
};

export const WebSearchTool = makeAssistantToolUI<WebSearchArgs, string>({
  toolName: 'web_search',
  render: function WebSearchUI({ args, result }) {
    console.log('args', args);
    console.log('result', result);

    let resultParsed: WebSearchResult[];
    try {
      resultParsed = result ? JSON.parse(result) : [];
    } catch (e) {
      return (
        <div className="mb-4">
          <p className="text-red-500">Error parsing search results: {result}</p>
        </div>
      );
    }

    return (
      <div className="mb-4 space-y-4">
        <div className="text-sm text-muted-foreground">Search query: "{args.query}"</div>

        {resultParsed.map((result: WebSearchResult) => (
          <Card key={result.url}>
            <CardHeader>
              <CardTitle className="text-lg">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-blue-600"
                >
                  {result.title}
                  <ExternalLinkIcon className="h-4 w-4" />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{result.content}</p>
              <p className="mt-2 text-xs text-muted-foreground truncate">{result.url}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  },
});
