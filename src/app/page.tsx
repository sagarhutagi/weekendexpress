import { Header } from '@/components/header';
import { WorkshopCard } from '@/components/workshop-card';
import { getCategories, getWorkshops } from '@/lib/data';
import type { Workshop } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { WorkshopList } from '@/components/workshop-list';

export default async function Home() {
  const allWorkshops = await getWorkshops();
  const categories = await getCategories();
  
  const featuredWorkshops = allWorkshops.filter(w => w.isFeatured && new Date(w.date) >= new Date()).slice(0, 3);

  return (
    <div className="flex min-h-screen w-full flex-col bg-grid-white/[0.05]">
      <Header />
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
               <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-2">
                Your Weekend Learning Companion
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Discover and join online workshops and live sessions, available only on weekends.
              </p>
               <div className="space-x-4">
                  <Button asChild>
                    <Link href="#workshops">Browse Workshops</Link>
                  </Button>
                </div>
            </div>
          </div>
        </section>

        {featuredWorkshops.length > 0 && (
          <section id="featured" className="w-full py-12 md:py-24 lg:py-32">
             <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">Featured Workshops</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredWorkshops.map((workshop: Workshop) => (
                  <WorkshopCard key={workshop.id} workshop={workshop} />
                ))}
              </div>
            </div>
          </section>
        )}
        
        <Separator className="my-8" />

        <WorkshopList allWorkshops={allWorkshops} categories={categories} />
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Weekend Express. All rights reserved.</p>
         <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
              Terms of Service
            </Link>
            <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
              Privacy
            </Link>
          </nav>
      </footer>
    </div>
  );
}
