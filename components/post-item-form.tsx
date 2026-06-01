'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { CATEGORIES, type Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, CheckCircle2, ImageIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function PostItemForm() {
  const router = useRouter();
  const { addItem } = useStore();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as Category | '',
    location: '',
    dateFound: '',
    postedBy: '',
    postedByEmail: '',
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category) return;
    
    addItem({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      dateFound: formData.dateFound,
      postedBy: formData.postedBy,
      postedByEmail: formData.postedByEmail,
      imageUrl,
    });
    
    setStep('success');
  };
  
  if (step === 'success') {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/20">
            <CheckCircle2 className="h-10 w-10 text-accent" />
          </div>
          <h3 className="text-2xl font-semibold">Item Posted!</h3>
          <p className="mt-2 text-muted-foreground">
            Thank you for helping reunite someone with their belongings. Your item is now visible to all students.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Button variant="outline" onClick={() => {
              setStep('form');
              setFormData({
                title: '',
                description: '',
                category: '',
                location: '',
                dateFound: '',
                postedBy: '',
                postedByEmail: '',
              });
              setImageUrl(null);
            }}>
              Post Another
            </Button>
            <Button onClick={() => router.push('/')}>
              View All Items
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report a Found Item</CardTitle>
        <CardDescription>
          Help a fellow student by reporting an item you found on campus.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Item Photo</Label>
            <div className="flex gap-4">
              {imageUrl ? (
                <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
                  <Image
                    src={imageUrl}
                    alt="Item"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl(null)}
                    className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-destructive-foreground"
                  >
                    <span className="sr-only">Remove</span>
                    &times;
                  </button>
                </div>
              ) : (
                <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 transition-colors hover:border-primary/50 hover:bg-muted/50">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="mt-2 text-sm text-muted-foreground">Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Upload a clear photo of the item. This helps owners identify their belongings.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Item Name *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Black iPhone 14"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as Category })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the item in detail (color, brand, distinguishing features, etc.)"
              rows={3}
            />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Where Found *</Label>
              <Input
                id="location"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Library 2nd Floor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFound">Date Found *</Label>
              <Input
                id="dateFound"
                type="date"
                required
                value={formData.dateFound}
                onChange={(e) => setFormData({ ...formData, dateFound: e.target.value })}
              />
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">Your Contact Information</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="postedBy">Your Name *</Label>
                <Input
                  id="postedBy"
                  required
                  value={formData.postedBy}
                  onChange={(e) => setFormData({ ...formData, postedBy: e.target.value })}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postedByEmail">Your Email *</Label>
                <Input
                  id="postedByEmail"
                  type="email"
                  required
                  value={formData.postedByEmail}
                  onChange={(e) => setFormData({ ...formData, postedByEmail: e.target.value })}
                  placeholder="your.email@university.edu"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Link href="/" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="flex-1">
              Post Item
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
