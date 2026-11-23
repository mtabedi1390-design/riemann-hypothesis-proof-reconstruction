# Axioms and assumptions

## 1. What we executed — and what we did not

**Executed in this reconstruction session (2026-11-23):**

- A blobless, sparse clone of `mtabedi1390-design/riemann-hypothesis-lean`,
  commit `7cbf7a0c32fca1badf05931879a37c3f8a2b03b4`.
- Enumeration of the Git tree: 175,192 tracked files, of which 175,187 end in
  `.lean` (counting with `core.quotePath=false`; the other five are metadata).
  A naive count returned 174,793 because Git quotes 394 non-ASCII paths; that
  initial discrepancy was an artifact of the command and was corrected.
- Direct reading of the declarations and proof scripts named in
  `DECLARATION_TRACEABILITY.csv`.
- SHA-256 hashing of the eight inspected source files.
- Inspection of `lean-toolchain` (`leanprover/lean4:v4.33.1`) and
  `lakefile.toml` (Mathlib rev `0df444a360eaa60ab8c11dca51a86af692955474`).

**Not executed:**

- `lake exe cache get`, `lake build Statements`, `lake build Main`, or any build.
- `#print axioms riemannHypothesis` or any `#print axioms` command.
- A kernel replay, `leanchecker`, `nanoda`, `con-leche`, `con-ron`, or `lean4lean`.
- Statement comparison (`comparator`, `con-leche --compare`).
- An environment-level transitive dependency extraction.
- A full-archive SHA-256 reconciliation against `lean.tar.gz`.

No claim in this dossier is based on a command that was not actually run.

## 2. Reported axiom audit

The MIT verification page (`https://math.mit.edu/~drew/grh/`, last updated
2026-11-22 16:20 UTC at the time of consultation) reports:

- all 175,187 modules compile under Lean v4.33.1 and Mathlib v4.33.1;
- `#print axioms` for the five theorems in `Main.lean` returns only
  `propext`, `Classical.choice`, `Quot.sound`;
- no axioms are declared outside Lean core: 15 axioms in the environment, all in
  `Init`;
- every module is replayed through the Lean kernel with zero rejections;
- nanoda, con-leche, con-ron, and lean4lean accept the relevant export/compiled
  files;
- an independent sandboxed `lake build Main` reproduces the published export;
- statement comparison using two independent implementations accepts all five
  theorems against the Mathlib-only challenge;
- a few end-to-end comparator stages were still marked "running" on that page.

The Waterloo verification page reports all four of its checks successful
(compilation, axiom audit, kernel replay, nanoda). The Lean/Mathlib joint statement
certifies statement match and proof acceptance against several independent kernels.
These reports are the basis for saying that **no nonstandard axiom was reported**.
They are not our own execution.

## 3. Standard Lean axioms

The three permitted axioms are foundational, not defects of the proof:

- `propext`: propositional extensionality, `(P ↔ Q) → P = Q`.
- `Classical.choice`: choice for nonempty types, used for classical analysis.
- `Quot.sound`: quotient soundness, the standard primitive for quotients.

Depending on exactly which declarations are printed, some may list a subset. The
reported audit is consistent with ordinary Mathlib mathematics.

If `sorryAx` appeared, the proof would contain an admitted gap. The MIT/WATERLOO
reports and the mirror's text scan (0 `sorry`, 0 `admit`, 0 custom axiom
declarations) indicate it does not. A text scan alone would not be sufficient;
the kernel and compiler checks are the evidence that matters. The present dossier
did not rerun a scan over the full archive in this session.

## 4. Mathematical assumptions

### Explicit endpoint hypotheses

- `s ≠ 1` (Mathlib's pole convention).
- exclusion of `s = -2(n+1)`, n ∈ ℕ.
- `N` is nonzero (`[NeZero N]`).
- `Re(s) > 1/2` plus the pole exception in the half-plane statements.
- `N` is nonzero (`[NeZero N]`) and the critical strip `0<Re(s)<1` in GRH statements.
- `χ.IsPrimitive` in the primitive endpoint.

### Typeclass and mathlib assumptions

- Classical logic and choice.
- Mathlib's definitions of `riemannZeta`, `DirichletCharacter`, `LFunction`,
  `completedLFunction`, `gammaFactor`, `completedRiemannZeta`.
- Mathlib's analytic facts: `riemannZeta_one_sub`,
  `completedRiemannZeta_one_sub`, `riemannZeta_ne_zero_of_one_le_re`,
  `Gammaℝ_eq_zero_iff`, `Gammaℝ_ne_zero_of_re_pos`, the change-of-level identity,
  and the completed L-functional equation.

Those definitions are part of the trusted statement layer. A kernel check verifies
that the theorem follows from them; it does not independently verify that Mathlib's
definition is the intended zeta function. The Lean/Mathlib statement vetting and the
challenge comparison are the reported mitigations for this.

### Internal mathematical inputs

These are theorems in the archive according to its architecture, not axioms added
to the kernel:

- `UpperTheory.GalStar.Row0b` (automorphic-to-Galois attachment);
- `UpperTheory.Zero.LLC.recTExists` (a local Langlands/reciprocity parameter
  existence statement);
- `UpperTheory.Top.TopG` (family-class connectedness under host/hypothesis data);
- `UpperTheory.Top.VWinAt ψ 401` (weighted Galois-cohomology window bound);
- `UpperTheory.Lit.every_character_of_theta_integrals_local_matching` (the deep
  assembly of theta-integral agreement and local matching);
- `supplyChi`, `shapeWin`, the family-scale comparison, and the analytic engine.

Whether each is actually proved without a hidden `axiom` is exactly what the
reported `#print axioms` audit answers. We did not reproduce that audit. The claims
in the secondary atlas about which components are "kernel-checked" versus
"source-read" are interpretations by that reading project, not a substitute for
our own environment extraction.

## 5. Assumption removal / necessity

- **`s ≠ 1`:** a definitional convention, not a necessary analytic hypothesis.
  Mathlib's ζ is defined with a junk value at its pole; at this pin
  `riemannZeta_one_ne_zero` confirms that the value is nonzero. Thus the
  hypothesis records that the pole is outside the zero set, but it is not what
  rules out a genuine zero at `s = 1`. Removing it from the logical implication
  would not, at this pin, make the conclusion `Re(1)=1/2` follow from a true
  zero hypothesis. Keep it because it is part of Mathlib's definition; do not
  describe it as an unproved mathematical exception.
- **Trivial-zero exclusion:** necessary. `ζ(-2n)=0` with real part not 1/2.
  These are genuine zeros, and the exclusion is correctly part of the statement.
- **`N ≥ 1`:** necessary for Dirichlet characters of a positive modulus; `N=0`
  is excluded by `NeZero`.
- **Pole exception `(χ≠1 ∨ s≠1)`:** necessary for the trivial character, whose
  L-function is ζ and has a pole at 1. For nontrivial χ the exception is vacuous.
- **Critical-strip bounds `0<Re(s)<1`:** these define the scope; zeros outside
  the strip are not claimed to be on the line by that endpoint.
- **Primitiveness in endpoint E:** a genuine restriction. Removing it gives the
  stronger endpoint D, which is separately proved via conductor descent.
- **`Re(s)>1/2` in the half-plane theorem:** not removable; it is the analytic
  content. Removing it would assert RH in a different form and is not established
  by the reductions.
- **`ε < 1/52` and `Ct = 401`:** constants internal to `VWinAt`; their necessity
  and optimality were not investigated. They do not appear in the endpoint
  statements.

No counterexample is constructed in this dossier. The only mathematical
counterexamples relevant to necessity are the classical trivial zeros, which are
already excluded by the formal hypotheses.

## 6. Trust boundary

The kernel ensures that the formal terms typecheck from the permitted axioms. It
does not ensure:

- that the formal statement captures the intended informal statement (mitigated by
  using Mathlib's vetted statement and by independent comparator runs);
- that the deep mathematical inputs are intuitively understood;
- that secondary prose describes the proof accurately;
- that the result has been refereed or recognized for a prize.

The dossier's verdict is accordingly limited: formally verified according to
reported machine checks, not humanly reconstructed in full.
