
"use client";

import { Chatbot } from '@/components/maarg/chatbot';
import { Dashboard } from '@/components/maarg/dashboard';
import { Sidebar } from '@/components/maarg/sidebar';
import { useAuth } from '@/components/maarg/auth-provider';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground selection:bg-primary/20">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Dashboard />
        </main>
      </div>
      <Chatbot />
    </div>
  );
}
