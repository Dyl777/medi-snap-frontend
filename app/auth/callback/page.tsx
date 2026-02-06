'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { LoadingState } from '@/components/loading-state';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/lib/auth-context';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(errorParam);
      return;
    }

    if (!accessToken) {
      setError('Missing access token from Google sign-in.');
      return;
    }

    const finalizeLogin = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to fetch user profile');
        }

        const data = await response.json();
        login(accessToken, data.user);
        router.replace('/upload');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        console.error('[AuthCallback] Profile fetch failed:', message, {
          apiBaseUrl: API_BASE_URL,
        });
        setError(message);
      }
    };

    finalizeLogin();
  }, [login, router, searchParams]);

  if (error) {
    return (
      <PageShell title="Sign-in Failed" description="We could not complete Google sign-in.">
        <div className="max-w-md mx-auto space-y-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => router.push('/login')} className="w-full">
            Back to Sign In
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Signing you in" description="Completing Google authentication...">
      <LoadingState />
    </PageShell>
  );
}
