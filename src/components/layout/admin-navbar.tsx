'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart2,
  LayoutDashboard,
  Menu,
  Users,
  Dumbbell,
  LogOut,
  User,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import React from 'react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const adminNavItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/admin/users', icon: Users, label: 'Manage Users' },
];

export function AdminNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
       <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader className="sr-only">
            <SheetTitle>Admin Menu</SheetTitle>
            <SheetDescription>Admin navigation links for the application.</SheetDescription>
          </SheetHeader>
          <nav className="grid gap-6 text-lg font-medium mt-8">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 font-semibold font-headline text-lg mb-4"
              onClick={() => setOpen(false)}
            >
              
              <span>Admin Portal</span>
            </Link>
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-4 px-2.5',
                   item.href === '#' ? 'text-muted-foreground cursor-not-allowed' :
                  (pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground')
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <Link
        href="/admin/dashboard"
        className="flex items-center gap-2 font-semibold font-headline text-lg"
      >
        
        <span className="hidden sm:inline-block">Admin Portal</span>
      </Link>
      
      <div className="flex items-center gap-2 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </header>
  );
}
