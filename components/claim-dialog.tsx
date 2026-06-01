'use client';

import { useState } from 'react';
import Image from 'next/image';
import { type LostItem } from '@/lib/types';
import { useStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ClaimDialogProps {
  item: LostItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClaimDialog({ item, open, onOpenChange }: ClaimDialogProps) {
  const { addClaim } = useStore();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    claimerName: '',
    claimerEmail: '',
    claimerPhone: '',
    proofDescription: '',
  });
  const [proofImageUrl, setProofImageUrl] = useState<string | null>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addClaim({
      itemId: item.id,
      claimerName: formData.claimerName,
      claimerEmail: formData.claimerEmail,
      claimerPhone: formData.claimerPhone,
      proofDescription: formData.proofDescription,
      proofImageUrl,
    });
    
    setStep('success');
  };
  
  const handleClose = () => {
    setStep('form');
    setFormData({
      claimerName: '',
      claimerEmail: '',
      claimerPhone: '',
      proofDescription: '',
    });
    setProofImageUrl(null);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle>Claim: {item.title}</DialogTitle>
              <DialogDescription>
                Please provide proof that this item belongs to you. This helps us verify your claim.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
                <div className="flex gap-2">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-warning-foreground" />
                  <p className="text-sm text-warning-foreground">
                    False claims may result in disciplinary action. Please only claim items that truly belong to you.
                  </p>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="claimerName">Full Name *</Label>
                  <Input
                    id="claimerName"
                    required
                    value={formData.claimerName}
                    onChange={(e) => setFormData({ ...formData, claimerName: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claimerPhone">Phone Number *</Label>
                  <Input
                    id="claimerPhone"
                    type="tel"
                    required
                    value={formData.claimerPhone}
                    onChange={(e) => setFormData({ ...formData, claimerPhone: e.target.value })}
                    placeholder="Your phone number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="claimerEmail">Student Email *</Label>
                <Input
                  id="claimerEmail"
                  type="email"
                  required
                  value={formData.claimerEmail}
                  onChange={(e) => setFormData({ ...formData, claimerEmail: e.target.value })}
                  placeholder="your.email@university.edu"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="proofDescription">Proof of Ownership *</Label>
                <Textarea
                  id="proofDescription"
                  required
                  value={formData.proofDescription}
                  onChange={(e) => setFormData({ ...formData, proofDescription: e.target.value })}
                  placeholder="Describe specific details only the owner would know (e.g., scratches, stickers, contents, password hints, etc.)"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Proof Image (Optional)</Label>
                <div className="flex gap-3">
                  {proofImageUrl ? (
                    <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
                      <Image
                        src={proofImageUrl}
                        alt="Proof"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setProofImageUrl(null)}
                        className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-destructive-foreground"
                      >
                        <span className="sr-only">Remove</span>
                        &times;
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 transition-colors hover:border-primary/50 hover:bg-muted/50">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="mt-1 text-xs text-muted-foreground">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                  <p className="flex-1 text-xs text-muted-foreground">
                    Upload a photo of purchase receipt, matching item, or any other proof of ownership.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Submit Claim
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Claim Submitted!</h3>
            <p className="mt-2 text-muted-foreground">
              Your claim has been submitted for verification. The finder will review your proof and contact you if approved.
            </p>
            <Button className="mt-6" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
