import { PageHeader } from './components/page-header';
import { getSession } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getWorkshops } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AdminDashboardPage() {
    const session = await getSession();
    const workshops = await getWorkshops();

    const upcomingWorkshops = workshops.filter(w => new Date(w.date) >= new Date()).length;
    const totalWorkshops = workshops.length;

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title={`Welcome, ${session?.user?.email || 'Admin'}`} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Workshops</CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                            <line x1="16" x2="16" y1="2" y2="6" />
                            <line x1="8" x2="8" y1="2" y2="6" />
                            <line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
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
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{upcomingWorkshops}</div>
                        <p className="text-xs text-muted-foreground">
                            Active and ready for attendees
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="flex justify-start">
                 <Button asChild>
                    <Link href="/admin/workshops">Manage Workshops</Link>
                </Button>
            </div>
        </div>
    );
}
