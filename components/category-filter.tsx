'use client';

import { CATEGORIES, type Category } from '@/lib/types';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import {
  Smartphone,
  Shirt,
  Watch,
  BookOpen,
  Key,
  CreditCard,
  Briefcase,
  Dumbbell,
  Package,
  LayoutGrid,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Smartphone,
  Shirt,
  Watch,
  BookOpen,
  Key,
  CreditCard,
  Briefcase,
  Dumbbell,
  Package,
};

export function CategoryFilter() {
  const { filterCategory, setFilterCategory, searchQuery, setSearchQuery } = useStore();
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search items by name, description, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Filter:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterCategory('all')}
          className="gap-1.5"
        >
          <LayoutGrid className="h-4 w-4" />
          All
        </Button>
        {CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon];
          return (
            <Button
              key={cat.value}
              variant={filterCategory === cat.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterCategory(cat.value as Category)}
              className="gap-1.5"
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span className="hidden sm:inline">{cat.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
