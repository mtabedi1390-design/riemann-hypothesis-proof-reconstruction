export type Tier = "verified-report" | "inspected" | "source-read" | "open";

export const repo = {
  mirror: "mtabedi1390-design/riemann-hypothesis-lean",
  commit: "7cbf7a0c32fca1badf05931879a37c3f8a2b03b4",
  archiveSha: "9631b4f0…49c7fc",
  toolchain: "leanprover/lean4:v4.33.1",
  mathlib: "0df444a360eaa60ab8c11dca51a86af692955474",
  files: 175192,
  leanFiles: 175187,
  reportedModules: 175187,
  authored: "Levent Alpöge, with Claude",
  announced: "20 November 2026",
  dossierDate: "23 November 2026",
};

export const nav = [
  { id: "summary", letter: "A", label: "Executive summary" },
  { id: "statement", letter: "B", label: "Exact statements" },
  { id: "architecture", letter: "C", label: "Proof architecture" },
  { id: "reconstruction", letter: "D", label: "Reduction proofs" },
  { id: "deep-core", letter: "E", label: "The deep core" },
  { id: "dependencies", letter: "F", label: "Dependencies" },
  { id: "ledger", letter: "G", label: "Evidence ledger" },
  { id: "axioms", letter: "H", label: "Axioms & trust" },
  { id: "audit", letter: "I", label: "Gap audit" },
  { id: "reproduce", letter: "J", label: "Reproducibility" },
  { id: "artifacts", letter: "K", label: "Dossier files" },
  { id: "sources", letter: "L", label: "Sources" },
];

export const endpoints = [
  {
    key: "rh",
    label: "Riemann Hypothesis",
    lean: "riemannHypothesis",
    type: "RiemannHypothesis",
    source: "src/Main.lean:4",
    proof: "rhOfAll",
    formal:
      String.raw`\operatorname{RH}:\quad \forall s\in\mathbb C,\ \zeta(s)=0\ \Rightarrow\ \bigl(\nexists n\in\mathbb N,\ s=-2(n+1)\bigr)\ \Rightarrow\ s\neq 1\ \Rightarrow\ \operatorname{Re}(s)=\tfrac12`,
    reading:
      "Every zero of the Riemann zeta function is either a trivial zero −2, −4, −6, … or the excluded pole value 1, or it lies on the critical line.",
    hypotheses: ["s ∈ ℂ", "ζ(s) = 0", "s ∉ {−2(n+1)}", "s ≠ 1"],
    scope:
      "Mathlib's own definition. At the pole, Mathlib uses a junk value; at this pin it is nonzero (riemannZeta_one_ne_zero). The s ≠ 1 hypothesis records that the pole lies outside the zero set. The trivial-zero exclusion is genuinely necessary.",
    leanCode: `theorem riemannHypothesis : RiemannHypothesis := rhOfAll`,
  },
  {
    key: "zeta",
    label: "Written-out ζ statement",
    lean: "riemannZeta_eq_zero_re",
    type: "RiemannZetaZerosOnLine",
    source: "src/Statements.lean:3; src/Main.lean:6",
    proof: "rhOfAll",
    formal:
      String.raw`\forall s\in\mathbb C,\quad \zeta(s)=0\ \Longrightarrow\ \bigl(\neg\exists n\in\mathbb N,\ s=-2((n:\mathbb C)+1)\bigr)\ \Longrightarrow\ s\neq1\ \Longrightarrow\ \operatorname{Re}(s)=\tfrac12`,
    reading:
      "The same assertion written without reference to Mathlib's named class. Claim.Zeta ↔ RiemannHypothesis is proved by Iff.rfl, i.e. definitional equality.",
    hypotheses: ["s ∈ ℂ", "ζ(s) = 0", "explicit trivial-zero exclusion", "s ≠ 1"],
    scope:
      "A statement-level restatement, not a second independent proof. The proof term is again rhOfAll.",
    leanCode: `def RiemannZetaZerosOnLine : Prop :=\n  ∀ s : ℂ, riemannZeta s = 0 → (¬∃ n : ℕ, s = -2 * ((n : ℂ) + 1)) → s ≠ 1 → s.re = 1 / 2`,
  },
  {
    key: "half-plane",
    label: "Dirichlet nonvanishing",
    lean: "LFunction_ne_zero_of_half_lt_re",
    type: "DirichletLNonvanishingRightOfHalf",
    source: "src/Statements.lean:6; src/Main.lean:8",
    proof: "allChi",
    formal:
      String.raw`\forall N\ge1,\ \forall\chi\ (\mathrm{mod}\ N),\ \forall s\in\mathbb C,\quad \operatorname{Re}(s)>\tfrac12\ \wedge\ (\chi\neq\mathbf1\ \vee\ s\neq1)\ \Longrightarrow\ L(\chi,s)\neq0`,
    reading:
      "No Dirichlet L-function has a zero strictly to the right of the critical line, for every positive modulus and every character, primitive or not.",
    hypotheses: ["N ≥ 1", "χ mod N", "Re(s) > ½", "χ ≠ 1 or s ≠ 1"],
    scope:
      "The sole zero exception is the trivial character at its pole s = 1. For nontrivial χ the exception is vacuous. This is GRH for Dirichlet L-functions, not for all automorphic L-functions.",
    leanCode: `def DirichletLNonvanishingRightOfHalf : Prop :=\n  ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N) (s : ℂ),\n    1 / 2 < s.re → (χ ≠ 1 ∨ s ≠ 1) → DirichletCharacter.LFunction χ s ≠ 0`,
  },
  {
    key: "strip",
    label: "Zeros in the strip",
    lean: "LFunction_eq_zero_re",
    type: "DirichletLZerosOnLine",
    source: "src/Statements.lean:10; src/Main.lean:10",
    proof: "claimAll.2.1",
    formal:
      String.raw`\forall N\ge1,\ \forall\chi\ (\mathrm{mod}\ N),\ \forall s\in\mathbb C,\quad 0<\operatorname{Re}(s)<1\ \wedge\ L(\chi,s)=0\ \Longrightarrow\ \operatorname{Re}(s)=\tfrac12`,
    reading:
      "Every zero of every Dirichlet L-function lying in the open critical strip is on the critical line. This is the usual critical-strip formulation of Dirichlet GRH.",
    hypotheses: ["N ≥ 1", "χ mod N", "0 < Re(s) < 1", "L(χ,s) = 0"],
    scope:
      "Includes imprimitive characters. No claim is made about zeros outside the strip at this endpoint.",
    leanCode: `def DirichletLZerosOnLine : Prop :=\n  ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N) (s : ℂ),\n    0 < s.re → s.re < 1 → DirichletCharacter.LFunction χ s = 0 → s.re = 1 / 2`,
  },
  {
    key: "primitive",
    label: "Primitive characters",
    lean: "LFunction_eq_zero_re_of_isPrimitive",
    type: "PrimitiveDirichletLZerosOnLine",
    source: "src/Statements.lean:14; src/Main.lean:12",
    proof: "critAll",
    formal:
      String.raw`\forall N\ge1,\ \forall\chi\ (\mathrm{mod}\ N),\quad \chi\ \text{primitive}\ \Longrightarrow\ \forall s,\quad 0<\operatorname{Re}(s)<1\ \wedge\ L(\chi,s)=0\ \Longrightarrow\ \operatorname{Re}(s)=\tfrac12`,
    reading:
      "The critical-strip GRH statement restricted to primitive characters, the form in which it is usually stated. The passage from this to the imprimitive endpoint is proved separately by conductor descent.",
    hypotheses: ["N ≥ 1", "χ primitive", "0 < Re(s) < 1", "L(χ,s) = 0"],
    scope:
      "A genuine restriction. It is not the strongest endpoint; the all-character form is endpoint 04.",
    leanCode: `def PrimitiveDirichletLZerosOnLine : Prop :=\n  ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N), χ.IsPrimitive →\n    ∀ s : ℂ, 0 < s.re → s.re < 1 → DirichletCharacter.LFunction χ s = 0 → s.re = 1 / 2`,
  },
];

export const architecture = [
  {
    tier: "Tier 0",
    title: "Five exported endpoints",
    file: "src/Main.lean",
    tone: "verified",
    status: "Reported kernel-checked",
    body: "RH in Mathlib's formulation; the same statement written out; Dirichlet half-plane nonvanishing; all-character strip GRH; primitive strip GRH.",
    lemmas: ["riemannHypothesis", "riemannZeta_eq_zero_re", "LFunction_ne_zero_of_half_lt_re", "LFunction_eq_zero_re", "LFunction_eq_zero_re_of_isPrimitive"],
  },
  {
    tier: "Tier 1",
    title: "Readable reduction bridge",
    file: "MainTheorems · ClaimStrip · CritLine · RhOfRight",
    tone: "inspected",
    status: "Inspected & reconstructed here",
    body: "Euler-factor descent, reflection through functional equations, pole and trivial-zero handling. One half-plane input yields all five endpoints.",
    lemmas: ["rh_of_every", "rh_of_right", "critLine", "Claim.strip", "Claim.zeta"],
  },
  {
    tier: "Tier 2",
    title: "One character-wide theorem",
    file: "CharacterBoxes/EveryCharacter · MainConclusion",
    tone: "bridge",
    status: "Interface inspected",
    body: "UpperTheory.EveryCharacter is literally the half-plane proposition. The short assembly from the deep theorem is visible; its body is not.",
    lemmas: ["everyCharacter", "everyCharacter_of_row", "every_character_of_literature_of_vWin"],
  },
  {
    tier: "Tier 3",
    title: "Arithmetic supply & analytic engine",
    file: "Row0b · TopG · VWinAt · theta correspondence",
    tone: "opaque",
    status: "Source-read only",
    body: "Theta-lift chains, Galois representations, Iwasawa-type cohomology windows, a finite comparison, and a localized Landau argument. Not reconstructed.",
    lemmas: ["Row0b", "recTExists", "TopG", "VWinAt ψ 401", "ThetaIntegralsAgree", "LocalMatching"],
  },
];

export const proofSteps = [
  {
    n: "01",
    title: "Euler factors do not vanish in the half-plane",
    lean: "Claim.factor_ne_zero",
    source: "ClaimStrip.lean:7–21",
    claim: String.raw`\operatorname{Re}(s)>0,\ p\ \mathrm{prime}\ \Longrightarrow\ 1-\psi(p)p^{-s}\neq0.`,
    proof:
      "If the factor vanished then |ψ(p)p^{−s}| = 1. But |ψ(p)| ≤ 1 while |p^{−s}| = p^{−Re(s)} < 1 because p > 1 and Re(s) > 0. Contradiction.",
    note: "This is the finite, elementary input that lets a zero survive conductor descent.",
  },
  {
    n: "02",
    title: "Conductor descent",
    lean: "Claim.prim_zero",
    source: "ClaimStrip.lean:23–33",
    claim: String.raw`0<\operatorname{Re}(s)<1,\ L(\chi,s)=0\ \Longrightarrow\ L(\chi^{\mathrm{prim}},s)=0.`,
    proof:
      "The imprimitive L-function is the primitive one times a finite product of factors 1 − ψ(p)p^{−s}. Every factor is nonzero by step 01, so the product is nonzero. Hence the primitive L-value vanishes.",
    note: "Uses Mathlib's LFunction_changeLevel and the primitive reduction of Dirichlet characters.",
  },
  {
    n: "03",
    title: "Gamma factors are nonzero",
    lean: "Claim.gamma_ne_zero",
    source: "ClaimStrip.lean:35–40",
    claim: String.raw`\operatorname{Re}(t)>0\ \Longrightarrow\ \gamma(\phi,t)\neq0.`,
    proof:
      "Split on the parity of φ. The even branch is Gammaℝ(t); the odd branch is Gammaℝ(t+1). Both have positive real part, where Mathlib's Gammaℝ has no zeros.",
    note: "Needed to pass between L(χ,s) and the completed L-function.",
  },
  {
    n: "04",
    title: "Reflect a primitive zero",
    lean: "Claim.prim_reflect",
    source: "ClaimStrip.lean:42–57",
    claim: String.raw`L(\psi,s)=0\ \Longrightarrow\ L(\psi^{-1},1-s)=0\quad(\psi\ \mathrm{primitive},\ 0<\operatorname{Re}s<1).`,
    proof:
      "A zero of L gives a zero of the completed L-function because the Gamma factor is nonzero. The functional equation equates the completed L-value at 1 − s for ψ⁻¹ to a constant multiple of that at s for ψ, so it vanishes. Inverting a primitive character preserves primitiveness. Divide by the nonzero Gamma factor at 1 − s to return to L.",
    note: "No cancellation of factors is needed: zero-ness transfers through the functional equation regardless of the constant.",
  },
  {
    n: "05",
    title: "Half-plane ⇒ critical strip, for every character",
    lean: "Claim.strip",
    source: "ClaimStrip.lean:59–73",
    claim: String.raw`\forall\chi,\ 0<\operatorname{Re}s<1,\ L(\chi,s)=0\ \Longrightarrow\ \operatorname{Re}s=\tfrac12.`,
    proof:
      "Assume L(χ,s)=0 in the strip. If Re(s)>1/2, the half-plane theorem contradicts the zero. If Re(s)=1/2, done. If Re(s)<1/2, descend to the primitive ψ, reflect to L(ψ⁻¹,1−s)=0, and apply the half-plane theorem at 1−s, whose real part exceeds 1/2. Contradiction.",
    note: "This is the only place where the imprimitive → primitive passage is required for the strip endpoint.",
    open: true,
  },
  {
    n: "06",
    title: "Half-plane ⇒ ζ, including pole and trivial zeros",
    lean: "Claim.zeta",
    source: "ClaimStrip.lean:75–100",
    claim: String.raw`\forall s,\ \zeta(s)=0,\ s\notin\{-2(n+1)\},\ s\neq1\ \Longrightarrow\ \operatorname{Re}s=\tfrac12.`,
    proof:
      "s ≠ 0 because ζ(0) ≠ 0. If Re(s) ≥ 1 and s ≠ 1, classical nonvanishing on the closed right half-plane contradicts the zero (the pole value is excluded by the theorem's hypothesis). If 0 < Re(s) < 1, use L(1,s) = ζ(s) and step 05. If Re(s) ≤ 0, the Gamma factor cannot vanish except at 0 or a trivial zero, so the completed zeta function vanishes; its symmetry gives a zero at 1 − s with real part ≥ 1, contradicting classical nonvanishing.",
    note: "The formal file separately invokes Gammaℝ_eq_zero_iff, riemannZeta_def_of_ne_zero, and completedRiemannZeta_one_sub.",
  },
  {
    n: "07",
    title: "Half-plane ⇒ Mathlib's RH",
    lean: "Formalism.VW.rh_of_every",
    source: "CritLine.lean:29–32; RhOfRight.lean:5–62",
    claim: String.raw`H\ \Longrightarrow\ \operatorname{RH}.`,
    proof:
      "Apply H to the trivial character modulo 1; its L-function is ζ. Given a non-trivial, non-pole zero with Re(s) < 1/2, the asymmetric zeta functional equation produces ζ(1−s) = 0 with Re(1−s) > 1/2, contradicting H. The prefactor is checked nonzero using Gamma, cosine, and exponential nonvanishing, with the cosine zeros excluded exactly by the trivial-zero hypothesis.",
    note: "This is the endpoint used by both riemannHypothesis and riemannZeta_eq_zero_re.",
  },
];

export const ledger = [
  {
    claim: "The five endpoint declarations have the quoted types and use the stated proof terms.",
    status: "inspected",
    source: "Main.lean; Statements.lean; MainTheorems.lean",
  },
  {
    claim: "`UpperTheory.EveryCharacter` is definitionally the all-character half-plane statement.",
    status: "inspected",
    source: "CharacterBoxes/EveryCharacter.lean:13",
  },
  {
    claim: "Euler-factor descent, primitive reflection, and the ζ reduction are mathematically coherent and source-faithful.",
    status: "inspected",
    source: "ClaimStrip.lean, CritLine.lean, RhOfRight.lean",
  },
  {
    claim: "The library compiles; the five theorems depend only on propext, Classical.choice, Quot.sound.",
    status: "verified-report",
    source: "MIT verification page; Waterloo; Lean/Mathlib statement",
  },
  {
    claim: "The exported proof is accepted by independent kernels and statement comparison.",
    status: "verified-report",
    source: "MIT: nanoda, con-leche, con-ron, lean4lean; Lean/Mathlib statement",
  },
  {
    claim: "`every_character_of_literature_of_vWin` consumes `OpenLiteratureStatements` and `VWin` and calls the theta/local-matching assembly.",
    status: "source-read",
    source: "EveryCharacterOfLiteratureOfVWin.lean:810",
  },
  {
    claim: "`TopG`, `VWinAt`, and `Row0b` express the arithmetic supply and geometric construction.",
    status: "source-read",
    source: "ZeroFreeAllOfTopG.lean; ExistsPageN.lean; MainConclusion.lean",
  },
  {
    claim: "A complete unconditional human proof exists in the public sources examined.",
    status: "open",
    source: "Not found. Waterloo draft reduces to thirteen unproved hypotheses.",
  },
  {
    claim: "We built the archive and ran the axiom audit ourselves.",
    status: "not-run",
    source: "Not executed in this dossier session.",
  },
];

export const statusMeta: Record<string, { label: string; tone: string }> = {
  inspected: { label: "Inspected here", tone: "green" },
  "verified-report": { label: "Reported verified", tone: "blue" },
  "source-read": { label: "Source-read", tone: "amber" },
  open: { label: "Unresolved", tone: "red" },
  "not-run": { label: "Not executed", tone: "grey" },
};

export const deepInterfaces = [
  {
    name: "everyCharacter",
    file: "CharacterBoxes/MainConclusion.lean:10",
    status: "source-read",
    code: `theorem UpperTheory.FinalTheorems.everyCharacter : UpperTheory.EveryCharacter :=\n  UpperTheory.FinalTheorems.everyCharacter_of_row\n    UpperTheory.Gal.Int.galoisLocalGlobalStrong_recParameter`,
    note: "The deep theorem. The visible proof body is a single application; its mathematics lives in the row parameter.",
  },
  {
    name: "everyCharacter_of_row",
    file: "CharacterBoxes/MainConclusion.lean:7",
    status: "inspected",
    code: `theorem ...everyCharacter_of_row\n    (h : UpperTheory.GalStar.Row0b fun h rc => UpperTheory.Zero.LLC.IsRecT h rc) :\n    UpperTheory.EveryCharacter :=\n  UpperTheory.LiteratureTheorems.every_character_of_literature_of_vWin\n    ⟨h, UpperTheory.Zero.LLC.recTExists, h⟩ (UpperTheory.One.vwin_of_row h)`,
    note: "The exact assembly. Visible constructor: a Galois row, a reciprocity-parameter existence theorem, and a second row package.",
  },
  {
    name: "TopG",
    file: "CharacterBoxes/ZeroFreeAllOfTopG.lean:12",
    status: "source-read",
    code: `def TopG : Prop :=\n  ∀ (la : ℝ) (G : FReq), 1 < la → HostExW la G.req →\n    (∀ {eps : ℝ} (Fm : FamP eps), G.cls la Fm → HypV Fm.toFamCore) →\n    FamilyClassConnected (G.cls la)`,
    note: "A family-class connectedness assertion under host and geometric data. The internal meanings of FReq, HostExW and HypV were not reconstructed.",
  },
  {
    name: "VWinAt ψ 401",
    file: "CharacterBoxes/ExistsPageN.lean:44",
    status: "inspected",
    code: `def VWinAt (ψ : PChar) (Ct : ℝ) : Prop :=\n  ∀ eps : ℝ, 0 < eps → eps < 1 / 52 → ∀ e : ℝ → ℕ,\n    (∀ x ≥ 1, PageN eps x (e x)) →\n    ∃ J : ℝ, 1 ≤ J ∧ ∃ X0, ∀ X ≥ X0, ∀ q d,\n      WinPair eps (X ^ (1 / J)) q d →\n        ∃ Y, X ^ (1 / J) ≤ Y ∧ Y ^ 2 ≤ X ∧\n          ∀ x, Y ≤ x → x ≤ Y ^ 2 → VAt ψ eps Ct q d (e x) x`,
    note: "A weighted Galois-cohomology window on [Y, Y²], with auxiliary primes q ≡ 3 (mod 8), d ≡ 7 (mod 16). Proof of the window is inside vwin_of_row.",
  },
  {
    name: "OpenLiteratureStatements",
    file: "MainConclusion.lean:8 (constructor only)",
    status: "open",
    code: `⟨Row0b, UpperTheory.Zero.LLC.recTExists, Row0b⟩\n-- field names and full record definition not recovered`,
    note: "Do not guess the fields. The downstream call passes published_results_eigen, published_results_first, ThetaIntegralsAgree and LocalMatching.",
  },
];

export const waterlooHypotheses = [
  ["H0", "sizes of parameters, columns, densities", "partial"],
  ["H1", "size of the pairing", "named inputs"],
  ["H2", "level correction", "assumed"],
  ["H3", "heights of two words", "assumed"],
  ["H4", "level prime and count of forms", "mixed"],
  ["H5", "first lattice of forms", "assumed"],
  ["H6", "integrality / lower / upper pairing bounds", "named inputs"],
  ["H7", "gain against the known lattice", "quoted"],
  ["H8", "mean-slope inequality", "named inputs"],
  ["H9", "range of the slopes", "assumed"],
  ["H10", "δp ≤ 1/2", "one quote"],
  ["H11", "ranks are positive", "named inputs"],
  ["H12", "supply on windows [Z, Z^(3/2)]", "assumed"],
];

export const techniques = [
  { name: "Euler-factor descent", role: "primitive ↔ imprimitive L-functions", status: "reconstructed" },
  { name: "Functional equations", role: "reflection across Re = ½", status: "reconstructed" },
  { name: "Mellin transform / ramps", role: "poles at zeros; positive residues", status: "conceptual" },
  { name: "Localized Landau oscillation", role: "window bound ⇒ zero-free half-plane", status: "conceptual" },
  { name: "Theta-lift chains (≈ √X)", role: "mimic Stepanov multiplicity", status: "source-read" },
  { name: "Galois representations (Row0b)", role: "attach ℓ-adic representations", status: "source-read" },
  { name: "Iwasawa cohomology (VWinAt)", role: "weighted cohomological length bounds", status: "source-read" },
  { name: "Behrend / covolume / slope", role: "construct geometric hosts", status: "source-read" },
];

export const findings = [
  {
    n: "01",
    severity: "High",
    title: "No complete human proof exists in the examined sources",
    body: "The author's note is motivation and chronology. The 265-page Waterloo draft does not prove its main inequality (M); it reduces RH to thirteen unproved hypotheses. The formal proof and the human exposition remain different objects.",
    scope: "Mission-critical",
  },
  {
    n: "02",
    severity: "High",
    title: "The arithmetic core is not reconstructed",
    body: "everyCharacter is proved from Row0b, recTExists and VWin. The interfaces are pinned and quoted here, but the internal theta-lift, Galois, cohomological and analytic derivations were not converted into conventional mathematics.",
    scope: "Expository gap, not a formal error",
  },
  {
    n: "03",
    severity: "Medium",
    title: "\"GRH\" must be scoped to Dirichlet L-functions",
    body: "Dedekind zeta, Hecke and general automorphic L-functions are not among the five formal endpoints. The author's expectation of extending the method is not a formal theorem.",
    scope: "Scope inflation",
  },
  {
    n: "04",
    severity: "None",
    title: "A file-count discrepancy turned out to be our error",
    body: "A naive count found 174,793 .lean files. The missing 394 were real Lean files with non-ASCII paths, quoted by Git. With core.quotePath=false the count is exactly 175,187 — matching the reports. The finding is retained as a self-correction, not an archive defect.",
    scope: "Methodological correction",
  },
  {
    n: "05",
    severity: "Medium",
    title: "Verification is attributed, not reproduced here",
    body: "No build, kernel replay or #print axioms was run in this dossier session. The three-axiom result is reported by MIT, Waterloo and the Lean/Mathlib community.",
    scope: "Audit independence",
  },
  {
    n: "06",
    severity: "Medium",
    title: "The announcement timeline is not a proof map",
    body: "Several entries are historical motivation or analogy. The atlas identifies no exact theorem-to-type matching for the Stepanov determinant, the finite-field sign argument, and other early entries.",
    scope: "Prose vs. formal source",
  },
];

export const axioms = [
  { name: "propext", desc: "Propositional extensionality: P ↔ Q implies P = Q." },
  { name: "Classical.choice", desc: "Choice for nonempty types; standard for classical analysis." },
  { name: "Quot.sound", desc: "Soundness of quotient construction." },
];

export const artifacts = [
  { letter: "A", title: "Executive summary", file: "EXECUTIVE_SUMMARY.md", kind: "Overview", blurb: "Scope, architecture, verification evidence, limitations." },
  { letter: "B", title: "Theorem statements", file: "THEOREM_STATEMENTS.md", kind: "Statements", blurb: "All five endpoints with exact hypotheses and Lean quotations." },
  { letter: "C", title: "Mathematical background", file: "MATHEMATICAL_BACKGROUND.md", kind: "Background", blurb: "Zeta, Dirichlet L-functions, functional equations, windows, theta lifts." },
  { letter: "D", title: "Proof overview", file: "PROOF_OVERVIEW.md", kind: "Strategy", blurb: "Two resolutions of the proof and the endpoint chain." },
  { letter: "E", title: "Detailed reconstruction", file: "DETAILED_PROOF_RECONSTRUCTION.md", kind: "Core", blurb: "Numbered reconstruction of the reductions; deep core marked unresolved." },
  { letter: "F", title: "Dependency analysis", file: "DEPENDENCY_ANALYSIS.md", kind: "Graph", blurb: "Source-level dependencies, interfaces, and extraction limits." },
  { letter: "G", title: "Dependency graph", file: "DEPENDENCY_GRAPH.mmd", kind: "Mermaid", blurb: "Two diagrams distinguishing extracted edges from editorial grouping." },
  { letter: "H", title: "Axioms & assumptions", file: "AXIOMS_AND_ASSUMPTIONS.md", kind: "Trust", blurb: "Reported audits, executed commands, necessity of hypotheses." },
  { letter: "I", title: "Error & gap audit", file: "ERROR_AND_GAP_AUDIT.md", kind: "Audit", blurb: "Twelve findings, with severity and scope, no invented defects." },
  { letter: "J", title: "Declaration traceability", file: "DECLARATION_TRACEABILITY.csv", kind: "CSV", blurb: "36 declarations with files, lines, roles, dependencies and status." },
  { letter: "K", title: "Reproducibility", file: "REPRODUCIBILITY.md", kind: "Lab notes", blurb: "Pinned environment, build commands, what was and was not run." },
  { letter: "L", title: "Bibliography", file: "BIBLIOGRAPHY.md", kind: "Sources", blurb: "Primary archive, verifiers, exposition, prize status, methodology." },
];

export const executed = [
  "Blobless sparse clone of the mirror at commit 7cbf7a0.",
  "Tree enumeration reconciled: 175,187 .lean files among 175,192 tracked files.",
  "Direct reading of 12 Lean source files, including all reduction proofs.",
  "SHA-256 of the eight source files on the critical path.",
  "Inspection of lean-toolchain and lakefile.toml pins.",
  "Source-level trace of the proof-term chain and deep interfaces.",
];

export const notExecuted = [
  "No lake build, cache fetch, or .olean production.",
  "No #print axioms command or kernel replay.",
  "No nanoda, con-leche, con-ron, lean4lean, or comparator run.",
  "No full-archive SHA-256 comparison.",
  "No environment-level transitive dependency extraction.",
  "No human reconstruction of the 17M-line arithmetic core.",
];

export const bibliography = [
  {
    tag: "Primary",
    title: "Remark — announcement of the proof",
    author: "Levent Alpöge",
    date: "20 Nov 2026",
    href: "https://alpo.ge/remark.pdf",
    note: "Motivation, chronology, intent. Not a proof.",
  },
  {
    tag: "Primary",
    title: "Lean archive and public mirror",
    author: "Alpöge; mirror at commit 7cbf7a0",
    date: "2026",
    href: "https://github.com/mtabedi1390-design/riemann-hypothesis-lean",
    note: "Lean 4.33.1; Mathlib 0df444a3; 14-part archive.",
  },
  {
    tag: "Verification",
    title: "Lean verification of the Riemann Hypothesis",
    author: "Lean & Mathlib communities",
    date: "21 Nov 2026",
    href: "https://leanprover-community.github.io/blog/posts/riemann-hypothesis/",
    note: "Joint certification of statement and proof.",
  },
  {
    tag: "Verification",
    title: "RH Lean proof: verification files",
    author: "Andrew Sutherland, MIT",
    date: "22 Nov 2026",
    href: "https://math.mit.edu/~drew/grh/",
    note: "Compilation, axiom audit, kernel replay, independent checkers.",
  },
  {
    tag: "Verification",
    title: "Alpöge/Claude proof of the GRH",
    author: "Michael Rubinstein, Waterloo",
    date: "2026",
    href: "https://www.math.uwaterloo.ca/~mrubinst/alpoge_claude_grh/",
    note: "Lean checks plus a 265-page working exposition.",
  },
  {
    tag: "Exposition",
    title: "The proof explained for the Riemann zeta function, v2",
    author: "Michael Rubinstein",
    date: "22 Nov 2026",
    href: "https://www.math.uwaterloo.ca/~mrubinst/alpoge_claude_grh/zeta-paper_v2.pdf",
    note: "Working draft; main inequality reduced to 13 unproved hypotheses.",
  },
  {
    tag: "Reading map",
    title: "The announced proof: map, guide, record of checks",
    author: "Bartosz Naskręcki and reading project",
    date: "2026",
    href: "https://nasqret.github.io/riemann-rev/atlas/",
    note: "Secondary source-read atlas; used for architecture, attributed.",
  },
  {
    tag: "Status",
    title: "Riemann Hypothesis — Millennium Prize",
    author: "Clay Mathematics Institute",
    date: "accessed 2026",
    href: "https://www.claymath.org/millennium/riemann-hypothesis/",
    note: "Formal verification is not prize recognition.",
  },
];

export const scopeProof = [
  "RH for ζ, in Mathlib's exact formulation",
  "Dirichlet GRH for every positive modulus",
  "All Dirichlet characters, primitive and imprimitive",
  "Reported: three standard Lean axioms only",
];

export const scopeNot = [
  "Not Dedekind, Hecke or general automorphic GRH",
  "Not a published peer-reviewed proof",
  "Not a Clay Prize award or status change",
  "Not a complete human reconstruction of the core",
];
