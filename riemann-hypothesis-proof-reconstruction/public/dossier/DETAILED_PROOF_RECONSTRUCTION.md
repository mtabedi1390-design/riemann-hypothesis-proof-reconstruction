# Detailed proof reconstruction

**Audit status.** Direct inspection of the Lean sources named below was performed
at mirror commit `7cbf7a0c32fca1badf05931879a37c3f8a2b03b4`. No `lake build`,
kernel replay, or `#print axioms` command was run in this session. Statements about
verification are attributed to the MIT, Waterloo, and Lean/Mathlib reports cited in
`BIBLIOGRAPHY.md`.

**Two tiers.** §§1–6 reconstruct the statement-level proof from inspected source.
§§7–9 describe the deep arithmetic layer at the level of its formal interfaces and
of secondary expositions; they are explicitly marked unresolved where the proof
internals were not reconstructed.

---

## 1. Definitions and exact conventions

Let ζ denote Mathlib's `riemannZeta`, and for a Dirichlet character χ modulo
`N ≥ 1`, let `L(χ,s)` denote Mathlib's `DirichletCharacter.LFunction χ s`.

Mathlib's zeta function is normalised so that the finished zeta function is entire;
consequently it assigns a conventional value at `s = 1`. This is why every endpoint
uses the hypothesis `s ≠ 1`. The trivial zeros are the values

\[
-2(n+1),\qquad n=0,1,2,\dots
\]

which in Lean appear as `-2 * ((n : ℂ) + 1)`.

Write `H` for the character-wide half-plane proposition:

\[
H:\quad
\forall N\ge1,\ \forall\chi\pmod N,\ \forall s\in\mathbb C,\quad
\operatorname{Re}(s)>\tfrac12
\ \wedge\ (\chi\ne\mathbf 1\ \vee\ s\ne1)
\ \Longrightarrow\ L(\chi,s)\ne0.
\]

In Lean, `H` is `UpperTheory.EveryCharacter`, and it is definitionally the same
proposition as `DirichletLNonvanishingRightOfHalf`. The two readable definitions
are:

```lean
-- CharacterBoxes/EveryCharacter.lean:13
def UpperTheory.EveryCharacter : Prop :=
  ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N) (s : ℂ),
    1 / 2 < s.re → (χ ≠ 1 ∨ s ≠ 1) → DirichletCharacter.LFunction χ s ≠ 0

-- CharacterBoxes/HalfPlane.lean:3
def Claim.HalfPlane : Prop :=
  ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N) (s : ℂ),
    1 / 2 < s.re → (χ ≠ 1 ∨ s ≠ 1) → DirichletCharacter.LFunction χ s ≠ 0
```

The logical remarks that will be used silently are elementary:

- If `0 < Re(s) < 1` then `s ≠ 1` and `s ≠ 0`.
- The second disjunct in the pole exception is enough whenever `s ≠ 1`.
- Complex conjugation preserves zeros of Dirichlet L-functions, but the formal
  proofs below do not need it: they use the inverse character and the functional
  equation directly.

---

## 2. The endpoint graph

The five exported declarations are term-level abbreviations:

| Exported theorem | Proof term | Intermediate proposition |
|---|---|---|
| `riemannHypothesis` | `rhOfAll` | `Formalism.VW.rh_of_every allChi` |
| `riemannZeta_eq_zero_re` | `rhOfAll` | same |
| `LFunction_ne_zero_of_half_lt_re` | `allChi` | `UpperTheory.EveryCharacter` |
| `LFunction_eq_zero_re` | `claimAll.2.1` | `Claim.strip allChi` |
| `LFunction_eq_zero_re_of_isPrimitive` | `critAll` | `Formalism.VW.critLine allChi` |

This table is the formal proof term, not a chronological narrative. Every
mathematical claim below is either proved in a source file or explicitly marked as
belonging to the unreconstructed core.

---

## 3. Tier I: the reductions, reconstructed

### 3.1 A functional-equation reflection lemma for ζ

The formal source is `Formalism/GammaFactorNonvanishing/RhOfRight.lean`, theorem
`Formalism.VW.rh_of_right` (lines 5–62). Its hypothesis is

\[
\forall s,\quad \operatorname{Re}(s)>\tfrac12\ \wedge\ s\ne1
\ \Longrightarrow\ \zeta(s)\ne0,
\]

and its conclusion is Mathlib's `RiemannHypothesis`. We reconstruct its logic.

**Standard functional equation.** Mathlib's `riemannZeta_one_sub` supplies the
asymmetric form

\[
\zeta(1-x)=2(2\pi)^{-x}\Gamma(x)\cos\!\left(\frac{\pi x}{2}\right)\zeta(x)
\]

away from the poles of the factors. We use it at the argument `x = 1-s` to express
`ζ(s)`. The exact normalisation used by Lean is the pinned Mathlib statement; the
proof only requires that the prefactor be a product of factors whose zeros are
controlled.

**Lemma 3.1 (reflection).** Let `ζ(s) = 0`, `s ≠ 1`, and suppose that
`x := 1-s` is not a non-positive integer. Then `ζ(x) = ζ(1-s) = 0`.

*Proof.* The Lean hypotheses give `x ≠ 1` and `x ≠ -n` for every natural `n`.
Mathlib's `riemannZeta_one_sub` at the argument `x` reads

\[
\zeta(1-x)=2(2\pi)^{-x}\Gamma(x)\cos\!\left(\frac{\pi x}{2}\right)\zeta(x).
\]

The left-hand side is `ζ(s)`, which is zero. In the Lean proof, the three factors

- `2(2π)^{-x}`,
- `Γ(x)`,
- `cos(πx/2)`,

are each proved nonzero under these hypotheses. It follows that the remaining
factor `ζ(x) = ζ(1-s)` is zero. ∎

*Formal detail.* Nonvanishing of the exponential factor is
`Complex.cpow_ne_zero_iff`; nonvanishing of `Γ` is
`Complex.Gamma_ne_zero_of_re_pos` applied to `x`; the cosine is handled by
`Complex.cos_eq_zero_iff`, which says that a zero would force `s = -2k` for an
integer `k` (because `x = 1-s` would be odd). The cases `k < 0`, `k = 0`, `k > 0`
are respectively excluded by `Re(x) > 1/2`, by `s ≠ 0`, and by the hypothesis that
`s` is not a trivial zero. This is a genuine case analysis, not an "immediate"
appeal to the functional equation.

### 3.2 Theorem (half-plane ⇒ Mathlib RH)

**Claim 3.2.** `H` implies `RiemannHypothesis`.

*Proof.* Take `s` with `ζ(s) = 0`, `s` not a trivial zero, and `s ≠ 1`.

- If `Re(s) = 1/2`, done.
- If `Re(s) > 1/2`, `H` applied to the modulus-1 trivial character gives
  `ζ(s) = L(1,s) ≠ 0`, contradicting the hypothesis. This uses
  `DirichletCharacter.LFunction_modOne_eq`.
- If `Re(s) < 1/2`, then `Re(1-s) > 1/2`. Lemma 3.1 gives `ζ(1-s)=0`; but
  `H` at `1-s` gives `ζ(1-s) ≠ 0`, since `1-s ≠ 1` (as `s ≠ 0`, itself a
  consequence of `ζ(0) ≠ 0`). Contradiction.

Hence `Re(s)=1/2` in all cases. This is exactly the proof of
`Formalism.VW.rh_of_every`:

```lean
theorem Formalism.VW.rh_of_every (h : UpperTheory.EveryCharacter) : RiemannHypothesis :=
  Formalism.VW.rh_of_right fun s hs hs1 => by
    have := h 1 (1 : DirichletCharacter ℂ 1) s hs (Or.inr hs1)
    rwa [LFunction_modOne_eq] at this
```

The companion theorem `Formalism.VW.critLine` uses the same reflection but stays
inside Dirichlet L-functions; see §6. ∎

---

### 3.3 Lemma (removed Euler factors do not vanish)

Source: `ClaimStrip.lean:7–21`, `Claim.factor_ne_zero`.

Let ψ be a Dirichlet character modulo M, let `p` be prime, and let `Re(s) > 0`.
Then

\[
1-\psi(p)p^{-s}\ne0 .
\]

*Proof.* Suppose `ψ(p)p^{-s}=1`. On the one hand `|ψ(p)| ≤ 1`. On the other hand,
because `p > 1` and `Re(s) > 0`,

\[
|p^{-s}|=p^{-\operatorname{Re}(s)}<1 .
\]

Thus the product has modulus `< 1`, whereas 1 has modulus 1, contradiction. The
Lean proof obtains the strict inequality from
`Complex.norm_natCast_cpow_of_pos` and `Real.rpow_lt_one_of_one_lt_of_neg`. ∎

### 3.4 Lemma (conductor descent)

Source: `ClaimStrip.lean:23–33`, `Claim.prim_zero`.

Let χ be a Dirichlet character modulo `N ≥ 1`, with nonzero conductor. Let
`0 < Re(s) < 1`, and suppose `L(χ,s)=0`. Then

\[
L(\chi^{\mathrm{prim}},s)=0 .
\]

*Proof.* Mathlib's `LFunction_changeLevel` gives the standard change-of-level
identity for `χ.primitiveCharacter`. It says that `L(χ,s)` differs from
`L(χ^{\mathrm{prim}},s)` by finitely many Euler-type factors of the form
`(1-\psi(p)p^{-s})` — in the direction of either multiplication or division:

\[
L(\chi,s)=L(\chi^{\mathrm{prim}},s)\cdot\prod_{p\in S}
\bigl(1-\psi(p)p^{-s}\bigr)^{\pm1},
\]

where S is the finite set of primes at which the levels differ. (The Lean proof
does not name the set; it uses `Finset.prod_eq_zero_iff` on the product supplied by
`changeLevel_primitiveCharacter`.) By Lemma 3.3 every factor is nonzero, hence the
product is nonzero. From `0 = L(χ,s)` we conclude `L(χ^prim,s)=0`. ∎

The range `Re(s) > 0` in the lemma is essential: a removed Euler factor can vanish
only when `|p^{-s}|` is at least `1/p ≤ 1`, which requires `Re(s) ≤ 0` at the
boundary. The critical strip is therefore safe.

### 3.5 Lemma (Gamma factor nonvanishing)

Source: `ClaimStrip.lean:35–40`, `Claim.gamma_ne_zero`, and
`Formalism/GammaFactorNonvanishing/CritLine.lean:6–9`.

For a Dirichlet character φ and `Re(t) > 0`,

\[
\gamma(\phi,t)\ne0 .
\]

Mathlib defines `gammaFactor` according to parity: an even character uses
`Gammaℝ(t)`, an odd character uses `Gammaℝ(t+1)`. The real Gamma factor
`Gammaℝ` has no zeros with positive real part. In the odd case, `Re(t+1)>1>0`.
Both branches are discharged by `Complex.Gammaℝ_ne_zero_of_re_pos`. ∎

### 3.6 Theorem (half-plane ⇒ strip, including imprimitive characters)

Source: `ClaimStrip.lean:59–73`, `Claim.strip`.

**Claim.** `H` implies

\[
\forall N\ge1\ \forall\chi\pmod N\ \forall s,\quad
0<\operatorname{Re}(s)<1\ \wedge\ L(\chi,s)=0
\ \Longrightarrow\ \operatorname{Re}(s)=\tfrac12 .
\]

*Proof.* Fix χ and `s` with `0<Re(s)<1` and `L(χ,s)=0`. Then `s≠1` and `s≠0`.

- **Case `Re(s) > 1/2`.** Apply `H N χ s` with `Or.inr hs`, where `hs : s ≠ 1`.
  It gives `L(χ,s) ≠ 0`, contradicting the zero.
- **Case `Re(s) = 1/2`.** Immediate.
- **Case `Re(s) < 1/2`.** Let `ψ = χ.primitiveCharacter`. Its conductor is
  nonzero, so Lemma 3.4 yields `L(ψ,s)=0`. Since ψ is primitive, the completed
  L-function satisfies the functional equation. Lemma 3.5 and `s≠0` show that
  `Λ(ψ,s)=0` is equivalent to `L(ψ,s)=0`; hence `Λ(ψ,s)=0`. The functional
  equation for ψ (Mathlib's `completedLFunction_one_sub`, applied to the inverse
  character) reflects this to

  \[
  L(\psi^{-1},1-s)=0 .
  \]

  Here `ψ^{-1}` is primitive, because conductors are preserved by inversion. Also
  `Re(1-s) > 1/2`, `1-s ≠ 1` because `s≠0`, and `1-s` is not the pole case. Apply
  `H` to `ψ^{-1}` at `1-s`: it gives `L(ψ^{-1},1-s)≠0`, contradiction.

Thus all cases force `Re(s)=1/2`. ∎

*Why this is not circular.* The reflection lemma is applied only to primitive
characters, and the functional equation is a theorem in Mathlib. The half-plane
hypothesis is the single analytic input. The Euler-factor step is finite and
elementary.

### 3.7 Theorem (half-plane ⇒ the written zeta statement)

Source: `ClaimStrip.lean:75–102`, `Claim.zeta`, `Claim.zeta_iff`.

**Claim.** `H` implies `Claim.Zeta`, hence `RiemannZetaZerosOnLine`.

*Proof.* Take `s` with `ζ(s)=0`, `s` not one of `-2(n+1)`, and `s≠1`.

1. **`s=0` is impossible.** Mathlib's `riemannZeta_zero` gives `ζ(0)≠0`; since
   `ζ(s)=0`, `s≠0`.
2. **`Re(s) ≥ 1` is impossible.** `riemannZeta_ne_zero_of_one_le_re` says that ζ
   has no zeros in the closed right half-plane except the pole value. Since
   `s≠1`, this contradicts the zero.
3. **`0 < Re(s) < 1`.** The L-function of the trivial character modulo 1 equals ζ
   (`LFunction_modOne_eq`), so `L(1,s)=0`. Theorem 3.6 gives `Re(s)=1/2`.
4. **`Re(s) ≤ 0`.** Suppose first that the Gamma factor vanished:
   `Gammaℝ(s)=0`. Mathlib's `Complex.Gammaℝ_eq_zero_iff` says that then either
   `s=0` (excluded in step 1) or `s=-2(n+1)` (excluded by hypothesis). Hence
   `Gammaℝ(s)≠0`. From `ζ(s)=0` and `s≠0`, the definition
   `riemannZeta s = completedRiemannZeta s / Gammaℝ s` gives
   `completedRiemannZeta s = 0`. The symmetry
   `completedRiemannZeta_one_sub` then gives
   `completedRiemannZeta (1-s)=0`. Since `1-s≠0` (as `s≠1`) and
   `Re(1-s) ≥ 1`, the same Gamma-factor relation shows `ζ(1-s)=0`. But
   `riemannZeta_ne_zero_of_one_le_re` says `ζ(1-s)≠0`. Contradiction.

All cases are exhausted, so `Re(s)=1/2`. This is the exact structure of
`Claim.zeta`. The final equivalence `Claim.zeta_iff` is `Iff.rfl`, so there is no
hidden restatement. ∎

---

## 4. Tier I summary: what has been formally tied together

The following are established *conditionally on `H`* by inspected Lean proofs:

1. `H` implies Mathlib's `RiemannHypothesis`.
2. `H` implies the critical-strip GRH statement for every Dirichlet character.
3. `H` implies the primitive-character critical-line statement.
4. `H` implies the written-out zeta statement, including the treatment of the pole
   and the trivial zeros.
5. All three Dirichlet statements and both zeta statements are thereby linked, and
   the links are formally verified applications, not editorial inferences.

Nothing in this list says that `H` is true. The truth of `H` is the burden of §§6–8.

---

## 5. A second, independent primitive reflection

Source: `CritLine.lean:11–27`, theorem `Formalism.VW.critLine`.

This proof does not call `Claim.strip`. Given primitive χ, a zero
`L(χ,s)=0`, `0<Re(s)<1`, it argues `Re(s)=1/2` by contradiction:

- If `Re(s) < 1/2`: `χ⁻¹` is primitive; the completed L-function of χ vanishes at
  s by `gammaFactor_ne_zero`; the functional equation for `χ⁻¹` gives
  `L(χ⁻¹,1-s)=0`; `H` gives nonvanishing at `1-s`, contradiction.
- If `Re(s) > 1/2`: `H` directly contradicts the zero.

The duplication is mathematically instructive: it isolates the functional-equation
mechanism and avoids the conductor-descent argument. It also provides a consistency
check on `Claim.strip`, although only the reported kernel checks establish that both
compile.

---

## 6. The deep layer: what `everyCharacter` actually consumes

### 6.1 The exact assembly

`CharacterBoxes/MainConclusion.lean:7–11`:

```lean
theorem UpperTheory.FinalTheorems.everyCharacter_of_row
    (h : UpperTheory.GalStar.Row0b fun h rc => UpperTheory.Zero.LLC.IsRecT h rc) :
    UpperTheory.EveryCharacter :=
  UpperTheory.LiteratureTheorems.every_character_of_literature_of_vWin
    ⟨h, UpperTheory.Zero.LLC.recTExists, h⟩ (UpperTheory.One.vwin_of_row h)

theorem UpperTheory.FinalTheorems.everyCharacter : UpperTheory.EveryCharacter :=
  UpperTheory.FinalTheorems.everyCharacter_of_row
    UpperTheory.Gal.Int.galoisLocalGlobalStrong_recParameter
```

`EveryCharacterOfLiteratureOfVWin.lean:810`:

```lean
theorem UpperTheory.LiteratureTheorems.every_character_of_literature_of_vWin
    (O : UpperTheory.LiteratureTheorems.OpenLiteratureStatements)
    (hV : UpperTheory.Top.VWin) : UpperTheory.EveryCharacter :=
  UpperTheory.Lit.every_character_of_theta_integrals_local_matching
    (published_results_eigen O)
    (published_results_first O)
    (theta_integrals_agree_and_local_matching_of_literature O).1
    (theta_integrals_agree_and_local_matching_of_literature O).2
```

The visible constructor `⟨h, recTExists, h⟩` shows that the literature record has
(at least) three fields, two of which are the same `Row0b` package and the third
`recTExists`. The exact field names were not recovered in this session. Do not
replace the constructor by a guessed list of hypotheses.

### 6.2 `Row0b`

The type is a Galois-representation attachment property. The atlas's source-read
description is:

> For regular algebraic polarised cuspidal `π` on `GL_a` over a CM field, there is
> a continuous semisimple `ℓ`-adic representation whose Frobenius polynomials match
> the Satake parameters of `π`.

This is a substantial theorem in the Langlands programme. In the formal
development it is a proved declaration, not an axiom (according to the reported
axiom audit). Its internal proof was not reconstructed. Any human exposition that
simply cites "known automorphy" without checking the precise hypotheses is not yet
faithful to the Lean source.

### 6.3 `TopG`

`CharacterBoxes/ZeroFreeAllOfTopG.lean:12`:

```lean
def TopG : Prop :=
  ∀ (la : ℝ) (G : FReq), 1 < la → HostExW la G.req →
    (∀ {eps : ℝ} (Fm : FamP eps), G.cls la Fm → HypV Fm.toFamCore) →
    FamilyClassConnected (G.cls la)
```

In words: for every tied-window exponent `la > 1` and geometric requirement `G`,
if a host/window condition holds and every family in the class satisfies the
`HypV` hypothesis, then the class of families is connected. The exact meanings of
`FReq`, `HostExW`, `HypV`, and `FamilyClassConnected` are inside the development.
`zeroFreeAll_of_topG` (same file) uses this with `la = 3/2`, a scale comparison
`Comparison₂.level_gm_le_on_family_scales`, `formB`, and `supplyChi` to produce
`Formalism.HC.ZeroFreeAll`.

### 6.4 `VWinAt` / `VWin`

`CharacterBoxes/ExistsPageN.lean:44–49`:

```lean
def VWinAt (ψ : PChar) (Ct : ℝ) : Prop :=
  ∀ eps : ℝ, 0 < eps → eps < 1 / 52 → ∀ e : ℝ → ℕ,
    (∀ x ≥ (1 : ℝ), PageN eps x (e x)) →
    ∃ J : ℝ, 1 ≤ J ∧ ∃ X0 : ℝ, ∀ X ≥ X0, ∀ q d : ℕ,
      WinPair eps (X ^ (1 / J)) q d →
        ∃ Y : ℝ, X ^ (1 / J) ≤ Y ∧ Y ^ (2 : ℝ) ≤ X ∧
          ∀ x : ℝ, Y ≤ x → x ≤ Y ^ (2 : ℝ) → VAt ψ eps Ct q d (e x) x

def VWin : Prop := ∀ ψ : PChar, VWinAt ψ 401
```

Mathematical reading, at the level the source supports:

- ε is a small loss exponent, restricted to `0 < ε < 1/52`.
- `PageN eps x (e x)` confines an integer "page" `e` between powers
  `x^(2+8ε)`; the atlas calls this a Behrend-type tower of levels.
- `WinPair` chooses two auxiliary primes `q ≡ 3 (mod 8)` and `d ≡ 7 (mod 16)`,
  with size and divisibility conditions including `q | d+1`.
- There is a window `[Y, Y²]` inside `[X^(1/J), X]` on which `VAt` holds: for every
  relevant number field `E` with the prescribed cyclotomic fixing subgroup, a
  weighted sum of `Z_ℓ`-lengths of locally trivial Galois cohomology of twisted
  modules is at most `√(exp(x^ε))`. The definition uses
  `Formalism.GaloisCohomology.shaLen` and the field predicate `IsChiField`.

`VWin` is the assertion of this for every primitive character ψ at constant 401.
This is the "weakening of Vandiver/Iwasawa-type" window, not a statement about
L-functions directly. Its proof is in `vwin_of_row`, derived from `Row0b`.

### 6.5 `plugWin` / `plugAll`

`CharacterBoxes/EveryCharacter.lean:8–18` shows a second route:

```lean
theorem UpperTheory.Top.plugWin (hG : GlobalTheory.GLq.Green)
    (hV : UpperTheory.Top.VWin)
    (h : Nonempty (Hyps ...)) : Formalism.HC.ZeroFreeAll :=
  h.elim fun h => UpperTheory.Top.zeroFreeAll_of_topG (la := 3 / 2) ... (shapeWin hG) ...
    fun ψ => UpperTheory.Top.supplyChi ψ (hV ψ)

theorem UpperTheory.Top.plugAll ... : UpperTheory.EveryCharacter :=
  UpperTheory.Top.imprimitive (UpperTheory.Top.plugWin hG hV h)
```

This is the architecture's second "verified cut": once the geometric hypotheses
and the cohomological window are supplied, the analytic engine produces a zero-free
region for primitive characters, and imprimitive descent yields `EveryCharacter`.
It confirms that `H` is not assumed: it is produced by the analytic engine from
`TopG`/`VWin`.

---

## 7. The analytic engine (secondary reconstruction)

The following is a faithful summary of the publicly described strategy, not a
reconstruction from an inspected proof of the engine. It must be labelled as such.

### 7.1 Positive families and residues

For a finite family of characters with positive coefficients and a test function
built from ramps, the weighted prime sum has Mellin transform whose poles are the
zeros of the family's L-functions. At a common zero ρ, the contribution is a
positive combination of `-1/(ρ(ρ-1))`; positivity prevents cancellation. A zero
with `Re(ρ)=β` would thus be visible as a large oscillatory term of order
`y^{β}`.

### 7.2 The window criterion

The archive states a one-sided local criterion (the atlas names
`excludeZeroByWindows` / `window1`): if a positive family satisfies

\[
G_F(y)\le C\,y^{\theta}
\]

at every point of arbitrarily late windows `[Y,Y^{3/2}]`, then none of its
L-functions has a zero with `Re(ρ) > θ`. The proof uses a localized Landau
oscillation argument: if `ρ` existed with `β>θ`, a high derivative of the
Laplace transform, aimed at the window, would see a term of size `d^{-k}` against
a bound of size `e^{ηU}r^{-k}` with `r>d`; for large `k` this is impossible.

### 7.3 Order of choices

The exponents are chosen in the order

\[
e_D=2,\ e_L=0;\qquad
\text{given }\rho,\ \tfrac12<\theta<\beta;\qquad
\text{choose }\varepsilon\text{ with }\tfrac12+9\varepsilon\le\theta.
\]

Then the arithmetic supply provides windows at exponent `1/2+9ε`, and the criterion
rules out a zero to the right of `1/2`. This is why no bound at `ε=0` is required.
The numerical loss `9 = e_D + e_L + 7` is explained in the atlas by a staircase of
comparison losses (balance, averaging, constants, discarded characters). This
bookkeeping was not independently checked here.

### 7.4 Geometric discrepancy → prime sum

The finite character comparison uses Fourier orthogonality on a subgroup and a
main-term identity to convert a geometric discrepancy bound into the required
weighted prime-sum bound. The exponent is
`1/2 + (e_D+e_L+7) ε`. The geometry is supplied by the theta-lift chain of length
about `√x`, chosen so that the two loss exponents are fixed numbers. The
divisibility of repeated lifts, covolume and slope bounds, the seesaw periods, and
the construction of hosts all belong to this layer. These are the declarations
named in §6 and in the atlas components 8–14.

---

## 8. Assessment of the named techniques

| Technique | Where it enters | What it is meant to supply | Status of our reconstruction |
|---|---|---|---|
| Stepanov multiplicity | announced origin | a determinant with forced zeros of high order | Historical motivation; no direct formal theorem identified in inspected endpoints |
| Chains of theta lifts (~√X) | geometric family | mimics multiplicity over ℤ; controls discrepancy | Source-read components; internals unresolved |
| Automorphic forms / unitary groups | θ-correspondence | global objects whose periods encode the count | Deep imports; unresolved |
| Rallis seesaw | theta periods | identifies a period with an integral | Mentioned in author's note; not independently traced |
| Bost slope inequality | lattice construction | bounds slope/covolume of an injected lattice | Interface-level only |
| Iwasawa cohomology / Vandiver weakening | `VWinAt` | weighted Galois-cohomology length bounds | Exact definition inspected; proof unresolved |
| Galois representations (`Row0b`) | automorphic input | Frobenius polynomials match Satake parameters | Statement identified; proof unresolved |
| Behrend sets | host construction | additive-combinatorial point set with no short relations | Atlas/source-read; not reconstructed |
| Mellin / Landau oscillation | analytic engine | turns a prime-sum bound into zero-free half-plane | Conceptual outline only |
| Euler-factor descent | `Claim.strip` | primitive ↔ imprimitive | Fully reconstructed and source-checked |
| Functional equations | `critLine`, `rh_of_right`, `Claim.zeta` | reflection across critical line | Fully reconstructed and source-checked |

The table is deliberately not an argument. It records which named techniques are
known to occur where, and how much of each is actually explained. A list of
sophisticated objects is not a proof.

---

## 9. Unresolved register

The following could not be reconstructed from the sources available in this
session and are marked **unresolved for human exposition**:

1. The proof of `Formalism.HC.ZeroFreeAll` from `TopG` and `VWinAt` at the level of
   its internal estimates.
2. The proof of `Row0b` (Galois attachment) and of `recTExists`.
3. The theta-correspondence and local-matching packages passed to
   `every_character_of_theta_integrals_local_matching`.
4. The exact meaning of every field of `OpenLiteratureStatements` (the constructor
   was located, the record definition was not).
5. The derivation of the geometric family and the prime-sum estimate, including the
   claims about `e_D=2`, `e_L=0`, and the thirteen hypotheses in the Waterloo draft.
6. A line-by-line check that the prose in the author's four-page note corresponds to
   specific Lean declarations. Several entries are explicitly described as
   historical motivation rather than matched theorems.
7. Any independent human peer review of the mathematical ideas. The reported checks
   are machine checks of formal validity, not mathematical refereeing.

A complete exposition of these items is possible only with direct work inside the
17M-line development and, ideally, with the author's promised detailed write-up.
