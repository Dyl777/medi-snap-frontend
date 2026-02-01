'use client';

import { Loader2, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function LoadingState() {
  return (
    <div className="space-y-4">
      <Card className="p-8 sm:p-12 flex flex-col items-center justify-center gap-6 min-h-80 sm:min-h-96 rounded-3xl border-border">
        <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-4 sm:p-5">
          <Loader2 className="h-8 sm:h-10 w-8 sm:w-10 animate-spin text-primary" aria-hidden="true" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-semibold text-foreground text-lg sm:text-xl">
            Analyzing Your Document
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground max-w-sm">
            Our AI is reviewing your medical document and preparing a plain language explanation...
          </p>
        </div>

        {/* Progress Steps */}
        <div className="w-full max-w-xs space-y-3 mt-4">
          {[
            { label: 'Uploading file', active: true },
            { label: 'Analyzing content', active: true },
            { label: 'Generating explanation', active: false },
          ].map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex items-center justify-center">
                {step.active ? (
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-muted" aria-hidden="true" />
                )}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Estimate */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-primary mt-2">
          <Zap className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
          <span>Usually completes in 2-5 seconds</span>
        </div>
      </Card>
    </div>
  );
}
