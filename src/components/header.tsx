import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" className="mr-6 md:hidden">
                    <MenuIcon/>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                    <div className="p-2">
                      <Logo />
                    </div>
                    <Link href="#featured" className="block px-2 py-1 text-lg">Featured</Link>
                    <Link href="#workshops" className="block px-2 py-1 text-lg">Workshops</Link>
                </nav>
            </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="hidden md:flex md:items-center md:gap-4 lg:gap-6">
            <Link href="#featured" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Featured
            </Link>
            <Link href="#workshops" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Workshops
            </Link>
             <Button asChild variant="secondary">
                <Link href="/admin">Admin Login</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
