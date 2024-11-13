import { ArrowLeft, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

type TopBarProps = {
  showPublish?: boolean;
  showEdit?: boolean;
  backUrl?: string;
  editUrl?: string;
};

export function TopBar({ showPublish = false, showEdit = false, backUrl, editUrl }: TopBarProps) {
  return (
    <div className="h-14 border-b border-gray-300 px-4 flex items-center justify-between">
      <div>
        {backUrl && (
          <Link href={backUrl}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        )}
      </div>
      <div>
        {showEdit && editUrl && (
          <Link href={editUrl}>
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        )}
        {showPublish && <Button size="sm">Publish</Button>}
      </div>
    </div>
  );
}
