# Theorem statements and scope

All Lean quotations are taken from the public mirror at commit
`7cbf7a0c32fca1badf05931879a37c3f8a2b03b4`. Bold labels are ours; the Lean text is
verbatim. `ℂ`, `ℕ`, `riemannZeta`, `DirichletCharacter`, and `IsPrimitive` are
Mathlib notions at Mathlib `0df444a360eaa60ab8c11dca51a86af692955474`.

## A. Mathlib's definition

`Mathlib/NumberTheory/LSeries/RiemannZeta.lean` (at the pinned revision):

```lean
def RiemannHypothesis : Prop :=
  ∀ (s : ℂ) (_ : riemannZeta s = 0) (_ : ¬∃ n : ℕ, s = -2 * (n + 1)) (_ : s ≠ 1),
    s.re = 1 / 2
```

Mathematical reading. Let ζ be the Riemann zeta function on ℂ, with Mathlib's
convention at the pole. Then:

\[
\forall s\in\mathbb C,\quad
\zeta(s)=0\ \Longrightarrow\
\bigl(\nexists n\in\mathbb N,\ s=-2(n+1)\bigr)\ \Longrightarrow\
s\ne 1\ \Longrightarrow\ \operatorname{Re}(s)=\tfrac12 .
\]

The hypotheses are not decorations to be silently dropped. The quantified
exclusion removes precisely the trivial zeros −2, −4, −6, … and is mathematically
necessary. The condition `s ≠ 1` is definitional: Mathlib assigns ζ a junk value at
its pole, and at this pin `riemannZeta_one_ne_zero` confirms that the value is
nonzero, so the condition records the pole convention rather than excluding a
genuine zero. The statement is about all complex zeros, not only those in the
critical strip; the other zeros are excluded by the hypotheses.

## B. The submission's written-out zeta statement

`src/Statements.lean`, lines 3–4:

```lean
def RiemannZetaZerosOnLine : Prop :=
  ∀ s : ℂ, riemannZeta s = 0 → (¬∃ n : ℕ, s = -2 * ((n : ℂ) + 1)) → s ≠ 1 → s.re = 1 / 2
```

Mathematically this is the same proposition. The explicit coercion `(n : ℂ)`
makes the polynomial `-2(n+1)` complex; `n + 1` ranges over positive naturals.
`Claim.Zeta` in `CharacterBoxes/HalfPlane.lean` is again the same proposition, and
`Claim.zeta_iff : Claim.Zeta ↔ RiemannHypothesis` is proved by `Iff.rfl`, i.e. the
two sides are definitionally equal at that pin.

## C. Nonvanishing to the right of the critical line

`src/Statements.lean`, lines 6–8:

```lean
def DirichletLNonvanishingRightOfHalf : Prop :=
  ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N) (s : ℂ),
    1 / 2 < s.re → (χ ≠ 1 ∨ s ≠ 1) → DirichletCharacter.LFunction χ s ≠ 0
```

Mathematical reading:

\[
\forall N\ge 1,\ \forall \chi \pmod N,\ \forall s\in\mathbb C,\quad
\operatorname{Re}(s)>\tfrac12
\ \wedge\ (\chi\ne \mathbf 1 \ \vee\ s\ne 1)
\ \Longrightarrow\ L(\chi,s)\ne 0 .
\]

- `[NeZero N]` records `N ≠ 0`; Dirichlet characters are taken for positive moduli.
- `χ = 1` is the trivial character; the only allowed zero when it is trivial is
  the pole at `s = 1`. For every nontrivial character the pole case does not arise.
- The theorem covers imprimitive characters as well as primitive ones.

## D. Zeros in the critical strip

`src/Statements.lean`, lines 10–12:

```lean
def DirichletLZerosOnLine : Prop :=
  ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N) (s : ℂ),
    0 < s.re → s.re < 1 → DirichletCharacter.LFunction χ s = 0 → s.re = 1 / 2
```

Mathematical reading:

\[
\forall N\ge1,\ \forall\chi\pmod N,\ \forall s\in\mathbb C,\quad
0<\operatorname{Re}(s)<1\ \wedge\ L(\chi,s)=0
\ \Longrightarrow\ \operatorname{Re}(s)=\tfrac12 .
\]

This is the usual critical-strip formulation of GRH for Dirichlet L-functions,
including imprimitive characters. It does not itself assert anything about zeros
outside the strip.

## E. Primitive-character form

`src/Statements.lean`, lines 14–16:

```lean
def PrimitiveDirichletLZerosOnLine : Prop :=
  ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N), χ.IsPrimitive →
    ∀ s : ℂ, 0 < s.re → s.re < 1 → DirichletCharacter.LFunction χ s = 0 → s.re = 1 / 2
```

This is D restricted to primitive χ, the form in which GRH for Dirichlet
L-functions is often stated. The converse passage from primitive to all characters
is carried out in the proof of `Claim.strip`, not assumed.

## F. The exported endpoint declarations

`src/Main.lean`, lines 4–12:

```lean
theorem riemannHypothesis : RiemannHypothesis := rhOfAll

theorem riemannZeta_eq_zero_re : RiemannZetaZerosOnLine := rhOfAll

theorem LFunction_ne_zero_of_half_lt_re : DirichletLNonvanishingRightOfHalf := allChi

theorem LFunction_eq_zero_re : DirichletLZerosOnLine := claimAll.2.1

theorem LFunction_eq_zero_re_of_isPrimitive : PrimitiveDirichletLZerosOnLine := critAll
```

The proof terms are exactly the named intermediate objects in
`src/Supplements/Kernels/MainTheorems.lean`:

```lean
theorem allChi : UpperTheory.EveryCharacter := UpperTheory.FinalTheorems.everyCharacter
theorem rhOfAll : RiemannHypothesis := Formalism.VW.rh_of_every allChi
theorem critAll ... := Formalism.VW.critLine allChi N χ hχ s h0 h1 hz
theorem claimAll : Claim.HalfPlane ∧ Claim.Strip ∧ Claim.Zeta :=
  ⟨allChi, Claim.strip allChi, Claim.zeta allChi⟩
```

`UpperTheory.EveryCharacter` is not a new mathematical assumption; it is the same
proposition as C, definitionally:

```lean
def UpperTheory.EveryCharacter : Prop :=
  ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N) (s : ℂ),
    1 / 2 < s.re → (χ ≠ 1 ∨ s ≠ 1) → DirichletCharacter.LFunction χ s ≠ 0
```

## G. The deep interface consumed by `everyCharacter`

`CharacterBoxes/MainConclusion.lean`:

```lean
theorem UpperTheory.FinalTheorems.everyCharacter : UpperTheory.EveryCharacter :=
  UpperTheory.FinalTheorems.everyCharacter_of_row
    UpperTheory.Gal.Int.galoisLocalGlobalStrong_recParameter
```

with

```lean
theorem ...everyCharacter_of_row
    (h : UpperTheory.GalStar.Row0b fun h rc => UpperTheory.Zero.LLC.IsRecT h rc) :
    UpperTheory.EveryCharacter :=
  UpperTheory.LiteratureTheorems.every_character_of_literature_of_vWin
    ⟨h, UpperTheory.Zero.LLC.recTExists, h⟩ (UpperTheory.One.vwin_of_row h)
```

and, at `EveryCharacterOfLiteratureOfVWin.lean:810`:

```lean
theorem UpperTheory.LiteratureTheorems.every_character_of_literature_of_vWin
    (O : UpperTheory.LiteratureTheorems.OpenLiteratureStatements)
    (hV : UpperTheory.Top.VWin) : UpperTheory.EveryCharacter
```

This is the true boundary of the short, humanly reconstructed part. `Row0b`,
`OpenLiteratureStatements`, `VWin`, and their proofs are where the mathematical
content of the proof of RH resides. Their exact informal meanings are only partly
recoverable from the sources inspected; see `DEPENDENCY_ANALYSIS.md` and
`ERROR_AND_GAP_AUDIT.md`.

## H. Scope caution

What is formalised is GRH for Dirichlet L-functions. It is not:

- GRH for Dedekind zeta functions of arbitrary number fields;
- GRH for Hecke L-functions (as a separate formal endpoint);
- the classical Extended Riemann Hypothesis for Dirichlet L-functions in a different
  normalization without the same analytic continuation data;
- a formalisation of "every known equivalent of RH";
- a claim that the author, the mirrors, or the verifiers have written a conventional
  proof that can currently be read end to end.

The announced intent to extend the method is not a formal theorem.
