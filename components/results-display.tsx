'use client';

import { useState } from 'react';
import {
  Copy,
  Download,
  Share2,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Plus,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import type { InterpretationResponse } from '@/lib/api-client';
import { ChatWindow } from '@/components/chat-window';

interface ResultsDisplayProps {
  results: InterpretationResponse;
  onNewDocument?: () => void;
  onAsking?: (question: string) => void;
  isAsking?: boolean;
}

export function ResultsDisplay({
  results,
  onNewDocument,
  onAsking,
  isAsking = false,
}: ResultsDisplayProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({});
  const [showChat, setShowChat] = useState(false);

  const handleCopy = (text: string, tab: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const medicalTerms = results.interpretation.sections.flatMap(section =>
    section.terms.map(t => ({ term: t.term, definition: t.definition, importance: t.importance }))
  );

  // Summary tab content
  const SummaryTab = () => (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-5 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="rounded-xl bg-primary/20 p-2.5 flex-shrink-0 mt-1">
            <Lightbulb className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
              Plain Language Summary
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              {results.interpretation.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-muted p-3 sm:p-4 text-center">
          <div className="text-xs text-muted-foreground mb-1">Document Type</div>
          <div className="text-xs sm:text-sm font-semibold text-foreground truncate">
            {results.document_type}
          </div>
        </div>
        <div className="rounded-2xl bg-muted p-3 sm:p-4 text-center">
          <div className="text-xs text-muted-foreground mb-1">Confidence</div>
          <div className="text-xs sm:text-sm font-semibold text-foreground">
            {Math.round(results.confidence * 100)}%
          </div>
        </div>
        <div className="rounded-2xl bg-muted p-3 sm:p-4 text-center col-span-2 sm:col-span-1">
          <div className="text-xs text-muted-foreground mb-1">Time</div>
          <div className="text-xs sm:text-sm font-semibold text-foreground">
            {(results.processingTime / 1000).toFixed(2)}s
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() =>
            handleCopy(results.interpretation.summary, 'summary')
          }
          variant="outline"
          className="flex-1 rounded-2xl h-10"
        >
          {copiedTab === 'summary' ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
              <span className="hidden sm:inline">Copied</span>
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </Button>
        <Button
          onClick={() => {
            const text = `Document Type: ${results.document_type}\nConfidence: ${Math.round(results.confidence * 100)}%\n\n${results.interpretation.summary}`;
            const element = document.createElement('a');
            element.setAttribute(
              'href',
              'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
            );
            element.setAttribute('download', 'medical-interpretation.txt');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}
          variant="outline"
          className="flex-1 rounded-2xl h-10"
        >
          <Download className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      </div>
    </div>
  );

  // Details tab content
  const DetailsTab = () => (
    <div className="space-y-3">
      {results.interpretation.sections.map((section, index) => (
        <div key={index} className="rounded-2xl border border-border overflow-hidden">
          <button
            onClick={() => toggleSection(index)}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <span className="font-semibold text-sm text-foreground text-left">
              Section {index + 1}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform flex-shrink-0 ${
                expandedSections[index] ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {expandedSections[index] && (
            <div className="border-t border-border px-4 py-4 space-y-4 bg-muted/30">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                  Original
                </h4>
                <p className="text-sm text-foreground bg-background rounded-xl p-3 font-mono text-xs leading-relaxed">
                  {section.original}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                  Simplified
                </h4>
                <p className="text-sm text-foreground leading-relaxed">
                  {section.simplified}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // Terms tab content
  const TermsTab = () => (
    <div className="space-y-3">
      {medicalTerms && medicalTerms.length > 0 ? (
        medicalTerms.map((termObj, index) => (
          <div
            key={index}
            className="rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0 mt-1">
                <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-foreground text-sm">
                    {termObj.term}
                  </h4>
                  {termObj.importance && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                      termObj.importance === 'high'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                        : termObj.importance === 'medium'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200'
                          : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {termObj.importance}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  {termObj.definition}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No medical terms to define</p>
        </div>
      )}
    </div>
  );

  // Actions tab content
  const ActionsTab = () => (
    <div className="space-y-4">
      <Card className="p-4 sm:p-6 rounded-2xl border-border bg-gradient-to-br from-primary/5 to-accent/5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
          <span>Next Steps</span>
        </h3>
        <ol className="space-y-3 text-sm text-foreground">
          <li className="flex gap-3">
            <span className="font-bold text-primary flex-shrink-0 w-6">1.</span>
            <span>Review the plain language summary above</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary flex-shrink-0 w-6">2.</span>
            <span>Ask questions in the chat for clarification</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary flex-shrink-0 w-6">3.</span>
            <span>Share with your healthcare provider</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary flex-shrink-0 w-6">4.</span>
            <span>Download for your records</span>
          </li>
        </ol>
      </Card>

      <Card className="p-4 sm:p-6 rounded-2xl border-border bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
        <h3 className="font-semibold text-green-900 dark:text-green-200 mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span>Privacy Protected</span>
        </h3>
        <p className="text-sm text-green-800 dark:text-green-300 leading-relaxed">
          Your document is processed securely and automatically deleted when you close this page. We never store your medical information.
        </p>
      </Card>

      {onAsking && (
        <Card className="p-4 sm:p-6 rounded-2xl border-border">
          <h3 className="font-semibold text-foreground mb-3">Questions?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Ask follow-up questions about this document for clarification
          </p>
          <Button
            onClick={() => setShowChat(!showChat)}
            className="w-full rounded-2xl h-10 bg-primary hover:bg-primary/90"
          >
            {showChat ? 'Hide Chat' : 'Ask a Question'}
          </Button>

          {showChat && (
            <div className="mt-4">
              <ChatWindow
                onSendQuestion={onAsking}
                isLoading={isAsking}
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Action Bar - Google Style */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Results
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {results.document_type} • {Math.round(results.confidence * 100)}% confidence
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onNewDocument}
            variant="outline"
            className="rounded-full h-10 px-4 gap-2 border-border bg-transparent"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">New</span>
          </Button>
        </div>
      </div>

      {/* Cohesive Results Card */}
      <Tabs defaultValue="summary" className="w-full">
        <Card className="rounded-2xl border-border overflow-hidden">
          {/* Tab List */}
          <TabsList className="w-full grid grid-cols-4 rounded-none border-b border-border bg-transparent p-0 h-auto">
            <TabsTrigger
              value="summary"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-muted/50 px-2 py-4 text-xs sm:text-sm font-medium transition-colors"
            >
              <span className="hidden sm:inline">Summary</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-muted/50 px-2 py-4 text-xs sm:text-sm font-medium transition-colors"
            >
              <span className="hidden sm:inline">Details</span>
              <span className="sm:hidden">Detail</span>
            </TabsTrigger>
            <TabsTrigger
              value="terms"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-muted/50 px-2 py-4 text-xs sm:text-sm font-medium transition-colors"
            >
              <span className="hidden sm:inline">Terms</span>
              <span className="sm:hidden">Terms</span>
            </TabsTrigger>
            <TabsTrigger
              value="actions"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-muted/50 px-2 py-4 text-xs sm:text-sm font-medium transition-colors"
            >
              <span className="hidden sm:inline">Actions</span>
              <span className="sm:hidden">Help</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            <TabsContent value="summary" className="mt-0 space-y-4">
              <SummaryTab />
            </TabsContent>
            <TabsContent value="details" className="mt-0 space-y-3">
              <DetailsTab />
            </TabsContent>
            <TabsContent value="terms" className="mt-0 space-y-3">
              <TermsTab />
            </TabsContent>
            <TabsContent value="actions" className="mt-0">
              <ActionsTab />
            </TabsContent>
          </div>
        </Card>
      </Tabs>

      {/* Action Buttons - Bottom */}
      <div className="flex gap-2 sm:gap-3 flex-wrap">
        <Button
          onClick={() => handleCopy(results.interpretation.summary, 'summary')}
          variant="outline"
          className="flex-1 rounded-full h-10 gap-2"
        >
          {copiedTab === 'summary' ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
              <span className="hidden sm:inline">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </Button>
        <Button
          onClick={() => {
            const text = `Document Type: ${results.document_type}\nConfidence: ${Math.round(results.confidence * 100)}%\n\n${results.interpretation.summary}`;
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', 'medical-interpretation.txt');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}
          variant="outline"
          className="flex-1 rounded-full h-10 gap-2"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Download</span>
        </Button>
        <Button
          onClick={() => {
            const text = `Document Type: ${results.document_type}\nConfidence: ${Math.round(results.confidence * 100)}%\n\n${results.interpretation.summary}`;
            if (navigator.share) {
              navigator.share({
                title: 'Medical Document Translation',
                text: text,
              });
            } else {
              handleCopy(text, 'share');
            }
          }}
          variant="outline"
          className="flex-1 rounded-full h-10 gap-2"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </div>
    </div>
  );
}
