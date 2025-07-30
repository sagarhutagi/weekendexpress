import { Header } from '@/components/header';
import { WorkshopCard } from '@/components/workshop-card';
import { WorkshopFilters } from '@/components/workshop-filters';
import { getCategories, getWorkshops } from '@/lib/data';
import type { Workshop } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const allWorkshops = await getWorkshops();
  const categories = await getCategories();

  const searchTerm = typeof searchParams?.search === 'string' ? searchParams.search : undefined;
  const categoryFilter = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  const dateSort = searchParams?.sort === 'date' ? 'date' : 'default';

  const filteredWorkshops = allWorkshops
    .filter((workshop) => {
      if (!categoryFilter || categoryFilter === 'all') return true;
      return workshop.categoryId === categoryFilter;
    })
    .filter((workshop) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        workshop.title.toLowerCase().includes(searchLower) ||
        workshop.description.toLowerCase().includes(searchLower) ||
        workshop.tags.some(tag => tag.name.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      if (dateSort === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return 0; // Default sort or sort by featured could be here
    });

  const now = new Date();
  const upcomingWorkshops = filteredWorkshops.filter(w => new Date(w.date) >= now);
  const pastWorkshops = filteredWorkshops.filter(w => new Date(w.date) < now);

  const featuredWorkshops = allWorkshops.filter(w => w.isFeatured && new Date(w.date) >= now).slice(0, 3);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Your Weekend Learning Companion
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Discover and join online workshops and live sessions, available only on weekends.
              </p>
            </div>
          </div>
        </section>

        {featuredWorkshops.length > 0 && (
          <section id="featured" className="w-full py-12 md:py-24 lg:py-32 bg-background">
             <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Featured Workshops</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredWorkshops.map((workshop: Workshop) => (
                  <WorkshopCard key={workshop.id} workshop={workshop} />
                ))}
              </div>
            </div>
          </section>
        )}
        
        <Separator className="my-8" />

        <section id="workshops" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">All Workshops</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Browse our full catalog of upcoming and past events.
                </p>
            </div>
            <WorkshopFilters categories={categories} />
            
            {upcomingWorkshops.length > 0 && (
              <>
                <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mt-16 mb-8">Upcoming</h3>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {upcomingWorkshops.map((workshop: Workshop) => (
                    <WorkshopCard key={workshop.id} workshop={workshop} />
                  ))}
                </div>
              </>
            )}

            {pastWorkshops.length > 0 && (
               <>
                <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mt-16 mb-8">Past Workshops</h3>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {pastWorkshops.map((workshop: Workshop) => (
                    <WorkshopCard key={workshop.id} workshop={workshop} isPast />
                  ))}
                </div>
              </>
            )}

            {filteredWorkshops.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg">No workshops found. Try adjusting your filters.</p>
                </div>
            )}

          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Weekend Express. All rights reserved.</p>
      </footer>
    </div>
  );
}
