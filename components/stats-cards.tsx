'use client';

import { useStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Clock, CheckCircle2, Users } from 'lucide-react';

export function StatsCards() {
  const { items, claims } = useStore();
  
  const stats = [
    {
      label: 'Total Items',
      value: items.length,
      icon: Package,
      description: 'Items posted',
    },
    {
      label: 'Pending Claims',
      value: items.filter((i) => i.status === 'pending-verification').length,
      icon: Clock,
      description: 'Awaiting verification',
    },
    {
      label: 'Returned',
      value: items.filter((i) => i.status === 'returned').length,
      icon: CheckCircle2,
      description: 'Successfully reunited',
    },
    {
      label: 'Total Claims',
      value: claims.length,
      icon: Users,
      description: 'Claim requests',
    },
  ];
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
