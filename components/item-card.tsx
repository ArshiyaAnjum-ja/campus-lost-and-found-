'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { CATEGORIES, type LostItem as LostItemType } from '@/lib/types';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  ImageIcon,
} from 'lucide-react';
import { ClaimDialog } from './claim-dialog';
import { ViewClaimsDialog } from './view-claims-dialog';

interface ItemCardProps {
  item: LostItemType;
}

const statusConfig = {
  lost: {
    label: 'Available',
    variant: 'default' as const,
    icon: AlertCircle,
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  'pending-verification': {
    label: 'Pending Verification',
    variant: 'secondary' as const,
    icon: Clock,
    className: 'bg-warning/10 text-warning-foreground border-warning/20',
  },
  claimed: {
    label: 'Claimed',
    variant: 'secondary' as const,
    icon: CheckCircle2,
    className: 'bg-accent/10 text-accent border-accent/20',
  },
  returned: {
    label: 'Returned',
    variant: 'outline' as const,
    icon: CheckCircle2,
    className: 'bg-accent/10 text-accent-foreground border-accent/30',
  },
};

export function ItemCard({ item }: ItemCardProps) {
  const [claimOpen, setClaimOpen] = useState(false);
  const [viewClaimsOpen, setViewClaimsOpen] = useState(false);
  const { getClaimsForItem } = useStore();
  
  const category = CATEGORIES.find((c) => c.value === item.category);
  const status = statusConfig[item.status];
  const StatusIcon = status.icon;
  const claims = getClaimsForItem(item.id);
  const pendingClaims = claims.filter((c) => c.status === 'pending');
  
  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-[4/3] bg-muted">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge className={`gap-1 ${status.className}`}>
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
          </div>
          {pendingClaims.length > 0 && item.status !== 'returned' && (
            <div className="absolute top-2 left-2">
              <Badge variant="destructive" className="gap-1">
                {pendingClaims.length} claim{pendingClaims.length > 1 ? 's' : ''} pending
              </Badge>
            </div>
          )}
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight text-balance">{item.title}</h3>
            {category && (
              <Badge variant="outline" className="shrink-0 text-xs">
                {category.label}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 pb-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>Found {formatDistanceToNow(new Date(item.dateFound), { addSuffix: true })}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4 shrink-0" />
              <span className="truncate">Posted by {item.postedBy}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="gap-2 pt-0">
          {item.status === 'lost' && (
            <Button className="flex-1" onClick={() => setClaimOpen(true)}>
              Claim This Item
            </Button>
          )}
          {item.status === 'pending-verification' && (
            <>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setViewClaimsOpen(true)}
              >
                View Claims ({pendingClaims.length})
              </Button>
              <Button 
                variant="secondary"
                className="flex-1"
                onClick={() => setClaimOpen(true)}
              >
                Also Claim
              </Button>
            </>
          )}
          {item.status === 'returned' && (
            <div className="flex w-full items-center justify-center gap-2 py-2 text-accent">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Successfully Returned</span>
            </div>
          )}
        </CardFooter>
      </Card>
      
      <ClaimDialog item={item} open={claimOpen} onOpenChange={setClaimOpen} />
      <ViewClaimsDialog item={item} open={viewClaimsOpen} onOpenChange={setViewClaimsOpen} />
    </>
  );
}
