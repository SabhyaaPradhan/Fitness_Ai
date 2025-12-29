'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <Link
        href="/"
        className="flex items-center gap-2 font-semibold font-headline text-lg mr-4"
      >
        
        <span className="sm:inline-block">Trivion Technology</span>
      </Link>
      
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
        </Button>
         <Button asChild>
            <Link href="/signup">Sign Up</Link>
        </Button>
        <Button variant="outline">
            <Link href="/admin/login">Admin Login</Link>
        </Button>
      </div>

    </header>
  );
}
