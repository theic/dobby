import { ArrowLeft, Pencil, Rocket } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Button } from './ui/button';

type TopBarProps = {
  showPublish?: boolean;
  showEdit?: boolean;
  backUrl?: string;
  editUrl?: string;
  children?: ReactNode;
};

export function TopBar({
  showPublish = false,
  showEdit = false,
  backUrl,
  editUrl,
  children,
}: TopBarProps) {
  return (
    <div className="h-14 border-b border-gray-200 px-4 flex items-center justify-between bg-white shadow-sm">
      <div className="flex items-center gap-2">
        {backUrl && (
          <Link href={backUrl}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        )}
        <span className="font-medium text-gray-600">Messaging.Quest</span>
      </div>
      <div className="flex items-center gap-2">
        {children}
        {showEdit && editUrl && (
          <Link href={editUrl}>
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        )}
        {showPublish && (
          <Button size="sm">
            <Rocket className="h-4 w-4 mr-2" />
            Publish
          </Button>
        )}
      </div>
    </div>
  );
}
