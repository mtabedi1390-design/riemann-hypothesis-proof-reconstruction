# Executive summary — reconstruction of the Alpöge–Claude Lean proof

**Status of this document.** Working research reconstruction, compiled 2026-11-23.
It separates (i) declarations and proof scripts directly inspected in the public
mirror, (ii) verification results reported by named third parties, and (iii) the
author's and other mathematicians' prose. **No Lean build, kernel replay, or axiom
audit was executed by this reconstruction session.**

## 1. The formal object

The archive is a Lean 4 library (`leanprover/lean4:v4.33.1`, Mathlib pinned at
`0df444a360eaa60ab8c11dca51a86af692955474`) whose five exported theorems are
declared in `src/Main.lean`:

1. `riemannHypothesis : RiemannHypothesis` (Mathlib's own definition);
2. `riemannZeta_eq_zero_re : RiemannZetaZerosOnLine` (the same statement written
   out in the submission);
3. `LFunction_ne_zero_of_half_lt_re : DirichletLNonvanishingRightOfHalf`;
4. `LFunction_eq_zero_re : DirichletLZerosOnLine`;
5. `LFunction_eq_zero_re_of_isPrimitive : PrimitiveDirichletLZerosOnLine`.

The last three concern Dirichlet L-functions for **all positive moduli and all
Dirichlet characters** in the nonvanishing and critical-strip formulations, with
the primitive restriction only in the fifth. This is GRH for Dirichlet L-functions.
It is **not** a formalisation of GRH for Dedekind zeta functions, Hecke
L-functions, or general automorphic L-functions.

The reconstructed statement, with Mathlib's conventions made explicit, is

> For every complex `s`, if `ζ(s) = 0`, if `s` is not one of the excluded values
> `−2, −4, −6, …`, and if `s ≠ 1`, then `Re(s) = 1/2`.

The condition `s ≠ 1` is present because Mathlib gives the zeta function a
conventional value at its pole. The set `{−2(n+1) : n ∈ ℕ}` is exactly the
trivial-zero set used by the formal statement.

## 2. What is genuinely explained by this dossier

The final reduction is short, readable Lean and is reconstructed line by line
in `DETAILED_PROOF_RECONSTRUCTION.md`:

- `allChi` is the half-plane theorem for every Dirichlet character.
- `rhOfAll = Formalism.VW.rh_of_every allChi` converts the half-plane theorem
  into Mathlib's Riemann Hypothesis by using the Dirichlet character of modulus 1
  and the functional equation of ζ.
- `Claim.strip allChi` converts the half-plane theorem into the critical-strip
  statement by conductor descent and the functional equations of primitive L-functions.
- `Formalism.VW.critLine allChi` independently performs the same reflection for
  primitive characters.
- `Claim.zeta allChi` converts the half-plane theorem into the zeta statement,
  handling the pole, the trivial zeros, the right half-plane, and reflection.

These proofs are not merely summarised: their statements, hypotheses, and tactic
steps have been inspected, and their mathematical content is given as numbered
propositions in the detailed reconstruction.

## 3. What is not reconstructed

The mathematical content is concentrated in

```
UpperTheory.FinalTheorems.everyCharacter
  ↔ UpperTheory.LiteratureTheorems.every_character_of_literature_of_vWin
       ⟨Row0b, recTExists, Row0b⟩ (vwin_of_row Row0b)
```

`row` abbreviates a deep theorem attaching Galois representations to regular
algebraic polarised cuspidal automorphic representations over CM fields;
`VWinAt ψ 401` is a Galois-cohomological window statement; `TopG` is a family-
connectedness statement. The proof of `everyCharacter` therefore runs through a
very large arithmetic development. The author himself describes the argument as
very long and says he has not yet mastered all of its mathematics and intends to
write it up properly. A 265-page Waterloo working draft specialises the argument
to ζ, but explicitly does not prove its main inequality (M): it reduces (M), and
with it RH, to **thirteen numbered hypotheses**, none proved outright there.

Consequently this dossier does not pretend that the 17M-line arithmetic core has
been turned into a complete conventional proof. It distinguishes:

- **Tier I:** direct source inspection plus a full mathematical reconstruction
  of the statement-level reductions (available here);
- **Tier II:** a source-read map of the deep theorem interfaces, with their exact
  Lean types and dependencies (available here, with limits marked);
- **Tier III:** the internal analytic and automorphic arguments inside the
  arithmetic development (not reconstructed here).

## 4. Verification evidence (attributed, not rerun here)

At the time of consultation the following were reported:

- **Lean/Mathlib joint statement (21 Nov 2026):** the library compiles; the five
  statements match Mathlib's challenge statement by two independent comparison
  tools; and the exported proof is accepted by Lean's kernel and several
  independent checkers. Scope: Dirichlet GRH, not general automorphic GRH.
- **MIT verification page (last updated 22 Nov 2026, 16:20 UTC):** all 175,187
  modules compile; the five theorems depend only on `propext`, `Classical.choice`,
  `Quot.sound`; a full kernel replay and nanoda, con-leche, con-ron, and lean4lean
  accept the export; some end-to-end comparator stages were still marked running.
- **Waterloo verification page:** reports compilation, an axiom audit, a kernel
  replay, and a nanoda check, all successful.

These are strong checks that the formal proof is valid relative to its formal
statement and Lean's kernel. They are not a check that this dossier's human prose
is complete, nor that the mathematical ideas have been understood or refereed.

## 5. Findings and corrections

1. **File metadata reconciled (self-correction).** The mirrored Git tree at
   commit `7cbf7a0c32fca1badf05931879a37c3f8a2b03b4` contains 175,192 tracked
   files: exactly 175,187 `.lean` sources plus five metadata files (`.gitignore`,
   `README.md`, `lake-manifest.json`, `lakefile.toml`, `lean-toolchain`). A naive
   `git ls-tree | grep -c '\.lean$'` returns 174,793 because Git quotes 394 paths
   containing non-ASCII characters. With `git -c core.quotePath=false`, the count
   is 175,187, matching the reported module count. **Our initial finding of a
   discrepancy was wrong and is corrected here.**
2. **Human readability gap.** The existence of a kernel-checked proof does not
   provide a human proof. The author's note offers motivations and a chronology,
   not a proof. The Waterloo draft is explicitly conditional on unproved hypotheses.
3. **Scope inflation risk.** The formal endpoints do not include Dedekind, Hecke,
   or general automorphic L-functions. Statements that "GRH" tout court has been
   formalised in full should be rejected or qualified.
4. **Verification and recognition are distinct.** Formal verification, mathematical
   understanding, peer review, and the Clay prize process are different statuses.
   The Clay Institute had not, in the sources consulted, changed the problem's
   status or awarded a prize. Prize rules require journal publication and a
   two-year waiting period, among other conditions.

## 6. One-paragraph verdict

There is a formally verified Lean proof, according to multiple named independent
verification efforts, of Mathlib's Riemann Hypothesis and of GRH for Dirichlet
L-functions. Its endpoint logic is short and reconstructible, and this dossier does
so. Its core is a vast, source-readable but not yet humanly reconstructed
arithmetic argument; no complete unconditional conventional exposition is
publicly available in the sources examined. The formal achievement and the
expository task must not be confused.
