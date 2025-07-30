import { PageHeader } from './components/page-header';
import { getSession } from '@/lib/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategories, getWorkshops } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CalendarCheck, CalendarClock, Package } from 'lucide-react';
import { DashboardCharts } from './components/dashboard-charts';
import type { Category } from '@/lib/types';

export default async function AdminDashboardPage() {
    const session = await getSession();
    const workshops = await getWorkshops();
    const categories = await getCategories();

    const upcomingWorkshopsCount = workshops.filter(w => new Date(w.date) >= new Date()).length;
    const totalWorkshops = workshops.length;

    // Prepare data for charts
    const categoryCounts = categories.map(category => ({
        name: category.name,
        total: workshops.filter(w => w.categoryId === category.id).length
    })).filter(c => c.total > 0);

    const priceBreakdown = [
        { name: 'Paid', value: workshops.filter(w => w.price !== 'Free' && w.price > 0).length, fill: 'var(--color-paid)' },
        { name: 'Free', value: workshops.filter(w => w.price === 'Free' || w.price === 0).length, fill: 'var(--color-free)' }
    ];

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title={`Welcome, ${session?.user?.email || 'Admin'}`} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Workshops</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalWorkshops}</div>
                        <p className="text-xs text-muted-foreground">
                            All workshops created
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Workshops</CardTitle>
                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{upcomingWorkshopsCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Active and ready for attendees
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Workshops</CardTitle>
                         <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalWorkshops - upcomingWorkshopsCount}</div>
                        <p className="text-xs text-muted-foreground">
                           Successfully conducted
                        </p>
                    </CardContent>
                </Card>
            </div>

            <DashboardCharts categoryData={categoryCounts} priceData={priceBreakdown} />
            
            <div className="flex justify-start">
                 <Button asChild>
                    <Link href="/admin/workshops">Manage Workshops</Link>
                </Button>
            </div>
        </div>
    );
}
