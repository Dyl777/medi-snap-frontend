'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { ResultsDisplay } from '@/components/results-display';
import { LoadingState } from '@/components/loading-state';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, FileText, Upload } from 'lucide-react';
import { getInterpretations, askQuestion, InterpretationResponse } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/translations';

export default function RecentResultsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const [results, setResults] = useState<InterpretationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [defaultTab, setDefaultTab] = useState('summary');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#chat') {
      setDefaultTab('chat');
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('[Recent] Not authenticated, redirecting...');
      router.push('/login?message=Please sign in to view your results');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchMostRecent = async () => {
      try {
        console.log('[Recent] Fetching most recent interpretation');
        console.log('[Recent] isAuthenticated:', isAuthenticated);
        console.log('[Recent] authLoading:', authLoading);
        
        // Wait for auth to finish loading
        if (authLoading) {
          console.log('[Recent] Auth still loading, waiting...');
          return;
        }
        
        // Redirect if not authenticated
        if (!isAuthenticated) {
          console.log('[Recent] Not authenticated, redirecting to login');
          router.push('/login?message=Please sign in to view your results');
          return;
        }
        
        setLoading(true);
        setError(null);
        
        // Get the most recent interpretation (page 1, limit 1)
        console.log('[Recent] Calling getInterpretations API...');
        const response = await getInterpretations({ page: 1, limit: 1 });
        console.log('[Recent] Response:', response);
        console.log('[Recent] Data count:', response.data?.length || 0);
        
        if (response.data && response.data.length > 0) {
          console.log('[Recent] Setting results:', response.data[0]);
          setResults(response.data[0]);
          setError(null);
        } else {
          console.log('[Recent] No data found in response');
          setError(t('results.noRecentFound'));
          setResults(null);
        }
      } catch (err) {
        console.error('[Recent] Failed to fetch recent results:', err);
        setError(err instanceof Error ? err.message : 'Failed to load recent results');
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMostRecent();
  }, [isAuthenticated, authLoading, router, t]);

  const handleAskQuestion = useCallback(
    async (question: string): Promise<string> => {
      if (!results) {
        console.error('No results available for chat');
        return 'No results available for chat';
      }

      console.log('Asking question:', question, 'for interpretation:', results.id);
      setAsking(true);
      try {
        const response = await askQuestion(results.id, question, language);
        console.log('Chat response:', response);
        return response.answer;
      } catch (err) {
        console.error('Q&A Error:', err);
        return 'Sorry, I encountered an error. Please try again.';
      } finally {
        setAsking(false);
      }
    },
    [results, language]
  );

  const handleNewDocument = useCallback(() => {
    router.push('/upload');
  }, [router]);

  if (authLoading || loading) {
    return (
      <PageShell
        title={t('common.loading')}
        description="Retrieving your most recent analysis..."
      >
        <LoadingState />
      </PageShell>
    );
  }

  if (error || !results) {
    return (
      <PageShell
        title={t('nav.recent')}
        description="Your most recent document analysis"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || t('results.noRecentFound')}
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>{t('results.whatYouCanDo')}</CardTitle>
              <CardDescription>
                {!results && !error && 'You haven\'t uploaded any documents yet.'}
                {error && 'There was an issue loading your recent results.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => router.push('/upload')} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                {t('results.uploadNewDocument')}
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard')} className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                {t('results.viewAllHistory')}
              </Button>
              <Button variant="outline" onClick={() => router.push('/')} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('results.backToHome')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={t('nav.recent')}
      description={`Your most recent analysis: ${results.document_type} (${Math.round(results.confidence * 100)}% confidence)`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Results Display */}
        <ResultsDisplay
          results={results}
          onNewDocument={handleNewDocument}
          onAsking={handleAskQuestion}
          isAsking={asking}
          defaultTab={defaultTab}
        />

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Upload className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-medium">{t('results.uploadAnother')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('results.analyzeNew')}
                </p>
                <Button onClick={handleNewDocument} size="sm" className="w-full">
                  {t('results.newDocument')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <FileText className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-medium">{t('results.viewHistory')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('results.seeAllPast')}
                </p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => router.push('/dashboard')}>
                  {t('results.viewAllHistory')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <ArrowLeft className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-medium">{t('results.backToHome')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('results.returnToMain')}
                </p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => router.push('/')}>
                  {t('nav.home')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
