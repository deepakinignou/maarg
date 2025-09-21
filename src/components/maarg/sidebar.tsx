
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Briefcase, GraduationCap, Lightbulb, LineChart, ListChecks, FileText, Target, User, Search, LogOut, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import { useProfileStore } from '@/lib/store';
import { useAuth } from '@/components/maarg/auth-provider';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '../ui/button';

const TABS_CONFIG = [
  { value: "skills", label: "Skills", icon: GraduationCap },
  { value: "careers", label: "Career Paths", icon: Briefcase },
  { value: "learning", label: "Learning Plan", icon: Lightbulb },
  { value: "resume", label: "Resume Builder", icon: FileText },
  { value: "interviews", label: "Interview Prep", icon: ListChecks },
  { value: "trends", label: "Demand Forecast", icon: LineChart },
  { value: "jobs", label: "Job Matching", icon: Search },
  { value: "market-intel", label: "Market Intel", icon: TrendingUp },
  { value: "profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { name, email, photo } = useProfileStore();
  const authState = useAuth();
  
  const userPhoto = authState.user?.photoURL || photo;
  const userName = authState.user?.displayName || name;
  const userEmail = authState.user?.email || email;

  // TODO: This is a hacky way to get the active tab. Should be improved.
  const activeTab = pathname.split('/').pop()?.split('#')[1] || 'skills';
  
  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <aside className="w-64 flex flex-col border-r bg-card/50 p-4">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/" className="flex items-center gap-2">
          <Target className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold font-headline">Maarg</h1>
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        <TooltipProvider>
          {TABS_CONFIG.map(({ value, label, icon: Icon }) => {
            // This is a client-side way to handle navigation with hashtags
            const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              // Manually update URL and let components react
              window.history.pushState(null, '', `/dashboard#${value}`);
              window.dispatchEvent(new PopStateEvent('popstate'));
            };

            const isActive = activeTab === value;
            return (
              <Tooltip key={value} delayDuration={0}>
                <TooltipTrigger asChild>
                  <a href={`/dashboard#${value}`} onClick={handleLinkClick}>
                    <div
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                        isActive && "bg-muted text-primary font-semibold"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </div>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      <div className="mt-auto space-y-2">
        <ThemeToggle />
         <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground">
            <Avatar className="h-9 w-9">
                <AvatarImage src={userPhoto || undefined} alt="User Avatar" />
                <AvatarFallback>
                  {userName?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
                </AvatarFallback>
            </Avatar>
            <div>
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
            <span className="text-muted-foreground">Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}
