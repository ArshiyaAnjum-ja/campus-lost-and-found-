'use client';

import Link from 'next/link';
import { Search, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Search className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none text-foreground">Campus</span>
            <span className="text-sm font-medium leading-none text-muted-foreground">Lost & Found</span>
          </div>
        </Link>
        
        <nav className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <MapPin className="h-4 w-4 mr-1.5" />
              Browse Items
            </Button>
          </Link>
          <Link href="/post">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Report Found Item</span>
              <span className="sm:hidden">Report</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
