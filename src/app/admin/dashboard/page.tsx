'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, Users } from 'lucide-react';

const adminFeatures = [
    {
        title: "User Analytics",
        description: "View user engagement, sign-ups, and activity.",
        href: "/admin/analytics",
        icon: BarChart2,
    },
    {
        title: "Manage Users",
        description: "Browse, edit, or manage user accounts and permissions.",
        href: "/admin/users",
        icon: Users,
    }
]

export default function AdminDashboardPage() {
    return (
        <div className="flex flex-col gap-8">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold font-headline tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome, Admin. Manage your application from here.
                </p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {adminFeatures.map((feature) => (
                    <Card key={feature.title} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                                <feature.icon className="w-6 h-6 text-primary" />
                                {feature.title}
                            </CardTitle>
                            <CardDescription>{feature.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-end">
                             <Button asChild className="w-full mt-4" disabled={feature.href === '#'}>
                                <Link href={feature.href}>
                                    Go to {feature.title}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
