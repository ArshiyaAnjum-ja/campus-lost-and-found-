'use client';

import { useStore } from '@/lib/store';
import { ItemCard } from './item-card';
import { Package } from 'lucide-react';

export function ItemGrid() {
  const { getFilteredItems } = useStore();
  const items = getFilteredItems();
  
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No items found</h3>
        <p className="mt-1 text-muted-foreground">
          Try adjusting your search or filters, or check back later.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
