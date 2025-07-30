import { NotebookText } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Weekend Express Home">
      <div className="bg-primary text-primary-foreground p-2 rounded-md">
        <NotebookText className="h-6 w-6" />
      </div>
      <span className="text-lg font-semibold">
        Weekend Express
      </span>
    </Link>
  );
}
