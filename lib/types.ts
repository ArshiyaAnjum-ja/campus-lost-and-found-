export type Category = 
  | 'electronics'
  | 'clothing'
  | 'accessories'
  | 'books'
  | 'keys'
  | 'id-cards'
  | 'bags'
  | 'sports'
  | 'other';

export type ItemStatus = 'lost' | 'claimed' | 'pending-verification' | 'returned';

export interface LostItem {
  id: string;
  title: string;
  description: string;
  category: Category;
  location: string;
  dateFound: string;
  imageUrl: string | null;
  status: ItemStatus;
  postedBy: string;
  postedByEmail: string;
  createdAt: string;
}

export interface ClaimRequest {
  id: string;
  itemId: string;
  claimerName: string;
  claimerEmail: string;
  claimerPhone: string;
  proofDescription: string;
  proofImageUrl: string | null;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: 'electronics', label: 'Electronics', icon: 'Smartphone' },
  { value: 'clothing', label: 'Clothing', icon: 'Shirt' },
  { value: 'accessories', label: 'Accessories', icon: 'Watch' },
  { value: 'books', label: 'Books & Notes', icon: 'BookOpen' },
  { value: 'keys', label: 'Keys', icon: 'Key' },
  { value: 'id-cards', label: 'ID Cards', icon: 'CreditCard' },
  { value: 'bags', label: 'Bags & Wallets', icon: 'Briefcase' },
  { value: 'sports', label: 'Sports Equipment', icon: 'Dumbbell' },
  { value: 'other', label: 'Other', icon: 'Package' },
];
