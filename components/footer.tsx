'use client';

// Reuse the same colored wordmark structure as the header
const logoLetters = [
  { char: 'M', color: 'text-primary' },
  { char: 'e', color: 'text-destructive' },
  { char: 'd', color: 'text-accent' },
  { char: 'i', color: 'text-secondary' },
  { char: 'S', color: 'text-primary' },
  { char: 'n', color: 'text-destructive' },
  { char: 'a', color: 'text-accent' },
  { char: 'p', color: 'text-secondary' },
];

const footerLinks = [
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms of Service', href: '#terms' },
  { label: 'Contact Support', href: '#contact' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* ── Main Footer Row ──
            Desktop: wordmark left | links center | copyright right
            Mobile: stacked and centered */}
        <div className="
          py-6 sm:py-8
          flex flex-col items-center gap-4
          sm:flex-row sm:items-center sm:justify-between
        ">

          {/* Wordmark — same colored logo as header */}
          <span className="text-lg font-semibold tracking-[-0.02em] leading-none flex-shrink-0">
            {logoLetters.map((letter, i) => (
              <span key={i} className={letter.color}>
                {letter.char}
              </span>
            ))}
          </span>

          {/* Links — inline row, muted text, hover to primary */}
          <nav className="flex items-center gap-5 sm:gap-6" aria-label="Footer">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="
                  text-sm text-muted-foreground
                  hover:text-primary
                  transition-colors duration-150
                "
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground flex-shrink-0">
            © {currentYear} MediSnap
          </p>
        </div>

        {/* ── Disclaimer ──
            No filled box. Just a thin border on top and small muted text.
            Google keeps legal notices quiet — present but not loud. */}
        <div className="border-t border-border pt-5 pb-6 sm:pb-8">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl mx-auto text-center">
            <span className="font-medium text-foreground">Disclaimer:</span>{' '}
            MediSnap provides general medical information only and is not a substitute
            for professional medical advice. Always consult your healthcare provider
            for medical concerns.
          </p>
        </div>

      </div>
    </footer>
  );
}