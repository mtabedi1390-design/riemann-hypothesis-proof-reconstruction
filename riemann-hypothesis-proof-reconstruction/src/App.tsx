import { useEffect, useState } from "react";
import {
  Arrow,
  Badge,
  CheckIcon,
  DownloadIcon,
  ExternalIcon,
  Eyebrow,
  LeanBlock,
  Section,
  Tex,
} from "./components";
import {
  architecture,
  artifacts,
  axioms,
  bibliography,
  deepInterfaces,
  endpoints,
  executed,
  findings,
  ledger,
  nav,
  notExecuted,
  proofSteps,
  repo,
  scopeNot,
  scopeProof,
  statusMeta,
  techniques,
  waterlooHypotheses,
} from "./data";

const shortHash = repo.commit.slice(0, 9);

function useActiveSection() {
  const [active, setActive] = useState("summary");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const top = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(height > 0 ? Math.min(1, Math.max(0, top / height)) : 0);
        let current = nav[0].id;
        for (const item of nav) {
          const el = document.getElementById(item.id);
          if (el && el.getBoundingClientRect().top <= 150) current = item.id;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { active, progress };
}

function Sidebar({ active }: { active: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[286px] flex-col bg-[color:var(--pine)] text-[color:var(--cream)] lg:flex">
      <div className="border-b border-white/10 px-6 pb-6 pt-7">
        <div className="flex items-center gap-3">
          <span className="serif flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-2xl leading-none text-[#e8dcc6]">
            ξ
          </span>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#91a99e]">Dossier 01 · 2026</p>
            <p className="serif mt-0.5 text-[17px] leading-tight text-[#f4efe3]">Riemann reconstructed</p>
          </div>
        </div>
        <p className="mt-4 font-mono text-[9px] leading-[1.7] uppercase tracking-[0.1em] text-[#82958b]">
          Formal-to-human audit
          <br />
          Alpöge–Claude Lean archive
        </p>
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-5" aria-label="Dossier sections">
        <p className="mb-3 px-3 font-mono text-[8px] uppercase tracking-[0.22em] text-[#70847a]">Contents</p>
        {nav.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`nav-link group mb-0.5 flex items-center gap-3 rounded-sm px-3 py-[7px] font-mono text-[10px] uppercase tracking-[0.08em] ${
              active === item.id ? "active" : "text-[#a9b9b0]"
            }`}
          >
            <span className={`w-4 text-[9px] ${active === item.id ? "text-[#d0a26d]" : "text-[#61766c]"}`}>
              {item.letter}
            </span>
            <span className="truncate">{item.label}</span>
            {active === item.id && <span className="ml-auto h-1 w-1 rounded-full bg-[#d0a26d]" />}
          </a>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="mb-2.5 font-mono text-[8px] uppercase tracking-[0.2em] text-[#70847a]">Evidence key</p>
        <div className="space-y-1.5 text-[10px] text-[#a9b9b0]">
          <div className="flex items-center gap-2"><span className="evidence-dot bg-[#76a48d]" /> Inspected in source</div>
          <div className="flex items-center gap-2"><span className="evidence-dot bg-[#7597a7]" /> Reported verified</div>
          <div className="flex items-center gap-2"><span className="evidence-dot bg-[#c19a52]" /> Source-read only</div>
          <div className="flex items-center gap-2"><span className="evidence-dot bg-[#b76c50]" /> Unresolved</div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-4">
        <div className="flex items-center justify-between font-mono text-[9px] text-[#91a99e]">
          <span>PINNED SOURCE</span>
          <span className="text-[#d0a26d]">{shortHash}</span>
        </div>
        <p className="mt-1.5 font-mono text-[9px] leading-relaxed text-[#70847a]">
          Lean 4.33.1 · Mathlib 0df444a3
          <br />
          Build run by this dossier: <span className="text-[#c19a52]">no</span>
        </p>
        <a
          href={`https://github.com/${repo.mirror}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#a9b9b0] transition hover:text-white"
        >
          Open mirror <ExternalIcon className="h-3 w-3" />
        </a>
      </div>
    </aside>
  );
}

function MobileBar({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-[color:var(--pine)] text-[color:var(--cream)] lg:hidden">
      <div className="flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="serif text-xl">ξ</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em]">Riemann reconstructed</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle contents"
          className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#c8d4cc]"
        >
          {open ? "Close ×" : "Contents +"}
        </button>
      </div>
      {open && (
        <nav className="grid max-h-[65vh] grid-cols-1 gap-1 overflow-y-auto border-t border-white/10 px-4 py-3">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded px-2 py-2 font-mono text-[10px] uppercase tracking-[0.1em] ${
                active === item.id ? "bg-white/10 text-white" : "text-[#a9b9b0]"
              }`}
            >
              <span className="text-[#d0a26d]">{item.letter}</span>
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}

function CriticalStripFigure() {
  const zeros = [14.1347, 21.022, 25.0109, 30.4249, 32.9351, 37.5862, 40.9187, 43.3271, 48.0052, 49.7738];
  const x = (re: number) => 46 + re * 240;
  const y = (im: number) => 264 - (im / 55) * 224;
  return (
    <div className="paper-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[color:var(--line)] px-4 py-2.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
          Fig. 1 · The critical strip
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">Schematic</span>
      </div>
      <div className="bg-[#f8f5ec] px-2 pb-1 pt-3">
        <svg viewBox="0 0 320 300" className="h-auto w-full" role="img" aria-label="Schematic of the critical strip with zeros on the critical line and a hypothetical off-line zero and its reflection">
          <defs>
            <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="7" stroke="#cdc6b5" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect x={x(0)} y={y(55)} width={x(1) - x(0)} height={y(0) - y(55)} fill="#e8e1d1" opacity="0.55" />
          <rect x={x(0.5)} y={y(55)} width={x(1) - x(0.5)} height={y(0) - y(55)} fill="url(#hatch)" opacity="0.32" />
          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <g key={v}>
              <line x1={x(v)} y1={y(0)} x2={x(v)} y2={y(55)} stroke="#b9b1a0" strokeWidth="0.5" opacity="0.5" />
              <text x={x(v)} y={282} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#7c847b">
                {v === 0 ? "0" : v === 1 ? "1" : v === 0.5 ? "½" : v.toFixed(2)}
              </text>
            </g>
          ))}
          {[0, 15, 30, 45].map((v) => (
            <g key={v}>
              <line x1={x(0)} y1={y(v)} x2={x(1)} y2={y(v)} stroke="#b9b1a0" strokeWidth="0.4" opacity="0.55" />
              <text x={x(0) - 12} y={y(v) + 2.5} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#7c847b">
                {v}i
              </text>
            </g>
          ))}
          <line x1={x(0.5)} y1={y(0)} x2={x(0.5)} y2={y(55)} stroke="#2e5d4f" strokeWidth="1.25" strokeDasharray="4 3" />
          <line x1={x(0)} y1={y(0)} x2={x(1)} y2={y(0)} stroke="#6e776f" strokeWidth="0.8" />
          <line x1={x(0)} y1={y(0)} x2={x(0)} y2={y(55)} stroke="#6e776f" strokeWidth="0.8" />
          {zeros.map((z, i) => (
            <circle key={z} cx={x(0.5)} cy={y(z)} r={i === 4 ? 3.2 : 2.7} fill="#173d33" />
          ))}
          <circle cx={x(0.62)} cy={y(40)} r="3.3" fill="#ad5638" stroke="#f5efe2" strokeWidth="1" />
          <circle cx={x(0.38)} cy={y(40)} r="2.6" fill="none" stroke="#ad5638" strokeWidth="1" strokeDasharray="2 2" />
          <line x1={x(0.38)} y1={y(40)} x2={x(0.62)} y2={y(40)} stroke="#ad5638" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.8" />
          <text x={x(0.62) + 7} y={y(40) + 3} fontFamily="Inter Tight, sans-serif" fontSize="7.5" fill="#9a4b31">
            hypothetical ρ
          </text>
          <text x={x(0.38) - 7} y={y(40) - 7} textAnchor="end" fontFamily="Inter Tight, sans-serif" fontSize="7" fill="#9a4b31">
            1 − ρ̄
          </text>
          <text x={x(0.5) + 6} y={y(53)} fontFamily="Inter Tight, sans-serif" fontSize="7.5" fill="#2e5d4f">
            Re = ½
          </text>
          <text x={x(0.98)} y={y(53)} textAnchor="end" fontFamily="Inter Tight, sans-serif" fontSize="7" fill="#6e776f">
            zero-free, reported
          </text>
          <text x={x(0)} y={y(55) - 8} fontFamily="JetBrains Mono, monospace" fontSize="6.5" fill="#8b918a">
            Im s
          </text>
          <text x={x(1)} y={288} textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="6.5" fill="#8b918a">
            Re s
          </text>
        </svg>
      </div>
      <div className="border-t border-[color:var(--line)] px-4 py-3">
        <p className="text-[11px] leading-[1.65] text-[color:var(--ink-soft)]">
          The first ten nontrivial zeta ordinates on the critical line. An off-line zero would reflect to
          <span className="serif italic"> 1 − ρ̄</span>; clearing the right half-plane clears the strip.
        </p>
        <p className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-[color:var(--ink-faint)]">
          Orientation only · not a verification artifact
        </p>
      </div>
    </div>
  );
}

function Hero({ progress }: { progress: number }) {
  return (
    <header className="relative overflow-hidden border-b border-[color:var(--line)]">
      <div className="fixed left-0 top-0 z-50 h-[2px] bg-[color:var(--terra)] transition-[width] duration-150 lg:left-[286px]" style={{ width: `${progress * 100}%` }} />
      <div className="mx-auto max-w-[1200px] px-5 pb-12 pt-8 sm:px-8 sm:pt-10 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--line)] pb-4">
          <Eyebrow>Formal-to-human reconstruction · Dossier 01</Eyebrow>
          <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.1em] text-[color:var(--ink-faint)]">
            <span>{repo.dossierDate}</span>
            <span className="hidden h-3 w-px bg-[color:var(--line-dark)] sm:block" />
            <span className="hidden sm:block">≈ 24 min</span>
            <a href="#artifacts" className="flex items-center gap-1 text-[color:var(--pine)] hover:text-[color:var(--terra)]">
              Files <Arrow className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="grid gap-10 pb-12 pt-10 xl:grid-cols-[1.12fr_0.88fr] xl:gap-14 xl:pt-16">
          <div className="fade-up">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--terra)]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.17em] text-[color:var(--ink-soft)]">
                Alpöge × Claude · Lean 4 · announced 20.11.2026
              </span>
            </div>
            <h1 className="display text-[50px] text-[color:var(--pine)] sm:text-[68px] xl:text-[78px]">
              Riemann
              <br />
              <span className="italic text-[color:var(--terra)]">reconstructed.</span>
            </h1>
            <p className="mt-7 max-w-[38rem] text-[15.5px] leading-[1.75] text-[color:var(--ink-soft)] sm:text-[17px]">
              A traceable, auditable reconstruction of what the 17-million-line Lean archive actually
              establishes — the exact theorems, the readable proof reductions, the deep interfaces,
              and the place where human explanation still stops.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#reconstruction"
                className="group inline-flex items-center gap-2 bg-[color:var(--pine)] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--cream)] transition hover:bg-[color:var(--pine-3)]"
              >
                Read the reconstruction <Arrow className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </a>
              <a
                href="#artifacts"
                className="inline-flex items-center gap-2 border border-[color:var(--line-dark)] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--ink-soft)] transition hover:border-[color:var(--pine)] hover:text-[color:var(--pine)]"
              >
                <DownloadIcon className="h-3.5 w-3.5" /> Open the dossier
              </a>
            </div>
            <div className="mt-8 grid max-w-[31rem] grid-cols-3 gap-4 border-t border-[color:var(--line)] pt-5">
              <div>
                <p className="serif text-xl text-[color:var(--pine)] sm:text-2xl">175,187</p>
                <p className="mt-1 font-mono text-[8px] uppercase leading-[1.5] tracking-[0.08em] text-[color:var(--ink-faint)]">modules reported<br />compiled</p>
              </div>
              <div>
                <p className="serif text-2xl text-[color:var(--pine)]">5</p>
                <p className="mt-1 font-mono text-[8px] uppercase leading-[1.5] tracking-[0.08em] text-[color:var(--ink-faint)]">endpoints<br />declared</p>
              </div>
              <div>
                <p className="serif text-2xl text-[color:var(--pine)]">3</p>
                <p className="mt-1 font-mono text-[8px] uppercase leading-[1.5] tracking-[0.08em] text-[color:var(--ink-faint)]">standard axioms<br />reported</p>
              </div>
            </div>
          </div>

          <div className="fade-up space-y-4" style={{ animationDelay: "120ms" }}>
            <CriticalStripFigure />
            <div className="border border-[color:var(--line)] bg-[#faf8f1]/80 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Standing of this dossier</span>
                <span className="font-mono text-[8px] text-[color:var(--terra)]">PARTIAL</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { status: "verified-report", text: "Formal endpoints accepted by independent kernels" },
                  { status: "inspected", text: "Reduction proofs reconstructed from source" },
                  { status: "open", text: "17M-line arithmetic core not humanly reconstructed" },
                ].map((row) => (
                  <div key={row.text} className="flex items-start gap-2.5">
                    <Badge status={row.status} label={statusMeta[row.status].label} />
                    <span className="pt-1 text-[11px] leading-snug text-[color:var(--ink-soft)]">{row.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[color:var(--line)] bg-[#e9e3d5]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p className="text-[11.5px] leading-relaxed text-[color:var(--ink-soft)]">
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[color:var(--pine)]">Scope · </span>
            RH for ζ and GRH for Dirichlet L-functions. Not Dedekind, Hecke or general automorphic GRH.
          </p>
          <p className="shrink-0 font-mono text-[8.5px] uppercase tracking-[0.1em] text-[color:var(--ink-faint)]">
            No build run by this dossier
          </p>
        </div>
      </div>
    </header>
  );
}

function SummarySection() {
  return (
    <Section
      id="summary"
      letter="A"
      eyebrow="Executive summary"
      title={
        <>
          A verified formal artifact,
          <br />
          <span className="italic text-[color:var(--terra)]">not yet a readable proof.</span>
        </>
      }
      intro="The archive does two distinct things. It supplies a Lean proof whose correctness has been reported by several independent kernel checks, and it exposes the absence of a complete human exposition of the hard arithmetic estimate. This dossier reconstructs the first reduction and maps the second."
    >
      <div className="ink-card relative mb-8 overflow-hidden p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-[0.08] paper-grid" aria-hidden />
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <Eyebrow light>The finding</Eyebrow>
            <p className="serif mt-4 max-w-[46rem] text-[25px] leading-[1.32] text-[#f5f0e3] sm:text-[31px]">
              The endpoint logic is short, exact, and reconstructible. The proof’s mathematical
              substance lies behind one opaque theorem, and no unconditional human proof of that
              theorem was found in the sources examined.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px border border-white/15 bg-white/15">
            {[
              ["175,187", ".lean files counted"],
              ["17.4M", "lines reported"],
              ["5", "exported theorems"],
              ["13", "unproved hypotheses in the Waterloo draft"],
            ].map(([value, label]) => (
              <div key={label} className="bg-[color:var(--pine)] p-4">
                <p className="serif text-[26px] leading-none text-[#e8dcc6]">{value}</p>
                <p className="mt-2 font-mono text-[8px] uppercase leading-[1.5] tracking-[0.1em] text-[#8fa298]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          {
            n: "01",
            kicker: "Established formally",
            title: "The five endpoints",
            body: "RH in Mathlib’s formulation and four Dirichlet-L statements follow from one half-plane theorem. The exported proof terms are short applications and were inspected.",
            badge: "verified-report",
          },
          {
            n: "02",
            kicker: "Added by this dossier",
            title: "A real reconstruction",
            body: "Euler-factor descent, primitive reflection, the treatment of the pole and trivial zeros, and the final reduction to RH are written out as numbered mathematics tied to Lean declarations.",
            badge: "inspected",
          },
          {
            n: "03",
            kicker: "Left unresolved",
            title: "The arithmetic core",
            body: "Theta-lift chains, Galois representations, Iwasawa-type windows and the analytic engine are mapped at the interface level only. Fabricating their proof would be worse than naming the gap.",
            badge: "open",
          },
        ].map((card) => (
          <article key={card.n} className="paper-card group flex flex-col p-5 transition hover:border-[color:var(--line-dark)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[10px] text-[color:var(--terra)]">{card.n}</span>
              <Badge status={card.badge} />
            </div>
            <p className="kicker">{card.kicker}</p>
            <h3 className="serif mt-1.5 text-[23px] leading-tight text-[color:var(--pine)]">{card.title}</h3>
            <p className="mt-3 text-[12.5px] leading-[1.7] text-[color:var(--ink-soft)]">{card.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="border border-[#c8d6c8] bg-[#eaf0e6] p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#3c604f]">Inside the formal scope</p>
          <ul className="mt-4 space-y-2.5">
            {scopeProof.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-snug text-[#355244]">
                <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-[#ddc8bd] bg-[#f3e9e2] p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a4a33]">Outside the evidence</p>
          <ul className="mt-4 space-y-2.5">
            {scopeNot.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-snug text-[#6f4434]">
                <span className="mt-[3px] block h-2 w-2 shrink-0 rounded-full border border-[#a45d43]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function StatementSection() {
  const [active, setActive] = useState(0);
  const ep = endpoints[active];
  return (
    <Section
      id="statement"
      letter="B"
      eyebrow="Theorem statements · Task 1"
      title={
        <>
          What, exactly,
          <br />
          has been proved?
        </>
      }
      intro="Five declarations, transcribed from the pinned Lean source with their quantifiers and exceptional cases intact. These are statements, not summaries; hypotheses are never silently dropped."
    >
      <div className="scrollbar-thin -mx-1 mb-5 flex gap-1 overflow-x-auto px-1 pb-2" role="tablist" aria-label="Exported theorems">
        {endpoints.map((item, i) => (
          <button
            key={item.key}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`shrink-0 border px-3.5 py-2.5 text-left transition ${
              active === i
                ? "border-[color:var(--pine)] bg-[color:var(--pine)] text-[color:var(--cream)]"
                : "border-[color:var(--line)] bg-[#f8f5ed] text-[color:var(--ink-soft)] hover:border-[color:var(--line-dark)]"
            }`}
          >
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] opacity-60">0{i + 1}</span>
            <span className="mt-1 block text-[11.5px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <article className="border border-[color:var(--line)] bg-[#faf8f2]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--line)] px-5 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] text-[color:var(--terra)]">0{active + 1}</span>
            <span className="mono text-[12px] text-[color:var(--pine)]">{ep.lean}</span>
            <span className="hidden h-3 w-px bg-[color:var(--line-dark)] sm:block" />
            <span className="font-mono text-[9px] text-[color:var(--ink-faint)]">{ep.source}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge status="inspected" label="Statement inspected" />
            <span className="border border-[color:var(--line)] px-2 py-1 font-mono text-[8.5px] text-[color:var(--ink-faint)]">proof · {ep.proof}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
          <div className="border-b border-[color:var(--line)] p-5 sm:p-7 lg:border-b-0 lg:border-r">
            <Eyebrow>Formal proposition</Eyebrow>
            <div className="mt-4 overflow-x-auto rounded-sm border border-[color:var(--line)] bg-[#f4f0e5] px-4 py-5">
              <Tex block>{ep.formal}</Tex>
            </div>
            <div className="mt-5">
              <p className="kicker mb-2.5">Hypotheses, retained</p>
              <div className="flex flex-wrap gap-1.5">
                {ep.hypotheses.map((h) => (
                  <span key={h} className="border border-[color:var(--line)] bg-[#f8f5ed] px-2 py-1 font-mono text-[9px] text-[color:var(--ink-soft)]">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-[#f1ecdf]/60 p-5 sm:p-7">
            <Eyebrow>In conventional mathematics</Eyebrow>
            <p className="mt-4 text-[13.5px] leading-[1.8] text-[color:var(--ink)]">{ep.reading}</p>
            <div className="mt-5 border-l-2 border-[color:var(--gold)] pl-3.5">
              <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Scope note</p>
              <p className="mt-1.5 text-[11.5px] leading-[1.7] text-[color:var(--ink-soft)]">{ep.scope}</p>
            </div>
            <div className="mt-5 rounded-sm border border-[color:var(--line)] bg-[#faf8f2] p-3">
              <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Type</p>
              <p className="mono mt-1 break-all text-[10px] leading-relaxed text-[color:var(--pine)]">{ep.type}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[color:var(--line)] p-3">
          <LeanBlock code={ep.leanCode} label={`${ep.lean} · declaration`} collapsible />
        </div>
      </article>

      <div className="mt-5 flex flex-col gap-3 border border-[color:var(--line)] bg-[#f5f1e6] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11.5px] leading-relaxed text-[color:var(--ink-soft)]">
          <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-[color:var(--pine)]">Statement anchor · </span>
          Mathlib’s <span className="mono text-[10.5px]">RiemannHypothesis</span> is external to the archive. The archive proves it; it does not redefine it.
        </p>
        <a href="#axioms" className="shrink-0 font-mono text-[9px] uppercase tracking-[0.1em] text-[color:var(--terra)] hover:underline">
          Statement integrity →
        </a>
      </div>
    </Section>
  );
}

function ArchitectureSection() {
  const color: Record<string, string> = {
    verified: "#4f7c68",
    inspected: "#4a7385",
    bridge: "#aa7c32",
    opaque: "#a54f34",
  };
  return (
    <Section
      id="architecture"
      letter="C"
      eyebrow="Proof architecture"
      title={
        <>
          One half-plane theorem.
          <br />
          Four readable ways out.
        </>
      }
      intro="The formal graph runs from a single deep character-wide result to five exported endpoints. This is a source-level map: the reduction layer was inspected and reconstructed; the arithmetic interfaces were read; their internal proofs were not."
    >
      <div className="mb-8 overflow-x-auto border border-[color:var(--line)] bg-[#f8f5ed] px-4 py-3">
        <p className="mono whitespace-nowrap text-[10px] leading-relaxed text-[color:var(--ink-soft)]">
          <span className="text-[color:var(--pine)]">EveryCharacter</span>
          <span className="text-[color:var(--terra)]"> ── Claim.strip ──▶ </span>DirichletLZerosOnLine
          <span className="text-[color:var(--terra)]"> ── Claim.zeta ──▶ </span>RiemannZetaZerosOnLine
          <span className="text-[color:var(--terra)]"> ── rh_of_every ──▶ </span>RiemannHypothesis
        </p>
      </div>

      <div className="relative space-y-3">
        <div className="absolute bottom-8 left-[19px] top-8 w-px bg-[color:var(--line-dark)] md:left-[159px]" aria-hidden />
        {architecture.map((level, i) => (
          <div key={level.tier} className="relative grid gap-3 md:grid-cols-[160px_1fr] md:gap-6">
            <div className="relative flex items-center gap-3 md:justify-end md:pr-5">
              <div className="relative z-10 order-2 flex h-9 w-9 items-center justify-center rounded-full border-2 bg-[color:var(--paper)] md:order-1" style={{ borderColor: color[level.tone] }}>
                <span className="font-mono text-[10px]" style={{ color: color[level.tone] }}>{i}</span>
              </div>
              <span className="order-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[color:var(--ink-faint)] md:order-2">{level.tier}</span>
            </div>
            <div className="paper-card ml-12 p-5 md:ml-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="serif text-[22px] leading-tight text-[color:var(--pine)]">{level.title}</h3>
                  <p className="mono mt-1 text-[9px] text-[color:var(--ink-faint)]">{level.file}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.12em]" style={{ borderColor: `${color[level.tone]}55`, color: color[level.tone], background: `${color[level.tone]}10` }}>
                  <span className="evidence-dot" style={{ background: color[level.tone] }} />
                  {level.status}
                </span>
              </div>
              <p className="mt-3 max-w-3xl text-[12.5px] leading-[1.7] text-[color:var(--ink-soft)]">{level.body}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {level.lemmas.map((lemma) => (
                  <span key={lemma} className="rounded-sm border border-[color:var(--line)] bg-[#f8f5ed] px-2 py-1 font-mono text-[8.5px] text-[color:var(--ink-soft)]">
                    {lemma}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <div className="border border-[color:var(--line)] bg-[#f5f1e6] p-4">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.15em] text-[color:var(--ink-faint)]">Reading rule</p>
          <p className="mt-2 text-[12px] leading-[1.7] text-[color:var(--ink-soft)]">
            A declaration graph is not a chronological proof. Solid arrows in the dossier correspond to inspected proof-term dependencies. Editorial grouping and deep, source-read links are labelled separately.
          </p>
        </div>
        <div className="border border-[color:var(--line)] bg-[#f5f1e6] p-4">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.15em] text-[color:var(--ink-faint)]">What the reduction proves</p>
          <p className="serif mt-2 text-[16px] leading-snug text-[color:var(--pine)]">
            H ⇒ RH ∧ GRH<sub className="font-sans text-[10px]">Dirichlet</sub> ∧ GRH<sub className="font-sans text-[10px]">primitive</sub>.
          </p>
          <p className="mt-1.5 text-[11px] text-[color:var(--ink-faint)]">The antecedent H is not established here.</p>
        </div>
      </div>
    </Section>
  );
}

function ReconstructionSection() {
  const H = String.raw`H:\quad\forall N\ge1\ \forall\chi\ (\mathrm{mod}\ N)\ \forall s,\quad \operatorname{Re}(s)>\tfrac12\ \wedge\ (\chi\neq\mathbf1\ \vee\ s\neq1)\ \Longrightarrow\ L(\chi,s)\neq0`;
  return (
    <Section
      id="reconstruction"
      letter="D"
      eyebrow="Detailed reconstruction · Task 2"
      title={
        <>
          The proof we can
          <br />
          actually read.
        </>
      }
      intro="Everything below is reconstructed from inspected Lean proof terms in ClaimStrip.lean, CritLine.lean, and RhOfRight.lean. The mathematical steps are written independently of tactic names, but each is tied back to a declaration and source line."
    >
      <div className="mb-8 border border-[color:var(--pine-2)] bg-[color:var(--pine)] p-5 text-[color:var(--cream)] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8fa298]">The single analytic input · UpperTheory.EveryCharacter</p>
          <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#d0a26d]">Definition · inspected</span>
        </div>
        <div className="mt-4 overflow-x-auto rounded-sm border border-white/10 bg-white/[0.04] px-4 py-4">
          <Tex block>{H}</Tex>
        </div>
        <p className="mt-3 max-w-3xl text-[12px] leading-[1.7] text-[#b4c3ba]">
          The whole endpoint reconstruction is conditional on this one proposition. It is not an axiom:
          it is the statement proved by <span className="mono text-[10px] text-[#e8dcc6]">everyCharacter</span> deep in the archive.
        </p>
      </div>

      <div className="space-y-3">
        {proofSteps.map((step) => (
          <article key={step.n} className="group border border-[color:var(--line)] bg-[#faf8f2]">
            <div className="grid md:grid-cols-[76px_1fr]">
              <div className="flex items-start gap-3 border-b border-[color:var(--line)] p-4 md:block md:border-b-0 md:border-r">
                <span className="serif text-[32px] leading-none text-[color:var(--terra)]">{step.n}</span>
                <span className="mt-2 hidden h-px w-7 bg-[color:var(--line-dark)] md:block" />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="serif max-w-2xl text-[21px] leading-tight text-[color:var(--pine)]">{step.title}</h3>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="mono rounded-sm border border-[color:var(--line)] bg-[#f2eee3] px-2 py-1 text-[8.5px] text-[color:var(--pine)]">{step.lean}</span>
                    <span className="font-mono text-[8px] text-[color:var(--ink-faint)]">{step.source}</span>
                  </div>
                </div>
                <div className="mt-4 overflow-x-auto rounded-sm border-l-2 border-[color:var(--gold)] bg-[#f4f0e5] px-4 py-3">
                  <Tex block>{step.claim}</Tex>
                </div>
                <p className="mt-4 text-[12.5px] leading-[1.75] text-[color:var(--ink-soft)]">
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-[color:var(--pine)]">Proof · </span>
                  {step.proof}
                </p>
                <details className="mt-3">
                  <summary className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[color:var(--terra)]">
                    Source note <span className="chevron text-sm leading-none">+</span>
                  </summary>
                  <p className="mt-2 border-l border-[color:var(--line-dark)] pl-3 text-[11.5px] leading-[1.7] text-[color:var(--ink-faint)]">{step.note}</p>
                </details>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="border border-[#c8d6c8] bg-[#eaf0e6] p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#3c604f]">What these reductions establish</p>
          <p className="serif mt-2 text-[18px] leading-snug text-[#26453a]">
            If every Dirichlet L-function is nonzero for Re(s) &gt; ½ away from the pole, then all five
            exported statements follow — by the exact proof terms inspected.
          </p>
          <p className="mt-2 text-[11.5px] leading-[1.7] text-[#4d6758]">
            This conditional implication is a mathematical reconstruction, not a new formal proof.
            The reported kernel checks attest the compiled terms.
          </p>
        </div>
        <div className="border border-[color:var(--line)] bg-[#f5f1e6] p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--ink-faint)]">Two implementations, one mechanism</p>
          <p className="mt-2 text-[11.5px] leading-[1.7] text-[color:var(--ink-soft)]">
            <span className="mono text-[10px] text-[color:var(--pine)]">Claim.strip</span> first descends to a primitive character, then reflects.
            <span className="mono ml-1 text-[10px] text-[color:var(--pine)]">critLine</span> reflects directly for a primitive character. The duplication is a useful consistency point.
          </p>
        </div>
      </div>
    </Section>
  );
}

function DeepCoreSection() {
  return (
    <Section
      id="deep-core"
      letter="E"
      eyebrow="The deep core · Tasks 2 & 5"
      title={
        <>
          Where explanation
          <br />
          <span className="italic text-[color:var(--terra)]">stops.</span>
        </>
      }
      intro="This is the boundary of the reconstruction. The interfaces below are quoted from the archive, but the derivations inside them are not reconstructed. Treat this as a map, not a proof."
    >
      <div className="mb-6 flex flex-col gap-3 border border-[#ddc8bd] bg-[#f3e9e2] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#a45d43] font-mono text-[11px] text-[#8a4a33]">!</span>
          <p className="text-[12px] leading-[1.7] text-[#6f4434]">
            The author calls the argument “incredibly long” and says he intends to understand and impart it.
            No unconditional conventional exposition of this layer was found.
          </p>
        </div>
        <span className="shrink-0 font-mono text-[8.5px] uppercase tracking-[0.12em] text-[#8a4a33]">Unresolved for human exposition</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {deepInterfaces.map((item) => (
          <article key={item.name} className="flex flex-col border border-[color:var(--line)] bg-[#f8f5ed]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[color:var(--line)] px-4 py-3">
              <div>
                <h3 className="mono text-[11.5px] text-[color:var(--pine)]">{item.name}</h3>
                <p className="mt-0.5 font-mono text-[8px] text-[color:var(--ink-faint)]">{item.file}</p>
              </div>
              <Badge status={item.status} />
            </div>
            <div className="flex-1 p-3">
              <LeanBlock code={item.code} label="Pinned interface" />
            </div>
            <p className="border-t border-[color:var(--line)] px-4 py-3 text-[11px] leading-[1.65] text-[color:var(--ink-soft)]">{item.note}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 overflow-hidden border border-[color:var(--line)] bg-[#faf8f2]">
        <div className="flex items-center justify-between border-b border-[color:var(--line)] px-5 py-3.5">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--ink-faint)]">Technique inventory · what is explained</p>
          <span className="font-mono text-[8px] text-[color:var(--ink-faint)]">Editorial assessment</span>
        </div>
        <div className="divide-y divide-[color:var(--line)]">
          {techniques.map((t) => (
            <div key={t.name} className="grid gap-1 px-5 py-3 sm:grid-cols-[200px_1fr_120px] sm:items-center sm:gap-4">
              <p className="text-[12px] font-medium text-[color:var(--pine)]">{t.name}</p>
              <p className="text-[11.5px] text-[color:var(--ink-soft)]">{t.role}</p>
              <span className={`justify-self-start font-mono text-[8.5px] uppercase tracking-[0.1em] sm:justify-self-end ${
                t.status === "reconstructed" ? "text-[#3c604f]" : t.status === "conceptual" ? "text-[#8a6a2f]" : "text-[#8a4a33]"
              }`}>
                {t.status === "reconstructed" ? "✓ reconstructed" : t.status === "conceptual" ? "◐ outline only" : "◇ source-read"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 border border-[color:var(--line)] bg-[#f5f1e6]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[color:var(--line)] px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--ink-faint)]">
            The Waterloo draft · thirteen inputs behind its main inequality (M)
          </p>
          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#8a4a33]">Secondary exposition · none proved outright there</span>
        </div>
        <div className="grid grid-cols-2 divide-x divide-y divide-[color:var(--line)] sm:grid-cols-3 lg:grid-cols-4">
          {waterlooHypotheses.map(([label, role, status]) => (
            <div key={label} className="p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="mono text-[10px] text-[color:var(--pine)]">{label}</span>
                <span className={`font-mono text-[7px] uppercase tracking-[0.08em] ${
                  status === "assumed" ? "text-[#8a4a33]" : status === "quoted" || status === "mixed" ? "text-[#8a6a2f]" : "text-[#3c604f]"
                }`}>{status}</span>
              </div>
              <p className="mt-1 text-[10px] leading-[1.5] text-[color:var(--ink-soft)]">{role}</p>
            </div>
          ))}
        </div>
        <p className="border-t border-[color:var(--line)] px-4 py-2.5 text-[10px] leading-[1.65] text-[color:var(--ink-faint)]">
          Labels transcribed from §III.11 (pp. 193–194). This records the status of the working exposition,
          not of the Lean declarations. Full table and caveats in the gap audit.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <blockquote className="border-l-2 border-[color:var(--terra)] pl-5">
          <p className="serif text-[20px] leading-[1.45] text-[color:var(--pine)]">
            “An astounding amount of mathematics is present in the argument, far more than I had imagined
            would be necessary as a student. My intuition insists it will be massively simplified, likely immediately.”
          </p>
          <footer className="mt-3 font-mono text-[8.5px] uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">
            Levent Alpöge · <cite className="not-italic">Remark</cite>, 20 November 2026
          </footer>
        </blockquote>
        <div className="border border-[color:var(--line)] bg-[#f5f1e6] p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--ink-faint)]">The secondary exposition</p>
          <h3 className="serif mt-2 text-[19px] text-[color:var(--pine)]">265 pages, still conditional</h3>
          <p className="mt-2 text-[11.5px] leading-[1.7] text-[color:var(--ink-soft)]">
            The Waterloo working draft specialises the argument to ζ. It does not prove its main
            inequality (M); it reduces (M), and RH with it, to <strong className="font-medium text-[color:var(--pine)]">thirteen numbered hypotheses</strong>.
          </p>
          <a
            href="https://www.math.uwaterloo.ca/~mrubinst/alpoge_claude_grh/zeta-paper_v2.pdf"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[color:var(--terra)] hover:underline"
          >
            Read the draft <ExternalIcon className="h-3 w-3" />
          </a>
        </div>
      </div>
    </Section>
  );
}

function DependenciesSection() {
  const chain = [
    { code: "riemannHypothesis", note: "Main.lean:4", indent: 0 },
    { code: "→ Formalism.VW.rh_of_every allChi", note: "CritLine.lean:29", indent: 1 },
    { code: "→ rh_of_right + LFunction_modOne_eq", note: "RhOfRight.lean:5", indent: 2 },
    { code: "→ UpperTheory.EveryCharacter", note: "EveryCharacter.lean:13", indent: 0, divider: true },
    { code: "→ everyCharacter", note: "MainConclusion.lean:10", indent: 1 },
    { code: "→ everyCharacter_of_row galoisLocalGlobalStrong_recParameter", note: "MainConclusion.lean:7", indent: 2 },
    { code: "→ every_character_of_literature_of_vWin ⟨Row0b, recTExists, Row0b⟩ (vwin_of_row …)", note: "…OfVWin.lean:810", indent: 3 },
    { code: "→ Row0b · recTExists · VWinAt ψ 401 · theta integrals · local matching", note: "deep interfaces", indent: 4, deep: true },
  ];
  return (
    <Section
      id="dependencies"
      letter="F"
      eyebrow="Dependency analysis · Task 3"
      title={
        <>
          The chain, and the
          <br />
          limits of extraction.
        </>
      }
      intro="A source-level dependency map at the pinned commit. It is not an elaborated environment dump: no Lean command was run. The distinction matters, and is marked wherever it arises."
    >
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-[color:var(--line)] bg-[#f8f5ed]">
          <div className="flex items-center justify-between border-b border-[color:var(--line)] px-5 py-3.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--ink-faint)]">Primary proof-term path</p>
            <span className="font-mono text-[8px] text-[color:var(--ink-faint)]">Inspected</span>
          </div>
          <div className="p-4 sm:p-5">
            {chain.map((node, i) => (
              <div key={i}>
                {node.divider && <div className="my-3 border-t border-dashed border-[color:var(--line-dark)]" />}
                <div className="flex items-start gap-2" style={{ paddingLeft: `${node.indent * 16}px` }}>
                  <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${node.deep ? "bg-[color:var(--terra)]" : "bg-[color:var(--sage)]"}`} />
                  <div className="min-w-0">
                    <p className={`mono break-all text-[10px] leading-[1.6] ${node.divider ? "text-[color:var(--pine)]" : node.deep ? "text-[#8a4a33]" : "text-[color:var(--ink-soft)]"}`}>
                      {node.code}
                    </p>
                    <p className="mt-0.5 font-mono text-[7.5px] uppercase tracking-[0.08em] text-[color:var(--ink-faint)]">{node.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-[color:var(--line)] px-5 py-3">
            <a href="/dossier/DEPENDENCY_GRAPH.mmd" download className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[color:var(--terra)] hover:underline">
              <DownloadIcon className="h-3 w-3" /> Mermaid graph · 2 views
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-[color:var(--line)] bg-[#faf8f2] p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--ink-faint)]">Extraction status</p>
            <div className="mt-3 space-y-3">
              {[
                ["Proof terms & declarations", "inspected", "Main.lean, MainTheorems.lean, reductions"],
                ["Deep interfaces", "source-read", "TopG, VWinAt, literatures, Row0b"],
                ["Elaborated environment graph", "not-run", "No Lean tooling run"],
                ["Transitive import closure", "not-run", "Thousands of modules"],
              ].map(([label, status, note]) => (
                <div key={label} className="border-b border-[color:var(--line)] pb-3 last:border-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[11.5px] font-medium text-[color:var(--pine)]">{label}</p>
                    <Badge status={status} label={status === "not-run" ? "Not extracted" : undefined} />
                  </div>
                  <p className="mt-1 text-[10.5px] text-[color:var(--ink-faint)]">{note}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-[color:var(--line)] bg-[#f5f1e6] p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--ink-faint)]">Direct dependencies, exactly</p>
            <p className="mt-2 text-[11.5px] leading-[1.7] text-[color:var(--ink-soft)]">
              <span className="mono text-[10px] text-[color:var(--pine)]">claimAll := ⟨allChi, Claim.strip allChi, Claim.zeta allChi⟩</span>.
              The exported strip theorem is literally its second projection; <span className="mono text-[10px]">rhOfAll</span> is reused for both zeta endpoints.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function LedgerSection() {
  return (
    <Section
      id="ledger"
      letter="G"
      eyebrow="Evidence ledger · Task 5"
      title={
        <>
          What is known,
          <br />
          and how we know it.
        </>
      }
      intro="Every row is labelled by the kind of evidence behind it. “Reported verified” means a named third party reports a machine result; “inspected here” means this dossier read the source; neither is silently upgraded."
    >
      <div className="overflow-hidden border border-[color:var(--line)] bg-[#faf8f2]">
        <div className="hidden grid-cols-[1fr_150px_240px] gap-4 border-b border-[color:var(--line)] bg-[#f1ecdf] px-5 py-3 font-mono text-[8px] uppercase tracking-[0.14em] text-[color:var(--ink-faint)] md:grid">
          <span>Proposition</span>
          <span>Evidence class</span>
          <span>Source</span>
        </div>
        <div className="divide-y divide-[color:var(--line)]">
          {ledger.map((row, i) => (
            <div key={i} className="grid gap-2 px-5 py-4 md:grid-cols-[1fr_150px_240px] md:items-start md:gap-4">
              <p className="text-[12px] leading-[1.65] text-[color:var(--ink)]">{row.claim}</p>
              <div><Badge status={row.status} /></div>
              <p className="mono text-[9px] leading-[1.6] text-[color:var(--ink-faint)]">{row.source}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="border border-[#c8d6c8] bg-[#eaf0e6] p-5">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#3c604f]">Executed in this session</p>
            <CheckIcon className="h-4 w-4 text-[#3c604f]" />
          </div>
          <ul className="mt-3 space-y-2">
            {executed.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[11.5px] leading-[1.6] text-[#355244]">
                <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-[#4f7c68]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-[#ddc8bd] bg-[#f3e9e2] p-5">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8a4a33]">Not executed here</p>
            <span className="font-mono text-[10px] text-[#a45d43]">—</span>
          </div>
          <ul className="mt-3 space-y-2">
            {notExecuted.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[11.5px] leading-[1.6] text-[#6f4434]">
                <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-[#a45d43]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 border border-[color:var(--line)] bg-[#f5f1e6] px-5 py-4">
        <p className="text-[11.5px] leading-[1.75] text-[color:var(--ink-soft)]">
          <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-[color:var(--pine)]">Method · </span>
          Targeted inspection, not indiscriminate reading. The archive was cloned bloblessly, sparse paths were checked out, and exactly the declarations on the critical path plus their immediate interfaces were opened. See <a href="/dossier/REPRODUCIBILITY.md" className="text-[color:var(--terra)] underline decoration-[color:var(--line-dark)] underline-offset-2 hover:decoration-[color:var(--terra)]">Reproducibility</a>.
        </p>
      </div>
    </Section>
  );
}

function AxiomsSection() {
  return (
    <Section
      id="axioms"
      letter="H"
      eyebrow="Axioms & assumptions · Task 5B"
      title={
        <>
          Three standard axioms.
          <br />
          One important trust boundary.
        </>
      }
      intro="The reported axiom audit is a strong statement about formal dependence. It is not a proof that Mathlib's zeta definition matches every informal expectation, and it is not a human audit of the arithmetic core."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {axioms.map((a, i) => (
          <div key={a.name} className="paper-card p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-[color:var(--terra)]">AX-{i + 1}</span>
              <span className="h-2 w-2 rounded-full bg-[#4f7c68]" />
            </div>
            <p className="mono mt-3 text-[12px] text-[color:var(--pine)]">{a.name}</p>
            <p className="mt-2 text-[11.5px] leading-[1.65] text-[color:var(--ink-soft)]">{a.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 border border-[#ddc8bd] bg-[#f3e9e2] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8a4a33]">Audit status</p>
            <p className="serif mt-1.5 text-[19px] text-[#6f4434]">Reported, not reproduced by this dossier.</p>
          </div>
          <Badge status="not-run" label="Not executed" />
        </div>
        <p className="mt-2 max-w-3xl text-[11.5px] leading-[1.7] text-[#6f4434]">
          MIT reports only <span className="mono text-[10px]">propext</span>, <span className="mono text-[10px]">Classical.choice</span> and <span className="mono text-[10px]">Quot.sound</span> for the five theorems; Waterloo reports the same; the Lean/Mathlib statement certifies the proof. We ran no <span className="mono text-[10px]">#print axioms</span>. The <a href="/dossier/AXIOMS_AND_ASSUMPTIONS.md" className="underline underline-offset-2">full report</a> records exactly what was run.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="border border-[color:var(--line)] bg-[#faf8f2] p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--ink-faint)]">Explicit hypotheses · necessary</p>
          <div className="mt-3 space-y-2.5 text-[11.5px] leading-[1.65] text-[color:var(--ink-soft)]">
            <p><span className="mono text-[10px] text-[color:var(--pine)]">s ≠ 1</span> — Mathlib’s pole convention; ζ(1) is a nonzero junk value here, so this is definitional rather than an analytic exclusion.</p>
            <p><span className="mono text-[10px] text-[color:var(--pine)]">s ∉ {`{−2(n+1)}`}</span> — genuine zeros off the line; cannot be dropped.</p>
            <p><span className="mono text-[10px] text-[color:var(--pine)]">N ≥ 1</span> — positive modulus for Dirichlet characters; enforced by <span className="mono text-[10px]">NeZero</span>.</p>
            <p><span className="mono text-[10px] text-[color:var(--pine)]">χ ≠ 1 ∨ s ≠ 1</span> — the single pole exception, vacuous for nontrivial χ.</p>
            <p><span className="mono text-[10px] text-[color:var(--pine)]">0 &lt; Re(s) &lt; 1</span> — the scope of the strip endpoint, not a convenience.</p>
          </div>
        </div>
        <div className="border border-[color:var(--line)] bg-[#faf8f2] p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--ink-faint)]">The trust boundary</p>
          <ul className="mt-3 space-y-2.5 text-[11.5px] leading-[1.65] text-[color:var(--ink-soft)]">
            <li className="flex gap-2"><span className="text-[color:var(--sage)]">✓</span> Kernel validity relative to Lean and Mathlib definitions.</li>
            <li className="flex gap-2"><span className="text-[color:var(--sage)]">✓</span> Statement match reported by two independent tools.</li>
            <li className="flex gap-2"><span className="text-[color:var(--terra)]">–</span> Intended meaning of every Mathlib definition.</li>
            <li className="flex gap-2"><span className="text-[color:var(--terra)]">–</span> Human understanding of the arithmetic core.</li>
            <li className="flex gap-2"><span className="text-[color:var(--terra)]">–</span> Peer review, publication, or prize recognition.</li>
          </ul>
        </div>
      </div>
    </Section>
  );
}

function AuditSection() {
  return (
    <Section
      id="audit"
      letter="I"
      eyebrow="Error & gap audit · Task 4"
      title={
        <>
          Six findings,
          <br />
          including our own error.
        </>
      }
      intro="A finding can be about the formal source, the secondary prose, or this reconstruction. Severity is scoped accordingly. One initial metadata finding was traced to our own counting command and is retained here as a self-correction."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {findings.map((f) => (
          <article key={f.n} className="flex flex-col border border-[color:var(--line)] bg-[#faf8f2] p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="serif text-[27px] leading-none text-[color:var(--terra)]">{f.n}</span>
              <span className={`rounded-full border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] ${
                f.severity === "High"
                  ? "border-[#ddc2b5] bg-[#f2e3dc] text-[#843b26]"
                  : f.severity === "Medium"
                    ? "border-[#ddcda8] bg-[#f2ead8] text-[#79561d]"
                    : "border-[#c3d5c7] bg-[#e5ede5] text-[#315a49]"
              }`}>
                {f.severity === "None" ? "Self-corrected" : `${f.severity} severity`}
              </span>
            </div>
            <h3 className="serif mt-3 text-[19px] leading-tight text-[color:var(--pine)]">{f.title}</h3>
            <p className="mt-2 flex-1 text-[11.5px] leading-[1.7] text-[color:var(--ink-soft)]">{f.body}</p>
            <p className="mt-4 border-t border-[color:var(--line)] pt-2.5 font-mono text-[8px] uppercase tracking-[0.1em] text-[color:var(--ink-faint)]">{f.scope}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="border border-[#c8d6c8] bg-[#eaf0e6] p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#3c604f]">Components found consistent, within scope</p>
          <p className="mt-2 text-[11.5px] leading-[1.75] text-[#355244]">
            The inspected Lean scripts for Euler-factor nonvanishing, conductor descent, Gamma nonvanishing,
            primitive reflection, the strip reduction, the zeta reduction and the RH reflection are internally
            coherent as mathematics. Their hypotheses suffice for their conclusions. This is a human source
            audit; it is not a kernel check and does not cover uninspected files.
          </p>
        </div>
        <div className="border border-[color:var(--line)] bg-[#f5f1e6] p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--ink-faint)]">Read the full audit</p>
          <p className="mt-2 text-[11.5px] leading-[1.7] text-[color:var(--ink-soft)]">Twelve findings, severity table, scope discussion, and explicit non-claims.</p>
          <a href="/dossier/ERROR_AND_GAP_AUDIT.md" className="mt-3 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[color:var(--terra)] hover:underline">
            <DownloadIcon className="h-3 w-3" /> ERROR_AND_GAP_AUDIT.md
          </a>
        </div>
      </div>
    </Section>
  );
}

function ReproduceSection() {
  const commands = `# 1. Obtain the primary archive (14 parts) and verify
for i in $(seq -w 1 14); do curl -LO https://alpo.ge/lean.tar.gz.part$i; done
cat lean.tar.gz.part{01..14} > lean.tar.gz
shasum -a 256 lean.tar.gz
# expected 9631b4f0…49c7fc · 239,275,554 bytes

# 2. Use the pinned environment
source ~/.elan/env
lake exe cache get
lake build Statements
lake build Main

# 3. Audit the formal dependencies
cat > Check.lean <<'LEAN'
import Main
#print axioms riemannHypothesis
#print axioms riemannZeta_eq_zero_re
#print axioms LFunction_ne_zero_of_half_lt_re
#print axioms LFunction_eq_zero_re
#print axioms LFunction_eq_zero_re_of_isPrimitive
LEAN
lake env lean Check.lean

# 4. Compare and replay the export with independent kernels
# leanchecker · nanoda · con-leche · con-ron · lean4lean
# See the MIT verification page for exact commands and logs.`;

  return (
    <Section
      id="reproduce"
      letter="J"
      eyebrow="Reproducibility · Method"
      title={
        <>
          Check it yourself.
          <br />
          Report exactly what ran.
        </>
      }
      intro="A passing check is only meaningful with a pinned revision, a recorded environment, and complete logs. These commands reproduce the machine checks; they do not produce a human proof."
    >
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="lean-block scrollbar-thin overflow-x-auto rounded-sm">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#91a99e]">Shell · reproduction sketch</span>
              <span className="font-mono text-[8px] uppercase text-[#c19a52]">not run here</span>
            </div>
            <pre className="whitespace-pre px-4 py-4 text-[10px] leading-[1.8] text-[#dbe7de]">{commands}</pre>
          </div>
          <p className="mt-2.5 font-mono text-[8.5px] leading-relaxed text-[color:var(--ink-faint)]">
            Full discussion in <a href="/dossier/REPRODUCIBILITY.md" className="text-[color:var(--terra)] underline underline-offset-2">REPRODUCIBILITY.md</a>. Resource figures are reported, not measured by us.
          </p>
        </div>
        <div className="space-y-4">
          <div className="border border-[color:var(--line)] bg-[#faf8f2] p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--ink-faint)]">Pinned coordinates</p>
            <dl className="mt-3 space-y-2.5">
              {[
                ["Lean", "v4.33.1"],
                ["Mathlib", repo.mathlib],
                ["Mirror commit", repo.commit],
                ["Archive SHA-256", repo.archiveSha],
                ["Files in tree", "175,192 total · 5 metadata"],
                [".lean files counted", "175,187"],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[100px_1fr] gap-2 border-b border-[color:var(--line)] pb-2 last:border-0 last:pb-0">
                  <dt className="font-mono text-[8.5px] uppercase tracking-[0.08em] text-[color:var(--ink-faint)]">{label}</dt>
                  <dd className="mono break-all text-[9px] leading-relaxed text-[color:var(--pine)]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="border border-[#ddc8bd] bg-[#f3e9e2] p-4">
            <p className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-[#8a4a33]">Resource reality</p>
            <p className="mt-1.5 text-[11px] leading-[1.65] text-[#6f4434]">
              The full export is 61.57 GB uncompressed; the comparator path is reported to need on the order of 100 GB RAM and 70 GB disk, and Lean kernel stages are single-threaded.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ArtifactsSection() {
  return (
    <Section
      id="artifacts"
      letter="K"
      eyebrow="The dossier · Deliverables A–L"
      title={
        <>
          Twelve files,
          <br />
          fully traceable.
        </>
      }
      intro="A complete written research dossier accompanies this page. Every artifact marks its own verification status; none substitutes machine verification for mathematical explanation."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {artifacts.map((a) => (
          <a
            key={a.file}
            href={`/dossier/${a.file}`}
            download
            className="group flex flex-col border border-[color:var(--line)] bg-[#faf8f2] p-4 transition hover:border-[color:var(--pine)] hover:bg-[#f6f2e7]"
          >
            <div className="flex items-start justify-between">
              <span className="serif text-[25px] leading-none text-[color:var(--terra)]">{a.letter}</span>
              <span className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">{a.kind}</span>
            </div>
            <h3 className="serif mt-3 text-[17px] leading-tight text-[color:var(--pine)]">{a.title}</h3>
            <p className="mt-1.5 flex-1 text-[10.5px] leading-[1.6] text-[color:var(--ink-soft)]">{a.blurb}</p>
            <div className="mt-3 flex items-center justify-between border-t border-[color:var(--line)] pt-2.5">
              <span className="mono text-[8px] text-[color:var(--ink-faint)]">{a.file}</span>
              <DownloadIcon className="h-3.5 w-3.5 text-[color:var(--ink-faint)] transition group-hover:text-[color:var(--terra)]" />
            </div>
          </a>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4 border border-[color:var(--line)] bg-[#f1ecdf] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--ink-faint)]">Start here</p>
          <p className="serif mt-1 text-[19px] text-[color:var(--pine)]">Executive summary & the detailed reconstruction</p>
          <p className="mt-1 text-[11px] text-[color:var(--ink-soft)]">The claims, the proofs, the interfaces, the evidence, and the limits.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/dossier/EXECUTIVE_SUMMARY.md" download className="inline-flex items-center gap-1.5 bg-[color:var(--pine)] px-3.5 py-2.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[color:var(--cream)] hover:bg-[color:var(--pine-3)]">
            <DownloadIcon className="h-3 w-3" /> Summary
          </a>
          <a href="/dossier/DETAILED_PROOF_RECONSTRUCTION.md" download className="inline-flex items-center gap-1.5 border border-[color:var(--line-dark)] px-3.5 py-2.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[color:var(--pine)] hover:border-[color:var(--pine)]">
            <DownloadIcon className="h-3 w-3" /> Reconstruction
          </a>
          <a href="/dossier/DECLARATION_TRACEABILITY.csv" download className="inline-flex items-center gap-1.5 border border-[color:var(--line-dark)] px-3.5 py-2.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[color:var(--pine)] hover:border-[color:var(--pine)]">
            <DownloadIcon className="h-3 w-3" /> CSV
          </a>
        </div>
      </div>
    </Section>
  );
}

function SourcesSection() {
  return (
    <Section
      id="sources"
      letter="L"
      eyebrow="Sources & method"
      title={
        <>
          Attribution is
          <br />
          part of the argument.
        </>
      }
      intro="Primary archive, named verification efforts, mathematical exposition, and reading aids are kept distinct. No secondary source is used to support a stronger claim than it states."
    >
      <div className="border-t border-[color:var(--line)]">
        {bibliography.map((src) => (
          <a
            key={src.title}
            href={src.href}
            target="_blank"
            rel="noreferrer"
            className="group grid gap-1.5 border-b border-[color:var(--line)] py-4 transition hover:bg-[#f6f2e7] sm:grid-cols-[80px_1fr_130px_24px] sm:items-baseline sm:gap-4 sm:px-2"
          >
            <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[color:var(--terra)]">{src.tag}</span>
            <div>
              <p className="serif text-[17px] leading-snug text-[color:var(--pine)] group-hover:text-[color:var(--terra)]">{src.title}</p>
              <p className="mt-0.5 text-[11px] text-[color:var(--ink-soft)]">{src.author} · <span className="text-[color:var(--ink-faint)]">{src.note}</span></p>
            </div>
            <span className="font-mono text-[8.5px] text-[color:var(--ink-faint)] sm:text-right">{src.date}</span>
            <ExternalIcon className="hidden h-3.5 w-3.5 text-[color:var(--ink-faint)] group-hover:text-[color:var(--terra)] sm:block" />
          </a>
        ))}
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-3">
        <div className="border border-[color:var(--line)] bg-[#f5f1e6] p-4 md:col-span-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--ink-faint)]">Methodological references</p>
          <p className="mt-2 text-[11.5px] leading-[1.7] text-[color:var(--ink-soft)]">
            ITPEval, Herald, FIRMA, and LEAP inform translation fidelity, formal/informal alignment,
            proof decomposition, and reproducible evaluation. They are methodological references, not
            evidence for these mathematical claims. No ITPEval or agentic proof-search run was performed.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {[
              ["ITPEval", "https://github.com/lean-dojo/ITPEval"],
              ["Herald", "https://github.com/frenzymath/herald_translator"],
              ["FIRMA", "https://github.com/smfatima3/FIRMA"],
              ["LEAP", "https://github.com/google-deepmind/superhuman/tree/main/leap"],
            ].map(([name, href]) => (
              <a key={name} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[color:var(--terra)] hover:underline">
                {name} <ExternalIcon className="h-2.5 w-2.5" />
              </a>
            ))}
          </div>
        </div>
        <div className="ink-card p-4">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-[#91a99e]">Correction policy</p>
          <p className="mt-2 text-[11px] leading-[1.7] text-[#c8d4cc]">
            If a declaration, line number, dependency, or verification status is wrong, it should be corrected
            against the pinned source — not defended. This dossier is a working reconstruction.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="bg-[color:var(--pine)] text-[color:var(--cream)]">
      <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-[1.3fr_0.7fr]">
          <div>
            <Eyebrow light>Closing assessment</Eyebrow>
            <p className="display mt-4 max-w-[38rem] text-[34px] leading-[1.1] text-[#f5f0e3] sm:text-[46px]">
              Reconstruct the proof,
              <br />
              <span className="italic text-[#d6b07a]">not the claim.</span>
            </p>
            <p className="mt-5 max-w-[36rem] text-[12.5px] leading-[1.75] text-[#a9b9b0]">
              The formal artifact deserves to be taken seriously on its own terms. So does the expository
              debt: a kernel does not explain, a headline does not reconstruct, and a named technique is
              not an argument. This dossier treats each status as distinct.
            </p>
          </div>
          <div className="space-y-4 font-mono text-[9px] text-[#91a99e]">
            <div>
              <p className="uppercase tracking-[0.14em] text-[#70847a]">Evidence</p>
              <p className="mt-1.5 leading-relaxed">Source inspected · verification attributed</p>
            </div>
            <div>
              <p className="uppercase tracking-[0.14em] text-[#70847a]">Pins</p>
              <p className="mt-1.5 leading-relaxed">Commit {shortHash} · Lean 4.33.1<br />Mathlib 0df444a3</p>
            </div>
            <div>
              <p className="uppercase tracking-[0.14em] text-[#70847a]">Status</p>
              <p className="mt-1.5 leading-relaxed text-[#d6b07a]">Partial reconstruction · v1</p>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#70847a]">
            Research dossier · not a proof of the Riemann Hypothesis · 23.11.2026
          </p>
          <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#70847a]">
            Mathematics by Levent Alpöge, with Claude. Reconstruction & audit: this document.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const { active, progress } = useActiveSection();
  return (
    <div className="min-h-screen lg:pl-[286px]">
      <Sidebar active={active} />
      <MobileBar active={active} />
      <main>
        <Hero progress={progress} />
        <SummarySection />
        <StatementSection />
        <ArchitectureSection />
        <ReconstructionSection />
        <DeepCoreSection />
        <DependenciesSection />
        <LedgerSection />
        <AxiomsSection />
        <AuditSection />
        <ReproduceSection />
        <ArtifactsSection />
        <SourcesSection />
      </main>
      <Footer />
    </div>
  );
}
