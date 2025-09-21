
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Github, Loader2, Target } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 1.76-1.3 3.25-2.85 4.23v2.64h3.38c1.97-1.82 3.1-4.56 3.1-7.9z"/>
      <path fill="currentColor" d="M12.18 22c2.43 0 4.47-.8 5.96-2.18l-3.38-2.64c-.8.54-1.82.87-2.58.87-1.98 0-3.66-1.35-4.25-3.18h-3.4v2.73c1.22 2.4 3.78 4.02 6.65 4.02z"/>
      <path fill="currentColor" d="M7.93 14.05a4.53 4.53 0 0 1 0-4.1V7.22H4.53c-1.83 3.6-1.83 7.98 0 11.58l3.4-2.75z"/>
      <path fill="currentColor" d="M12.18 7.22c1.32 0 2.5.45 3.43 1.34l3-3C16.65 3.27 14.61 2 12.18 2 9.3 2 6.75 3.62 5.52 6.05l3.4 2.75c.6-1.83 2.27-3.18 4.26-3.18z"/>
    </svg>
  );
}


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthAction = async (action: 'signIn' | 'signUp') => {
    setLoading(true);
    setError(null);
    try {
      if (action === 'signUp') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/dashboard');
      toast({ title: `Successfully ${action === 'signIn' ? 'signed in' : 'signed up'}!` });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
      toast({ title: 'Successfully signed in with Google!' });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 selection:bg-primary/20">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 via-fuchsia-900/20 to-background z-0"></div>
      <Card className="w-full max-w-md z-10 bg-card/60 backdrop-blur-lg border-white/10 shadow-2xl shadow-fuchsia-500/10">
        <CardHeader className="text-center">
           <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold font-headline bg-gradient-to-r from-blue-400 to-fuchsia-500 text-transparent bg-clip-text">Maarg</h1>
          </div>
          <CardDescription>Your AI-powered career navigator. Sign in or create an account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email-in">Email</Label>
                <Input id="email-in" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-in">Password</Label>
                <Input id="password-in" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button className="w-full" variant="accent" onClick={() => handleAuthAction('signIn')} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
              </Button>
            </TabsContent>
            <TabsContent value="signup" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email-up">Email</Label>
                <Input id="email-up" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-up">Password</Label>
                <Input id="password-up" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button className="w-full" variant="accent" onClick={() => handleAuthAction('signUp')} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button variant="outline" onClick={handleGoogleSignIn} disabled={loading}><GoogleIcon /> Google</Button>
            <Button variant="outline" disabled><Github /> GitHub</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
