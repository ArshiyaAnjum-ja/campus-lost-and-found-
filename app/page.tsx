'use client';

import { Header } from '@/components/header';
import { CategoryFilter } from '@/components/category-filter';
import { ItemGrid } from '@/components/item-grid';
import { StatsCards } from '@/components/stats-cards';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground text-balance">
            Campus Lost & Found
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Help reunite students with their lost belongings
          </p>
        </div>
        
        <div className="space-y-8">
          <StatsCards />
          
          <section>
            <h2 className="mb-4 text-xl font-semibold">Find Your Items</h2>
            <CategoryFilter />
          </section>
          
          <section>
            <h2 className="mb-4 text-xl font-semibold">Found Items</h2>
            <ItemGrid />
          </section>
        </div>
      </main>
      
      <footer className="border-t border-border bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Campus Lost & Found - Helping students reunite with their belongings</p>
          <p className="mt-1">Report found items responsibly. False claims may result in disciplinary action.</p>
        </div>
      </footer>
    </div>
  );
}
