'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart,
  Bot,
  Dumbbell,
  LayoutDashboard,
  Map,
  Menu,
  Repeat,
  Salad,
  User,
  Zap,
  LogOut,
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

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/trainer', icon: Dumbbell, label: 'AI Trainer' },
  { href: '/assistant', icon: Zap, label: 'Smart Assistant' },
  { href: '/dietician', icon: Salad, label: 'AI Dietician' },
  { href: '/buddy', icon: Bot, label: 'Virtual Buddy' },
  { href: '/tracker', icon: Repeat, label: 'Habit Tracker' },
  { href: '/performance', icon: BarChart, label: 'Performance' },
  { href: '/recommender', icon: Map, label: 'Recommender' },
];

export function AppNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect handled by AppShell
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
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Main navigation links for the application.</SheetDescription>
          </SheetHeader>
          <nav className="grid gap-6 text-lg font-medium mt-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold font-headline text-lg mb-4"
              onClick={() => setOpen(false)}
            >
              
              <span>Trivion Technology</span>
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-4 px-2.5',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
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
        href="/dashboard"
        className="flex items-center gap-2 font-semibold font-headline text-lg"
      >
        
        <span className="hidden sm:inline-block">Trivion Technology</span>
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
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
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
