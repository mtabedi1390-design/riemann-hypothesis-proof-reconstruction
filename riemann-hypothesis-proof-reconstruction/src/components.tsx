import { useMemo, useState, type ReactNode } from "react";
import katex from "katex";
import { statusMeta } from "./data";

export function Tex({
  children,
  block = false,
  className = "",
}: {
  children: string;
  block?: boolean;
  className?: string;
}) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(children, {
        displayMode: block,
        throwOnError: false,
        strict: false,
        trust: false,
      });
    } catch {
      return children;
    }
  }, [children, block]);

  if (block) {
    return (
      <div
        className={`math-display katex-display-wrap overflow-x-auto ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const tones: Record<string, { dot: string; bg: string; text: string; border: string }> = {
  green: { dot: "#4f7c68", bg: "#e5ede5", text: "#315a49", border: "#c3d5c7" },
  blue: { dot: "#4a7385", bg: "#e4ecef", text: "#315a6b", border: "#c3d5da" },
  amber: { dot: "#aa7c32", bg: "#f2ead8", text: "#79561d", border: "#ddcda8" },
  red: { dot: "#a54f34", bg: "#f2e3dc", text: "#843b26", border: "#ddc2b5" },
  grey: { dot: "#7a817a", bg: "#e9e9e3", text: "#555e56", border: "#d2d3cb" },
};

export function Badge({
  status,
  label,
  className = "",
}: {
  status: string;
  label?: string;
  className?: string;
}) {
  const meta = statusMeta[status] ?? { label: label ?? status, tone: "grey" };
  const t = tones[meta.tone] ?? tones.grey;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${className}`}
      style={{ background: t.bg, color: t.text, borderColor: t.border }}
    >
      <span className="evidence-dot" style={{ background: t.dot }} />
      {label ?? meta.label}
    </span>
  );
}

export function Eyebrow({
  children,
  light = false,
  className = "",
}: {
  children: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
        light ? "text-[#a8b9af]" : "text-[color:var(--ink-faint)]"
      } ${className}`}
    >
      {children}
    </p>
  );
}

export function Section({
  id,
  letter,
  eyebrow,
  title,
  intro,
  children,
  tight = false,
}: {
  id: string;
  letter: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  tight?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 border-t border-[color:var(--line)] ${tight ? "" : ""}`}
    >
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 md:py-20 lg:px-12 lg:py-24">
        <header className="mb-10 grid gap-5 md:mb-14 md:grid-cols-[92px_1fr] md:gap-8">
          <div className="flex items-start gap-3 md:block">
            <span className="serif block text-[52px] leading-none text-[color:var(--terra)] md:text-[66px]">
              {letter}
            </span>
            <span className="mt-1 block h-px w-10 bg-[color:var(--line-dark)] md:mt-4" />
          </div>
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="display mt-3 max-w-4xl text-[34px] text-[color:var(--pine)] sm:text-[44px] lg:text-[52px]">
              {title}
            </h2>
            {intro && (
              <p className="mt-5 max-w-3xl text-[14.5px] leading-[1.75] text-[color:var(--ink-soft)]">
                {intro}
              </p>
            )}
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}

export function CopyLean({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          setCopied(false);
        }
      }}
      className="inline-flex items-center gap-1.5 rounded border border-white/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#c5d4ca] transition hover:border-white/35 hover:text-white"
      aria-label="Copy Lean source"
    >
      {copied ? (
        <>
          <CheckIcon className="h-3 w-3" /> copied
        </>
      ) : (
        <>
          <CopyIcon className="h-3 w-3" /> copy
        </>
      )}
    </button>
  );
}

export function LeanBlock({
  code,
  label = "Lean 4",
  className = "",
  collapsible = false,
}: {
  code: string;
  label?: string;
  className?: string;
  collapsible?: boolean;
}) {
  const body = (
    <div className="lean-block scrollbar-thin overflow-x-auto rounded-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#91a99e]">
          {label}
        </span>
        <CopyLean code={code} />
      </div>
      <pre className="whitespace-pre px-4 py-4 leading-[1.75]">{code}</pre>
    </div>
  );

  if (!collapsible) return <div className={className}>{body}</div>;
  return (
    <details className={`group rounded-sm border border-[color:var(--line)] bg-[#f8f5ed] ${className}`}>
      <summary className="flex items-center justify-between px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--ink-soft)]">
          Formal trace · {label}
        </span>
        <span className="chevron font-mono text-lg leading-none text-[color:var(--ink-faint)]">+</span>
      </summary>
      <div className="px-3 pb-3">{body}</div>
    </details>
  );
}

export function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExternalIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DownloadIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M12 3v12M7 10l5 5 5-5M4 20h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <path d="M4 12.5 9 17.5 20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CopyIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" strokeLinecap="round" />
    </svg>
  );
}

export function SigmaMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 4h16L12 12l8 8H4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
