"use client";

import { create } from 'zustand';

type ProfileState = {
  name: string;
  email: string;
  photo: string | null;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPhoto: (photo: string) => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  name: 'Demo User',
  email: 'user@maarg.com',
  photo: null,
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setPhoto: (photo) => set({ photo }),
}));
