'use client';

import { Shield, Zap, Lock, Brain, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/translations';

interface LandingSectionProps {
  onGetStarted?: () => void;
}

export function LandingSection({ onGetStarted }: LandingSectionProps) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <section className="w-full">

      {/* ════════════════════════════════════════════
          HERO
          ════════════════════════════════════════════ */}
      <div className="text-center pt-8 sm:pt-16 pb-14 sm:pb-24 px-4">

        {/* Google-style chip — understated, single brand color */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 mb-8">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="h-2 w-2 rounded-full bg-secondary" />
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="h-2 w-2 rounded-full bg-destructive" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-primary tracking-wide">
            {t('landing.hero.poweredByAI')}
          </span>
        </div>

        {/* Headline — Google uses LIGHT weight (400), very large, tight tracking.
            This is the #1 signature of Google's typography. */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal text-foreground leading-[1.1] tracking-[-0.03em] max-w-3xl mx-auto">
          {t('landing.hero.title')}
        </h1>

        {/* Subheading — Google uses 18–20px, muted, regular weight */}
        <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed font-normal">
          {t('landing.hero.subtitle')}
        </p>

        {/* ── Google CTA Button ──
            Clean text-only button matching Google's minimal style.
            No icons — just clean typography and interaction states. */}
        <div className="mt-10 sm:mt-12">
          <button
            onClick={onGetStarted}
            className="
              inline-flex items-center justify-center
              h-14 px-8
              rounded-full
              bg-primary text-white
              text-base font-medium
              transition-all duration-200 ease-out
              hover:bg-primary/85 hover:shadow-lg hover:shadow-primary/25
              active:scale-[0.97]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
            "
          >
            {t('landing.hero.cta')}
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          FEATURES
          Google: white cards, no visible border, feather-light shadow,
          shadow lifts on hover. Icon containers are 48×48, tonal.
          ════════════════════════════════════════════ */}
      <div className="px-4 pb-20 sm:pb-28">
        <div className="max-w-4xl mx-auto">

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {[
              {
                icon: Brain,
                titleKey: 'landing.features.aiPowered',
                descKey: 'landing.features.aiPoweredDesc',
                iconColor: 'text-primary',
                iconBg: 'bg-primary/10',
              },
              {
                icon: Lock,
                titleKey: 'landing.features.privacyFirst',
                descKey: 'landing.features.privacyFirstDesc',
                iconColor: 'text-secondary',
                iconBg: 'bg-secondary/10',
              },
              {
                icon: Zap,
                titleKey: 'landing.features.instant',
                descKey: 'landing.features.instantDesc',
                iconColor: 'text-accent',
                iconBg: 'bg-accent/20',
              },
              {
                icon: Shield,
                titleKey: 'landing.features.encrypted',
                descKey: 'landing.features.encryptedDesc',
                iconColor: 'text-destructive',
                iconBg: 'bg-destructive/10',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="
                  group p-6 sm:p-7
                  rounded-2xl
                  border-0
                  bg-card
                  shadow-[0_1px_3px_rgba(0,0,0,0.07)]
                  hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)]
                  transition-shadow duration-300 ease-out
                "
              >
                <div className="flex items-start gap-4">
                  {/* Tonal icon container — 48×48, Google's signature */}
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 ${feature.iconBg}`}>
                    <feature.icon className={`h-5.5 w-5.5 ${feature.iconColor}`} aria-hidden="true" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h3 className="font-semibold text-foreground text-base sm:text-lg">
                      {t(feature.titleKey as any)}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1.5 leading-relaxed">
                      {t(feature.descKey as any)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          HOW IT WORKS
          Google uses a very light grey surface for process sections.
          Step numbers: large, colored, no heavy badge — just the number
          sitting in a soft tonal circle. Connectors are thin and muted.
          ════════════════════════════════════════════ */}
      <div className="bg-muted/50 py-20 sm:py-28 px-4">
        <div className="max-w-4xl mx-auto">

          <h2 className="text-3xl sm:text-4xl font-normal text-foreground text-center tracking-[-0.02em] mb-4">
            {t('landing.howItWorks.title')}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground text-center max-w-xl mx-auto mb-14 sm:mb-18">
            {t('landing.howItWorks.subtitle')}
          </p>

          <div className="relative">
            {/* Connector line — sits behind the step cards on desktop */}
            <div className="absolute left-1/2 top-8 hidden sm:block -translate-x-1/2 w-3/4 h-px bg-border" />

            <div className="space-y-8 sm:space-y-0 sm:grid sm:gap-6 sm:grid-cols-3 relative">
              {[
                {
                  step: '01',
                  title: t('landing.howItWorks.step1'),
                  description: t('landing.howItWorks.step1Desc'),
                  color: 'text-destructive',
                  bg: 'bg-destructive/10',
                },
                {
                  step: '02',
                  title: t('landing.howItWorks.step2'),
                  description: t('landing.howItWorks.step2Desc'),
                  color: 'text-accent',
                  bg: 'bg-accent/15',
                },
                {
                  step: '03',
                  title: t('landing.howItWorks.step3'),
                  description: t('landing.howItWorks.step3Desc'),
                  color: 'text-secondary',
                  bg: 'bg-secondary/10',
                },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center relative">
                  {/* Step circle — soft tonal, number inside */}
                  <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full ${item.bg} mb-5`}>
                    <span className={`text-lg font-semibold ${item.color}`}>{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-base sm:text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[220px]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          FAQ
          Google keeps these clean and minimal.
          Subtle border, no left accent strips — just clean cards.
          ════════════════════════════════════════════ */}
      <div className="py-20 sm:py-28 px-4">
        <div className="max-w-3xl mx-auto">

          <h2 className="text-3xl sm:text-4xl font-normal text-foreground text-center tracking-[-0.02em] mb-3">
            {t('landing.faq.title')}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground text-center mb-12 sm:mb-16">
            {t('landing.faq.subtitle')}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                qKey: 'landing.faq.q1',
                aKey: 'landing.faq.a1',
              },
              {
                qKey: 'landing.faq.q2',
                aKey: 'landing.faq.a2',
              },
              {
                qKey: 'landing.faq.q3',
                aKey: 'landing.faq.a3',
              },
              {
                qKey: 'landing.faq.q4',
                aKey: 'landing.faq.a4',
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="
                  p-5 sm:p-6
                  rounded-2xl
                  border border-border
                  bg-card
                  shadow-none
                  hover:bg-muted/40
                  transition-colors duration-150
                "
              >
                <div className="flex items-start gap-3">
                  {/* Checkmark — Google Green, reinforces trust */}
                  <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">
                      {t(item.qKey as any)}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      {t(item.aKey as any)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          BOTTOM CTA STRIP
          Google often closes product pages with a clean, full-width
          CTA band. Soft background, centered text + button.
          ════════════════════════════════════════════ */}
      <div className="bg-muted/30 py-16 sm:py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-normal text-foreground tracking-[-0.02em] mb-4">
            {t('landing.cta.title')}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10">
            {t('landing.cta.subtitle')}
          </p>
          <button
            onClick={onGetStarted}
            className="
              inline-flex items-center justify-center
              h-14 px-8
              rounded-full
              bg-primary text-white
              text-base font-medium
              transition-all duration-200 ease-out
              hover:bg-primary/85 hover:shadow-lg hover:shadow-primary/25
              active:scale-[0.97]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
            "
          >
            {t('landing.hero.cta')}
          </button>
        </div>
      </div>

    </section>
  );
}