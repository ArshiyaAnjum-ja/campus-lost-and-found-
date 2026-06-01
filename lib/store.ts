'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LostItem, ClaimRequest, Category } from './types';

interface StoreState {
  items: LostItem[];
  claims: ClaimRequest[];
  filterCategory: Category | 'all';
  searchQuery: string;
  
  // Actions
  addItem: (item: Omit<LostItem, 'id' | 'createdAt' | 'status'>) => void;
  updateItemStatus: (id: string, status: LostItem['status']) => void;
  deleteItem: (id: string) => void;
  
  addClaim: (claim: Omit<ClaimRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateClaimStatus: (id: string, status: ClaimRequest['status']) => void;
  
  setFilterCategory: (category: Category | 'all') => void;
  setSearchQuery: (query: string) => void;
  
  getFilteredItems: () => LostItem[];
  getClaimsForItem: (itemId: string) => ClaimRequest[];
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      claims: [],
      filterCategory: 'all',
      searchQuery: '',
      
      addItem: (item) => {
        const newItem: LostItem = {
          ...item,
          id: generateId(),
          createdAt: new Date().toISOString(),
          status: 'lost',
        };
        set((state) => ({ items: [newItem, ...state.items] }));
      },
      
      updateItemStatus: (id, status) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, status } : item
          ),
        }));
      },
      
      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          claims: state.claims.filter((claim) => claim.itemId !== id),
        }));
      },
      
      addClaim: (claim) => {
        const newClaim: ClaimRequest = {
          ...claim,
          id: generateId(),
          createdAt: new Date().toISOString(),
          status: 'pending',
        };
        set((state) => ({ claims: [...state.claims, newClaim] }));
        // Update item status to pending verification
        get().updateItemStatus(claim.itemId, 'pending-verification');
      },
      
      updateClaimStatus: (id, status) => {
        const claim = get().claims.find((c) => c.id === id);
        if (claim && status === 'approved') {
          get().updateItemStatus(claim.itemId, 'returned');
        } else if (claim && status === 'rejected') {
          // Check if there are other pending claims
          const otherPendingClaims = get().claims.filter(
            (c) => c.itemId === claim.itemId && c.id !== id && c.status === 'pending'
          );
          if (otherPendingClaims.length === 0) {
            get().updateItemStatus(claim.itemId, 'lost');
          }
        }
        set((state) => ({
          claims: state.claims.map((c) =>
            c.id === id ? { ...c, status } : c
          ),
        }));
      },
      
      setFilterCategory: (category) => set({ filterCategory: category }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      getFilteredItems: () => {
        const { items, filterCategory, searchQuery } = get();
        return items.filter((item) => {
          const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
          const matchesSearch = 
            searchQuery === '' ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
        });
      },
      
      getClaimsForItem: (itemId) => {
        return get().claims.filter((claim) => claim.itemId === itemId);
      },
    }),
    {
      name: 'campus-lost-found-storage',
    }
  )
);
