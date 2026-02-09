'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { ResultsDisplay } from '@/components/results-display';
import { LoadingState } from '@/components/loading-state';
import { getInterpretation, askQuestion, InterpretationResponse } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/translations';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function InterpretationPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const id = params.id as string;

  const [results, setResults] = useState<InterpretationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await getInterpretation(id);
          setResults(data);
        } catch (err) {
          console.error(err);
          setError('Failed to load interpretation. It may not exist or you do not have permission.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isAuthenticated, id]);

  const handleAskQuestion = useCallback(
    async (question: string): Promise<string> => {
      if (!results) {
        return 'No results available for chat';
      }

      setAsking(true);
      try {
        const response = await askQuestion(results.id, question, language);
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

  if (authLoading || (loading && !results && !error)) {
    return (
      <PageShell
        title={t('common.loading')}
        description="Retrieving your analysis..."
      >
        <LoadingState />
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell title={t('common.error')} description="Could not load interpretation">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
            <button 
                onClick={() => router.push('/dashboard')}
                className="text-sm text-primary hover:underline"
            >
                Return to Dashboard
            </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={results?.document_type || 'Interpretation Results'}
      description={`Analysis from ${results?.created_at ? new Date(results.created_at).toLocaleDateString() : 'recent upload'}`}
    >
      {results && (
        <ResultsDisplay
          results={results}
          onNewDocument={() => router.push('/')}
          onAsking={handleAskQuestion}
          isAsking={asking}
        />
      )}
    </PageShell>
  );
}
