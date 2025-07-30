'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, NotebookText, Tag, LogOut, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/session';
import { Logo } from '@/components/logo';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/workshops', label: 'Workshops', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: NotebookText },
    { href: '/admin/tags', label: 'Tags', icon: Tag },
];

export function AdminSidebar() {
    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();
    }

    return (
        <aside className="hidden md:flex flex-col w-64 border-r bg-card p-4">
            <div className="flex items-center mb-8 p-2">
                <Logo />
            </div>
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                    return (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant={isActive ? 'secondary' : 'ghost'}
                                className="w-full justify-start gap-2"
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Button>
                        </Link>
                    )
                })}
            </nav>
            <form action={handleLogout}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </form>
        </aside>
    );
}
