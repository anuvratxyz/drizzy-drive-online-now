import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogInIcon, UserPlusIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

// --- Validation schemas (unchanged)
const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'sign-in' | 'sign-up';
}

const AuthModal = ({ open, onOpenChange, defaultTab = 'sign-in' }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { setUser } = useUser();

  // ------------- FORMS (unchanged) ----------------
  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  // --------- COGNITO / HOSTED UI SETTINGS (use your values) ----------
  const COGNITO_DOMAIN = "us-east-16cauuhmewy.auth.us-east-1.amazoncognito.com";
  const CLIENT_ID = "6takhnotvtt9kdir86hf9cv81";
  const REDIRECT_URI = "https://main.d4rmxqdo4.amplifyapp.com/"; // EXACT match in Cognito App settings

  const LOGIN_URL = `https://${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=token&scope=openid+email&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  const LOGOUT_URL = `https://${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(REDIRECT_URI)}`;

  // ---------- helpers to parse JWT and fragment --------------
  function parseHashFragment(h: string | null) {
    if (!h) return {};
    if (h.startsWith('#')) h = h.slice(1);
    return Object.fromEntries(h.split('&').filter(Boolean).map(p => p.split('=').map(decodeURIComponent)));
  }

  function decodeJwtPayload(token: string | null) {
    if (!token) return null;
    try {
      const part = token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');
      const padded = part + '='.repeat((4 - part.length % 4) % 4);
      const json = atob(padded);
      return JSON.parse(decodeURIComponent(escape(json)));
    } catch (e) {
      return null;
    }
  }

  // ---------- parse token on mount (when Cognito redirects back) -----------
  useEffect(() => {
    // If app was redirected back from Hosted UI, tokens will be in URL fragment
    const frag = parseHashFragment(window.location.hash);
    if (frag && (frag as any).id_token) {
      const idToken = (frag as any).id_token as string;
      const accessToken = (frag as any).access_token as string | undefined;
      sessionStorage.setItem('id_token', idToken);
      if (accessToken) sessionStorage.setItem('access_token', accessToken);
      // clean URL
      history.replaceState(null, '', window.location.pathname + window.location.search);
      const claims = decodeJwtPayload(idToken);
      if (claims) {
        // set simple user object in your UserContext
        setUser({ email: claims.email || claims.username, name: claims.name || undefined });
        toast({ title: 'Signed in', description: `Welcome, ${claims.email || claims.name || 'user'}` });
        onOpenChange(false);
      }
    }
    // Also, if there is an id_token already in session (previous session), restore user
    else {
      const existing = sessionStorage.getItem('id_token');
      if (existing) {
        const claims = decodeJwtPayload(existing);
        if (claims) {
          setUser({ email: claims.email || claims.username, name: claims.name || undefined });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // ---------- Attempt to open Hosted UI; fallback to mock if unreachable ------------
  async function tryOpenHostedUI(): Promise<void> {
    try {
      // quick network test; if DNS blocked this will reject
      await fetch(`https://${COGNITO_DOMAIN}/login`, { method: 'GET', mode: 'no-cors', cache: 'no-store' });
      // network ok -> redirect
      window.location.href = LOGIN_URL;
    } catch (err) {
      // unreachable (common in restricted labs). Show toast and fallback to mock sign-in flow
      toast({ title: 'Hosted UI unreachable', description: 'Falling back to demo sign-in.' });
      // fallback: open the modal's sign-in form (user can sign in using mock credentials)
      // We'll prompt for email and set user for demo
      const email = window.prompt('Demo sign-in: enter email (example: demo@you.com)');
      if (email) {
        const payload = { sub: 'demo-user-1', email, email_verified: true, name: undefined };
        setUser({ email: payload.email });
        toast({ title: 'Signed in (demo)', description: `Welcome, ${payload.email}` });
        onOpenChange(false);
      }
    }
  }

  // --------- Replace Google auth button behavior to use Hosted UI (or fallback) ----------
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await tryOpenHostedUI();
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- local (existing) mock sign-in / sign-up handlers (keeps your original behavior) ----------
  const handleSignIn = (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    console.log("Sign in data (local):", data);
    setTimeout(() => {
      setIsLoading(false);
      setUser({ email: data.email });
      toast({ title: "Signed in successfully", description: `Welcome back, ${data.email}` });
      onOpenChange(false);
    }, 1000);
  };

  const handleSignUp = (data: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    console.log("Sign up data (local):", data);
    setTimeout(() => {
      setIsLoading(false);
      setUser({ email: data.email, name: data.name });
      toast({ title: "Account created successfully", description: `Welcome to Drizzy, ${data.name || data.email}` });
      onOpenChange(false);
    }, 1000);
  };

  // optional sign out helper (local + try to call Cognito logout)
  const handleSignOut = () => {
    // clear local session
    sessionStorage.removeItem('id_token');
    sessionStorage.removeItem('access_token');
    setUser(undefined);
    toast({ title: 'Signed out', description: 'You are now signed out' });
    // try to open hosted logout (if reachable)
    try {
      window.location.href = LOGOUT_URL;
    } catch {
      // ignore
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>Sign in or create an account to access all features</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="sign-in" className="py-4 space-y-4">
            <Form {...signInForm}>
              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                <FormField
                  control={signInForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signInForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <span>Signing in...</span> : <><LogInIcon className="mr-2 h-4 w-4" /> Sign In</>}
                </Button>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </Button>
            <div className="text-center text-sm text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </div>
          </TabsContent>

          <TabsContent value="sign-up" className="py-4 space-y-4">
            <Form {...signUpForm}>
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                <FormField
                  control={signUpForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signUpForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signUpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <span>Creating account...</span> : <><UserPlusIcon className="mr-2 h-4 w-4" /> Sign Up</>}
                </Button>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleGoogleAuth} disabled={isLoading}>
              {/* same Google icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </Button>
            <div className="text-center text-sm text-gray-500">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-center">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          {/* Optional: add sign out button for convenience during dev/testing */}
          <Button variant="link" onClick={handleSignOut} className="ml-2">Sign out</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
