'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { AppNavbar } from '@/components/layout/app-navbar';
import { useUser } from '@/firebase';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminNavbar } from './admin-navbar';

const unauthenticatedRoutes = ['/login', '/signup', '/', '/admin/login'];
const appRoutes = ['/dashboard'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  const isAppRoute = !unauthenticatedRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    if (isUserLoading) return; // Wait until user state is determined

    if (user && unauthenticatedRoutes.includes(pathname) && !pathname.startsWith('/admin')) {
      router.replace('/dashboard');
    } else if (!user && isAppRoute && !isAdminRoute) {
      router.replace('/login');
    }
    // Basic protection for admin routes, can be expanded with roles.
    else if (!user && isAdminRoute && pathname !== '/admin/login') {
        router.replace('/admin/login')
    } else if (user && pathname === '/admin/login') {
        router.replace('/admin/dashboard')
    }

  }, [user, isUserLoading, pathname, router, isAppRoute, isAdminRoute]);
  
  if (isUserLoading && (isAppRoute || isAdminRoute)) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-6 w-32 hidden sm:block" />
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-8">
           <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }


  if (!isAppRoute) {
    if (pathname.startsWith('/admin')) {
      // Admin routes have a minimal layout, no main navbar
       return <main className="flex-1">{children}</main>;
    }
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  // If it's an app route (user or admin) and user is logged in
  if (user) {
    if (isAdminRoute) {
        return (
            <div className="min-h-screen flex flex-col">
                <AdminNavbar />
                <main className="flex-1 p-4 sm:px-6 sm:py-8">{children}</main>
            </div>
        )
    }
    return (
      <div className="min-h-screen flex flex-col">
        <AppNavbar />
        <main className="flex-1 p-4 sm:px-6 sm:py-8">{children}</main>
      </div>
    );
  }
  
  return null; 
}
