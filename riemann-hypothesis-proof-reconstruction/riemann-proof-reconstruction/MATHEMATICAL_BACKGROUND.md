# Mathematical background

This note collects only the prerequisites used in the reconstructed endpoint
argument and names, without pretending to prove, the deeper objects visible at the
boundary of the arithmetic development.

## 1. The zeta function and its completion

For `Re(s) > 1`,

\[
\zeta(s)=\sum_{n\ge1}n^{-s}=\prod_p(1-p^{-s})^{-1}.
\]

It continues meromorphically to ℂ with a simple pole at `s = 1` and no other pole.
The completed function

\[
\xi(s)=\tfrac12 s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s)
\]

is entire and satisfies `ξ(s) = ξ(1-s)`. Mathlib packages a related completed zeta
function; in the proof inspected, the relevant facts are
`riemannZeta_def_of_ne_zero` (division by the Gamma factor away from `s = 0`),
`completedRiemannZeta_one_sub` (the reflection identity), and
`riemannZeta_ne_zero_of_one_le_re` (nonvanishing on `Re(s) ≥ 1`, classically proved
from the Euler product and the nonvanishing of ζ on `Re(s) = 1`).

The trivial zeros are `s = -2, -4, -6, …`; they come from the poles of `Γ(s/2)`.
The non-trivial zeros are conjecturally all on `Re(s) = 1/2`. Mathlib's
`RiemannHypothesis` is the assertion that every zero not in the trivial family and
not the pole value has real part 1/2. The extra `s ≠ 1` condition is a convention:
Mathlib assigns ζ a junk value at its pole; at the pinned revision that value is
nonzero (`riemannZeta_one_ne_zero`), so the condition is not an extra analytic
exclusion.

## 2. Dirichlet characters and L-functions

A Dirichlet character modulo `N` is a homomorphism `(ℤ/Nℤ)^× → ℂ^×`, extended by
zero on non-units. Its Dirichlet L-function is

\[
L(\chi,s)=\sum_{n\ge1}\chi(n)n^{-s}=\prod_{p\nmid N}(1-\chi(p)p^{-s})^{-1}
\quad(\operatorname{Re}s>1),
\]

continued meromorphically to ℂ. For nonprincipal χ it is entire. The trivial
character modulo 1 satisfies `L(1,s) = ζ(s)`; this is the exact bridge used in
`Formalism.VW.rh_of_every`.

An imprimitive character χ modulo N is induced by a unique primitive character
`χ.primitiveCharacter` modulo its conductor `c | N`. Their L-functions differ by
finitely many Euler factors:

\[
L(\chi,s)=L(\chi^{\mathrm{prim}},s)\prod_{p\in S}(1-\chi^{\mathrm{prim}}(p)p^{-s}),
\]

for a finite set S of primes. This identity is used in the opposite direction in
the Lean file: from a zero of the imprimitive L-function one deduces a zero of the
primitive one, because no removed Euler factor can vanish in `Re(s) > 0`.

The completed L-function is

\[
\Lambda(\chi,s)=
\begin{cases}
\pi^{-(s+a)/2}\Gamma\!\left(\frac{s+a}{2}\right)L(\chi,s), & a\in\{0,1\}
\end{cases}
\]

with `a` determined by the parity of χ. It satisfies a functional equation relating
`Λ(χ,s)` and `Λ(χ^{-1},1-s)`. Mathlib's `gammaFactor` packages the Gamma and power
factors; `completedLFunction` packages Λ. The key nonvanishing input is that
`gammaFactor χ s ≠ 0` when `Re(s) > 0`.

## 3. Why the right half-plane determines the line

Suppose every Dirichlet L-function is nonzero for `Re(s) > 1/2` (away from the
trivial-character pole at 1). A zero `ρ` of `L(χ,·)` inside the critical strip with
`Re(ρ) < 1/2` reflects under the functional equation to a zero of `L(χ^{-1},·)` at
`1-ρ`, whose real part is `> 1/2`, contradicting the half-plane theorem. This is
the entire "reflection" step. For ζ, the same idea uses the functional equation of
the completed zeta function; the prefactor's zeros are exactly the trivial zeros
and the pole.

Two different implementations occur in the archive:

- `Claim.strip` first passes from imprimitive χ to its primitive character, then
  reflects.
- `Formalism.VW.critLine` reflects directly for an already primitive χ.

They prove the same Dirichlet statement by the same mechanism.

## 4. A weighted prime sum and its Mellin transform

The deeper argument is organised around a smoothed von Mangoldt sum. For a height
`y`, define the ramp weight `(y/n-1)_+ = max(y/n-1,0)` and

\[
G(y)=\sum_{n\le y}\Lambda(n)\left(\frac{y}{n}-1\right)-y\log y+(1+\gamma)y .
\]

The Mellin transform of a single ramp is `n^{-s}/(s(s-1))`. Summing over prime
powers and using `-ζ'/ζ(s) = Σ Λ(n)n^{-s}` produces poles at zeros of ζ. Near a
zero `ρ`, the contribution has residue proportional to `-1/(ρ(ρ-1))`. If one takes
a **positive** combination of such sums over a family of characters, the residues
at a common zero add rather than cancel. This is the "positive family" device.

The explicit formula relates `G(y) - log 2π` to a sum over zeros,
`-Σ_ρ y^ρ/(ρ(ρ-1))` plus lower-order error. An upper bound for `G` on arbitrarily
late windows therefore constrains zeros: a zero of real part `β` contributes an
oscillation of size roughly `y^{β}`. The archive aims to prove one-sided bounds of
the shape `G_F(y) ≤ C y^{1/2+9ε}` on windows `[Y,Y^{3/2}]`.

## 5. Why derivative "spotlights" and Landau oscillation appear

Applying a high derivative to the Laplace transform of `G_F(e^u)` concentrates a
kernel near a chosen `u = log y`. This makes a local bound on one window into a
statement about a zero's contribution. A Landau-type oscillation theorem then
converts the impossibility of an off-line zero's exponentially growing contribution
into a half-plane zero-free region. The precise Lean implementation is inside the
unreconstructed core; the conceptual statement is documented in
`PROOF_OVERVIEW.md` and marked as secondary.

## 6. Theta lifts, Stepanov multiplicity, Galois representations

The author's announced mechanism is a descendant of Stepanov's polynomial method
over function fields. Stepanov's argument uses a divisor with multiplicity; over
the integers, multiplicity has no naive analogue ("differentiating whole numbers").
The announced substitute is a chain of theta lifts of length about `√X`, each lift
mimicking one order of multiplicity. The geometric objects are unitary groups and
theta kernels; the arithmetic objects are automorphic representations, Galois
representations, and Galois-cohomology/Iwasawa-type bounds. A "Rallis seesaw"
identity is mentioned as a period identity relating theta lifts. Bost's slope
inequality is mentioned as a lattice/covolume bound in the construction.

These words occur in the author's note and in the source declarations
(`TopG`, `VWinAt`, `Row0b`, `every_character_of_literature_of_vWin`). They are not
a proof: knowing that an argument uses a theta lift tells one nothing about the
validity of the required estimate. The dossier therefore uses these terms only to
orient the reader and marks their internal development as unresolved for human
exposition.

## 7. What the formal statement keeps separate

The formal development separates four layers:

1. **Endpoint layer:** the five statements in `Main.lean`.
2. **Reduction layer:** `rhOfAll`, `critAll`, `claimAll`, `Claim.strip`,
   `Claim.zeta`, and the reflection lemmas.
3. **Character-wide layer:** `UpperTheory.EveryCharacter`, together with `TopG`
   and `VWin`.
4. **Arithmetic/analytic layer:** `Row0b`, `recTExists`, the theta/automorphic
   comparison, and the cohomological windows.

Tier 1 and 2 of this dossier are reconstructed. Tier 4 is where a conventional
proof would need hundreds of pages and is not claimed here.
