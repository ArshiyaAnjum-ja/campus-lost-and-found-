'use client';

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { type LostItem, type ClaimRequest } from '@/lib/types';
import { useStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ImageIcon,
} from 'lucide-react';

interface ViewClaimsDialogProps {
  item: LostItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig = {
  pending: {
    label: 'Pending Review',
    className: 'bg-warning/10 text-warning-foreground border-warning/20',
    icon: Clock,
  },
  approved: {
    label: 'Approved',
    className: 'bg-accent/10 text-accent border-accent/20',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
    icon: XCircle,
  },
};

function ClaimCard({ claim, onApprove, onReject }: { 
  claim: ClaimRequest; 
  onApprove: () => void; 
  onReject: () => void;
}) {
  const status = statusConfig[claim.status];
  const StatusIcon = status.icon;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-semibold">{claim.claimerName}</h4>
              <p className="text-xs text-muted-foreground">
                Claimed {formatDistanceToNow(new Date(claim.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Badge className={`gap-1 ${status.className}`}>
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0" />
            <span>{claim.claimerEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{claim.claimerPhone}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileText className="h-4 w-4" />
            Proof of Ownership
          </div>
          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            {claim.proofDescription}
          </p>
          
          {claim.proofImageUrl && (
            <div className="relative h-32 w-full overflow-hidden rounded-lg border">
              <Image
                src={claim.proofImageUrl}
                alt="Proof"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </CardContent>
      
      {claim.status === 'pending' && (
        <CardFooter className="gap-2 pt-0">
          <Button 
            variant="outline" 
            className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={onReject}
          >
            <XCircle className="h-4 w-4 mr-1.5" />
            Reject
          </Button>
          <Button 
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={onApprove}
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" />
            Approve
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export function ViewClaimsDialog({ item, open, onOpenChange }: ViewClaimsDialogProps) {
  const { getClaimsForItem, updateClaimStatus } = useStore();
  const claims = getClaimsForItem(item.id);
  
  const handleApprove = (claimId: string) => {
    updateClaimStatus(claimId, 'approved');
    // Reject all other pending claims
    claims.forEach((c) => {
      if (c.id !== claimId && c.status === 'pending') {
        updateClaimStatus(c.id, 'rejected');
      }
    });
  };
  
  const handleReject = (claimId: string) => {
    updateClaimStatus(claimId, 'rejected');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Claims for: {item.title}</DialogTitle>
          <DialogDescription>
            Review the claims below and verify ownership before approving.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {claims.length === 0 ? (
            <div className="py-8 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-2 text-muted-foreground">No claims yet</p>
            </div>
          ) : (
            claims.map((claim) => (
              <ClaimCard
                key={claim.id}
                claim={claim}
                onApprove={() => handleApprove(claim.id)}
                onReject={() => handleReject(claim.id)}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
