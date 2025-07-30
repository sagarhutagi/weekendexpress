'use client';

import { useState, useMemo } from 'react';
import { WorkshopFilters } from './workshop-filters';
import { WorkshopCard } from './workshop-card';
import type { Workshop, Category } from '@/lib/types';

interface WorkshopListProps {
    allWorkshops: Workshop[];
    categories: Category[];
}

export function WorkshopList({ allWorkshops, categories }: WorkshopListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [dateSort, setDateSort] = useState('default');

    const filteredWorkshops = useMemo(() => {
        return allWorkshops
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
                // a default sort could be implemented here, maybe by featured status and then date
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
    }, [allWorkshops, categoryFilter, searchTerm, dateSort]);
    
    const now = new Date();
    const upcomingWorkshops = filteredWorkshops.filter(w => new Date(w.date) >= now);
    const pastWorkshops = filteredWorkshops.filter(w => new Date(w.date) < now);


    return (
        <section id="workshops" className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">All Workshops</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Browse our full catalog of upcoming and past events.
                    </p>
                </div>
                <WorkshopFilters 
                    categories={categories}
                    onSearchChange={setSearchTerm}
                    onCategoryChange={setCategoryFilter}
                    onSortChange={setDateSort}
                />
                
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
    );
}
