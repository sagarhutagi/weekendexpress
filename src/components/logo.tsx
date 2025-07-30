import { NotebookText } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Weekend Express Home">
      <NotebookText className="h-6 w-6 text-primary-foreground" />
      <span className="text-lg font-semibold text-primary-foreground">
        Weekend Express
      </span>
    </Link>
  );
}
