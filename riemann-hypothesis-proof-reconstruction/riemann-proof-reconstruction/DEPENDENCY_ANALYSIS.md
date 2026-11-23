# Dependency analysis

**Method and honesty note.** The Lean files were obtained with a blobless,
sparse clone of the public mirror at
`https://github.com/mtabedi1390-design/riemann-hypothesis-lean` (commit
`7cbf7a0c32fca1badf05931879a37c3f8a2b03b4`). The statements and proof scripts
listed as "inspected" were read in full. No elaborated environment dump was
produced; the graph below is therefore a **source-level dependency reconstruction**,
not an assertion-by-assertion environment export. A definitive extraction requires
Lean tooling (`#print axioms`, `#print dependencies`, or a kernel export) at the
pinned toolchain. Status labels distinguish the two.

## 1. Direct formal dependencies of the five endpoints

| Declaration | File:lines | Direct proof-term dependency | Status |
|---|---|---|---|
| `riemannHypothesis` | `src/Main.lean:4` | `rhOfAll` | inspected |
| `riemannZeta_eq_zero_re` | `src/Main.lean:6` | `rhOfAll` | inspected |
| `LFunction_ne_zero_of_half_lt_re` | `src/Main.lean:8` | `allChi` | inspected |
| `LFunction_eq_zero_re` | `src/Main.lean:10` | `claimAll.2.1` | inspected |
| `LFunction_eq_zero_re_of_isPrimitive` | `src/Main.lean:12` | `critAll` | inspected |

`src/Supplements/Kernels/MainTheorems.lean` defines:

| Declaration | Line | Direct dependencies |
|---|---|---|
| `allChi` | 7 | `UpperTheory.FinalTheorems.everyCharacter` |
| `rhOfAll` | 9 | `Formalism.VW.rh_of_every`, `allChi` |
| `critAll` | 11–13 | `Formalism.VW.critLine`, `allChi` |
| `claimAll` | 15–16 | `allChi`, `Claim.strip`, `Claim.zeta` |

## 2. The reduction layer

| Declaration | File:lines | Mathematical role | Direct dependencies |
|---|---|---|---|
| `UpperTheory.EveryCharacter` | `CharacterBoxes/EveryCharacter.lean:13` | half-plane nonvanishing for all χ | Mathlib `DirichletCharacter`, `LFunction` |
| `Claim.HalfPlane` | `CharacterBoxes/HalfPlane.lean:3` | same proposition, local alias | Mathlib |
| `Claim.Strip` | `CharacterBoxes/HalfPlane.lean:6` | critical-strip GRH | Mathlib |
| `Claim.Zeta` | `CharacterBoxes/HalfPlane.lean:9` | written-out RH | Mathlib `riemannZeta` |
| `Claim.factor_ne_zero` | `CharacterBoxes/ClaimStrip.lean:7` | removed Euler factor ≠ 0 | Mathlib complex analysis |
| `Claim.prim_zero` | `CharacterBoxes/ClaimStrip.lean:23` | imprimitive zero ⇒ primitive zero | `factor_ne_zero`, `LFunction_changeLevel`, `changeLevel_primitiveCharacter` |
| `Claim.gamma_ne_zero` | `CharacterBoxes/ClaimStrip.lean:35` | Γ-factor nonzero | `Gammaℝ_ne_zero_of_re_pos` |
| `Claim.prim_reflect` | `CharacterBoxes/ClaimStrip.lean:42` | reflect primitive zero | `LFunction_eq_completed_div_gammaFactor`, `completedLFunction_one_sub`, `gamma_ne_zero` |
| `Claim.strip` | `CharacterBoxes/ClaimStrip.lean:59` | half-plane ⇒ strip | `prim_zero`, `prim_reflect`, `HalfPlane` |
| `Claim.zeta` | `CharacterBoxes/ClaimStrip.lean:75` | half-plane ⇒ zeta statement | `strip`, `LFunction_modOne_eq`, `riemannZeta_def_of_ne_zero`, `completedRiemannZeta_one_sub`, `riemannZeta_ne_zero_of_one_le_re`, `Gammaℝ_eq_zero_iff` |
| `Claim.zeta_iff` | `CharacterBoxes/ClaimStrip.lean:102` | exact statement match | `Iff.rfl` |
| `Formalism.VW.gammaFactor_ne_zero` | `Formalism/GammaFactorNonvanishing/CritLine.lean:6` | Γ-factor nonzero | `Gammaℝ_ne_zero_of_re_pos` |
| `Formalism.VW.critLine` | `.../CritLine.lean:11` | half-plane ⇒ primitive strip | `EveryCharacter`, functional equation |
| `Formalism.VW.rh_of_every` | `.../CritLine.lean:29` | half-plane ⇒ RH | `rh_of_right`, `EveryCharacter`, `LFunction_modOne_eq` |
| `Formalism.VW.rh_of_right` | `.../RhOfRight.lean:5` | right nonvanishing ⇒ RH | `riemannZeta_one_sub`, `Gamma_ne_zero_of_re_pos`, `cos_eq_zero_iff` |

## 3. The character-wide layer (critical path)

```
UpperTheory.FinalTheorems.everyCharacter
├── everyCharacter_of_row
│   ├── UpperTheory.Gal.Int.galoisLocalGlobalStrong_recParameter  [deep, source-read]
│   └── LiteratureTheorems.every_character_of_literature_of_vWin
│       ├── OpenLiteratureStatements ⟨Row0b, Zero.LLC.recTExists, Row0b⟩
│       │   ├── UpperTheory.GalStar.Row0b                        [deep, source-read]
│       │   └── UpperTheory.Zero.LLC.recTExists                 [deep, source-read]
│       └── UpperTheory.Top.VWin
│           ├── UpperTheory.One.vwin_of_row Row0b                [deep, source-read]
│           └── UpperTheory.Top.VWinAt ψ 401                     [cohomological window]
└── UpperTheory.Lit.every_character_of_theta_integrals_local_matching
    ├── published_results_eigen O
    ├── published_results_first O
    ├── ThetaIntegralsAgree
    └── LocalMatching
```

Secondary route visible in `CharacterBoxes/EveryCharacter.lean`:

```
UpperTheory.FinalTheorems.everyCharacter
└── UpperTheory.Top.plugAll
    └── UpperTheory.Top.plugWin hG hV h
        ├── UpperTheory.Top.zeroFreeAll_of_topG (la := 3/2)
        │   ├── zeroFreeOn_of_tiedWin_cyc
        │   ├── Comparison₂.level_gm_le_on_family_scales
        │   ├── Comparison₂.formB
        │   └── supplyChi ψ (VWin ψ)
        ├── UpperTheory.Top.shapeWin hG
        ├── GlobalTheory.Fc.shape_of
        └── Nonempty (Hyps …)
```

The second route and the first are alternative architectures for the same
half-plane theorem. The relationship between them was not formally extracted.
The dossier therefore does not claim they are identical proof terms.

## 4. Direct dependency vs mathematical order

The declaration graph runs one way, the mathematical exposition another:

- The graph begins at `everyCharacter` and unfolds into a huge library.
- The human argument begins with the analytic estimate, proceeds to a zero-free
  region, descends to all characters, reflects to the critical line, and only then
  reaches the exported endpoints.
- A tactic such as `linarith` or a call to `completedLFunction_one_sub` is a formal
  dependency but not an explanatory step. The reconstruction in
  `DETAILED_PROOF_RECONSTRUCTION.md` supplies the mathematical meaning separately.

## 5. Interface statements recovered exactly

- `UpperTheory.EveryCharacter` = `Claim.HalfPlane` = `DirichletLNonvanishingRightOfHalf`.
- `TopG`: quantified family-connectedness with `la > 1`, `HostExW`, `HypV`.
- `VWinAt ψ Ct`: cohomological window over `0<ε<1/52` with `WinPair`, `PageN`,
  `IsChiField`, `VVle`, bound `√(exp(x^ε))`; `VWin := ∀ ψ, VWinAt ψ 401`.
- `every_character_of_literature_of_vWin` consumes
  `OpenLiteratureStatements` and `VWin`; its constructor in `MainConclusion` shows
  three visible components.

## 6. Not extracted

- The elaborated declaration list for each theorem (would require Lean).
- The transitive import closure (thousands of modules).
- The internal dependency graph of `Row0b`, `vwin_of_row`, `supplyChi`, and the
  theta-correspondence packages.
- A formal proof that the second architecture and the first are the same proof.
- The exact field names and full definition of `OpenLiteratureStatements`.

These are declared as limitations, not filled by guessing.
