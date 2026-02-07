'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PageNav } from '@/components/page-nav';
import { LogoWordmark } from '@/components/logo-wordmark';
import { useAuth } from '@/lib/auth-context';
import { loginUser } from '@/lib/api-client';
// import { getGoogleAuthUrl } from '@/lib/google-oauth';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [language, setLanguage] = useState('en');
  
  // Google OAuth disabled
  // const handleGoogleSignIn = () => {
  //   const redirect = `${window.location.origin}/auth/callback`;
  //   const url = getGoogleAuthUrl(redirect);
  //   if (url === '#') {
  //     const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  //     const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
  //     const missing = [];
  //     if (!clientId) missing.push('NEXT_PUBLIC_GOOGLE_CLIENT_ID');
  //     if (!redirectUri) missing.push('NEXT_PUBLIC_GOOGLE_REDIRECT_URI');
  //     alert(`Google sign-in is not configured. Missing: ${missing.join(', ')}. Please use email/password login.`);
  //     return;
  //   }
  //   window.location.href = url;
  // };
  // const isGoogleOAuthConfigured = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
  const isGoogleOAuthConfigured = false;

  useEffect(() => {
    const messageParam = searchParams.get('message');
    if (messageParam) {
      setMessage(messageParam);
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(values.email, values.password);
      login(data.session.access_token, data.user);
      // Redirect to upload page after login
      router.push('/upload');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col page-transition">
      <Header language={language} onLanguageChange={setLanguage} />
      <PageNav className="mt-2" />
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-center">
            <LogoWordmark size="lg" />
          </div>
          <Card className="w-full rounded-2xl border border-border/70 bg-background shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold tracking-tight">Sign in</CardTitle>
              <CardDescription className="text-sm">
                Use your Med8d account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {message && (
                <Alert className="mb-4">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              {/* Google OAuth temporarily disabled */}
              {/* {isGoogleOAuthConfigured && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-full mb-4 h-11 gap-3 bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f7f8f8] hover:border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.15)]"
                    onClick={handleGoogleSignIn}
                  >
                    <span className="flex h-5 w-5 items-center justify-center">
                      <svg
                        viewBox="0 0 48 48"
                        width="18"
                        height="18"
                        aria-hidden="true"
                      >
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.23 9.2 3.64l6.86-6.86C35.9 2.52 30.4 0 24 0 14.6 0 6.5 5.38 2.6 13.22l8.06 6.26C12.5 13.09 17.8 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.1 24.6c0-1.56-.14-3.06-.4-4.5H24v9h12.5c-.54 2.9-2.15 5.36-4.6 7.06l7.06 5.48C43.1 37.9 46.1 31.8 46.1 24.6z"/>
                        <path fill="#FBBC05" d="M10.66 28.48A14.5 14.5 0 0 1 9.9 24c0-1.56.27-3.06.76-4.48l-8.06-6.26A23.97 23.97 0 0 0 0 24c0 3.86.92 7.5 2.6 10.74l8.06-6.26z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.9-2.14 15.86-5.82l-7.06-5.48c-1.96 1.32-4.48 2.1-8.8 2.1-6.2 0-11.5-3.6-13.34-8.74l-8.06 6.26C6.5 42.62 14.6 48 24 48z"/>
                      </svg>
                    </span>
                    Continue with Google
                  </Button>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">or</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                </>
              )} */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
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
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full rounded-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign in
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-primary hover:underline">
                  Create one
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
