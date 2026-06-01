'use client';

import { Header } from '@/components/header';
import { PostItemForm } from '@/components/post-item-form';

export default function PostPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <PostItemForm />
        </div>
      </main>
    </div>
  );
}
