# Proof overview

## 1. The two resolutions at which the proof must be read

A formal proof can be valid at one resolution and opaque at another. The Alpöge–
Claude archive has an unusually sharp separation:

- **Resolution A (the reduction):** about 250 lines of readable Lean turning one
  half-plane theorem into five exported statements. This is fully reconstructible.
- **Resolution B (the arithmetic engine):** the proof of the half-plane theorem
  itself, dispersed through an enormous development whose interfaces have names
  such as `TopG`, `VWinAt`, `Row0b`, and `supplyChi`.

The author's note describes motivation and chronology for Resolution B. The
Waterloo working draft gives a classical-analytic account of much of Resolution B
but explicitly leaves its main inequality unproved and reduces it to thirteen
hypotheses. No unconditional, complete, human-readable proof was available in the
sources inspected.

## 2. The endpoint chain

```
Mathlib.RiemannHypothesis
        ▲
        │  Formalism.VW.rh_of_every
UpperTheory.EveryCharacter  ──────────────► DirichletLNonvanishingRightOfHalf
        │                                            (allChi)
        │  Claim.strip
        ├──────────────────────────────────────────► DirichletLZerosOnLine
        │  Claim.zeta
        └──────────────────────────────────────────► RiemannZetaZerosOnLine

UpperTheory.EveryCharacter ── Formalism.VW.critLine ──► PrimitiveDirichletLZerosOnLine
```

Every arrow is a Lean theorem application, not an informal inference. The exported
five theorems use no new axiom: they are applications of the intermediate results.

## 3. Reduction 1 — half-plane nonvanishing implies the strip statement

Write `H` for `UpperTheory.EveryCharacter`:

\[
H:\quad \forall N\ge1\ \forall\chi\pmod N\ \forall s,\
\operatorname{Re}s>\tfrac12\ \wedge\ (\chi\ne1\vee s\ne1)
\ \Rightarrow\ L(\chi,s)\ne0 .
\]

Let `0 < Re(s) < 1` and `L(χ,s)=0`.

1. If `Re(s) > 1/2`, apply H with the second disjunct `s ≠ 1` (which follows from
   `Re(s) < 1`) to contradict the zero.
2. If `Re(s) = 1/2`, done.
3. If `Re(s) < 1/2`, replace χ by its primitive inducing character ψ. The quotient
   of Euler factors is a finite product of nonzero numbers in `Re(s) > 0`, so
   `L(ψ,s)=0`. The functional equation reflects this to `L(ψ^{-1},1-s)=0`. Now
   `ψ^{-1}` is primitive and `Re(1-s) > 1/2`, while `1-s ≠ 1`; H gives
   `L(ψ^{-1},1-s) ≠ 0`, a contradiction.

This is `Claim.strip`. It is reconstructed in full in
`DETAILED_PROOF_RECONSTRUCTION.md`, §3.5.

## 4. Reduction 2 — half-plane nonvanishing implies RH

Apply H to the trivial character modulo 1. Since `L(1,s) = ζ(s)`, H gives

\[
\operatorname{Re}s>\tfrac12,\ s\ne1\ \Rightarrow\ \zeta(s)\ne0 .
\]

Given a zero `s` of ζ that is neither the pole value nor a trivial zero:

- if `Re(s) > 1/2`, contradict the displayed implication;
- if `Re(s) = 1/2`, done;
- if `Re(s) < 1/2`, the functional equation and the nonvanishing of its prefactor
  give `ζ(1-s) = 0`; but `Re(1-s) > 1/2`, contradiction.

The prefactor zeros are the trivial zeros and the pole; they are excluded by the
hypotheses. This is `Formalism.VW.rh_of_right`, invoked by `rh_of_every`. It is
reconstructed in §3.6–3.7.

## 5. Reduction 3 — the zeta statement from the Dirichlet statement

This is a separate bridge (`Claim.zeta`), not an immediate consequence of the
previous paragraph. It treats all complex `s` directly:

- `s = 0` is excluded because `ζ(0) ≠ 0`.
- `Re(s) ≥ 1`, `s ≠ 1`: classical nonvanishing of ζ on and to the right of the
  line `Re = 1`.
- `0 < Re(s) < 1`: use `L(1,s) = ζ(s)` and `Claim.strip`.
- `Re(s) ≤ 0`: if the Gamma factor vanished, `s` would be `0` or a trivial zero,
  both excluded; hence the completed zeta function vanishes. Reflection gives a
  zero of ζ at `1-s`, whose real part is `≥ 1`, contradicting classical
  nonvanishing.

Thus the same half-plane input closes both the RH endpoint and the strip endpoint.

## 6. The character-wide theorem

The readable assembly is in `CharacterBoxes/MainConclusion.lean`:

```
everyCharacter
  = everyCharacter_of_row galoisLocalGlobalStrong_recParameter
  = every_character_of_literature_of_vWin
      ⟨Row0b, recTExists, Row0b⟩
      (vwin_of_row Row0b)
```

The proof term `every_character_of_literature_of_vWin` consumes an
`OpenLiteratureStatements` record and `VWin`. Its body passes four bundles to
`UpperTheory.Lit.every_character_of_theta_integrals_local_matching`:

1. `published_results_eigen O`;
2. `published_results_first O`;
3. `ThetaIntegralsAgree`;
4. `LocalMatching`.

The `TopG` route visible in `CharacterBoxes/EveryCharacter.lean` produces the same
half-plane result by `zeroFreeAll_of_topG` with the tied window parameter
`la = 3/2`, using `shapeWin`, `supplyChi`, and a comparison of family scales.
`plugAll` then descends from primitive characters to all characters.

## 7. The analytic engine, in ordinary mathematical language

The atlas and the Waterloo draft agree on the following shape (reported by those
secondary sources, not reconstructed here):

1. For a primitive character ψ and small ε, construct a positive family of
   characters containing ψ whose weighted prime sum satisfies
   `G_F(y) ≤ C y^{1/2+9ε}` throughout arbitrarily late windows `[Y,Y^{3/2}]`.
   The loss exponents `e_D = 2`, `e_L = 0` are fixed before ε.
2. Mellin-transform the family. A zero `ρ` with `Re(ρ) = β` would create a pole at
   ρ with a residue that cannot cancel because the family's coefficients are
   positive.
3. Use a localized Landau oscillation/high-derivative argument to show that a pole
   at a distance corresponding to `β` would force growth exceeding the window
   bound, provided one first chooses `θ` with `1/2 < θ < β` and then chooses ε with
   `1/2+9ε ≤ θ`.
4. Conclude a zero-free right half-plane for primitive characters, descend to all
   characters via Euler factors, and reflect to obtain the critical line for every
   character; the zeta endpoint is the modulus-one case.

Step 1 is the hard arithmetic supply. Steps 2–4 are the analytic engine. The
secondary description is coherent but is not a proof of step 1, and the Waterloo
draft does not prove its main inequality.

## 8. The arithmetic supply at the boundary of the source

The formal interfaces state:

- `TopG`: a conditional family-connectedness assertion. For every `la > 1` and
  geometric requirement `G`, assuming a host/window condition and that all families
  in the class satisfy `HypV`, the class is connected.
- `VWinAt ψ 401`: for every `0 < ε < 1/52` and every admissible integer page
  function `e(x)`, there is a scale window on which, for suitable auxiliary primes
  satisfying explicit congruence conditions, every relevant number field's weighted
  Galois-cohomology length is bounded by `√(exp(x^ε))`.
- `Row0b`: an automorphic-to-Galois representation attachment statement for
  regular algebraic polarised cuspidal representations over CM fields, with
  local–global compatibility.

These are not resting on a custom axiom, according to the reported axiom audits.
They are deep proved theorems inside the 17M-line development. A rigorous human
reconstruction would have to unpack their proofs; this dossier does not fabricate
that unpacking.

## 9. What follows

Given the source-read map and the reconstructed reductions, the following
conditional statement is justified:

> If `UpperTheory.FinalTheorems.everyCharacter` is true, then Mathlib's RH and the
> four Dirichlet endpoints are true, and the reductions are formally verified.

The reported kernel checks establish the antecedent formally, relative to Mathlib
and Lean's kernel. They do not, by themselves, establish that a human has
understood the antecedent's proof. That distinction is the central finding of this
dossier.
