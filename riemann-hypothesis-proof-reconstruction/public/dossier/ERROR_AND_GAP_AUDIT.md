# Error, gap, and unsupported-claim audit

This audit distinguishes defects in the **formal source**, defects or gaps in
**secondary prose**, limitations of **this reconstruction**, and **scope
confusions**. No defect is invented. Where a component was examined and no defect
was found within the stated scope, that is stated.

## Finding 1 — Repository metadata reconciled; our first count was wrong

**Severity: none (a correction to this dossier's initial finding).**
**Evidence (executed).** The first enumeration used
`git ls-tree -r --name-only | grep -c '\.lean$'` and returned 174,793, which
appeared to contradict the reported 175,187 modules. On inspection, the missing 394
entries were Lean files whose paths contain non-ASCII characters. Git quotes such
paths and places the closing quote after the suffix, so a pattern anchored at
`.lean$` misses them. Running

```bash
git -c core.quotePath=false ls-tree -r --name-only HEAD | grep -c '\.lean$'
```

returns **175,187**. The tree has 175,192 tracked files: those 175,187 `.lean`
sources and five metadata files (`.gitignore`, `README.md`, `lake-manifest.json`,
`lakefile.toml`, `lean-toolchain`). The reported module count is therefore fully
consistent with the mirror tree.

**Impact.** No defect in the archive or in the verification reports. The error was
in this dossier's counting command, and is corrected in every artifact. **Lesson:**
count non-ASCII paths with quoting disabled, or count with `-z`. Do not publish a
provenance discrepancy until the enumeration itself has been audited.

## Finding 2 — "Complete human proof" does not exist in the sources examined

**Severity: high for the stated mission.**
**Evidence.** The author's four-page note contains motivation, a chronology, and the
statement that the argument is very long and not yet mastered; it explicitly says
he intends to write it up properly and expects simplification. The Waterloo page
describes a 265-page working draft that deduces RH from a main inequality (M) and
then "reduces it to thirteen numbered hypotheses stated in classical terms, none of
which is proved outright". The draft is labelled version 2, 22 November 2026,
working draft.

**Mathematical reason.** A formal proof can be correct while no human-readable,
unconditional proof of the central estimate has been supplied. The present dossier
fully reconstructs only the reduction layer. **Suggested correction.** Do not cite
the Waterloo draft as a complete proof of (M) or of RH. Do not describe this
dossier as a complete human proof.

## Finding 3 — "GRH" scope inflation

**Severity: medium.**
**Evidence.** The formal endpoints quantify only over Dirichlet characters of
positive modulus. Dedekind zeta functions, Hecke L-functions, and general
automorphic L-functions are not among them. The MIT page states this scope
explicitly, as does the Lean/Mathlib statement.

**Suggested correction.** Always write "GRH for Dirichlet L-functions". Statements
that the full generalized Riemann Hypothesis, or the Extended Riemann Hypothesis,
has been formally proved are unsupported by these five declarations. The author's
expectation of extending the method is not a theorem.

## Finding 4 — The author's timeline is not a proof map

**Severity: medium for exposition, none for formal validity.**
**Evidence.** The reading atlas compares the twenty announcement entries with the
archive and marks several as historical motivation or analogy, with no exact
theorem correspondence identified. The author calls the list "a rough timeline"
and says it was provided by Claude after a search. The announcement's claims about
determinants, finite-field sign arguments, and intermediate exponent 2/3 are not
statements of the exported endpoints.

**Mathematical reason.** A historical narrative can motivate a technique without
establishing the estimate actually used. **Suggested correction.** Keep the
announcement's claims attributed and labelled. Do not treat `qN=Mk+R`, the
two-support test, or the 2/3 barrier as proved lemmas of the formal proof unless a
specific declaration is located.

## Finding 5 — Unreconstructed core (the central gap)

**Severity: high.**
**Evidence.** `everyCharacter` is proved from
`every_character_of_literature_of_vWin` with `Row0b`, `recTExists`, and `VWin`.
These declarations have enormous import closures. The exact internal proofs of the
geometric family, the theta-lift chain, the finite character comparison, the
cohomological windows, and the analytic engine were not reconstructed. We located
their interfaces (`TopG`, `VWinAt`, `OpenLiteratureStatements`) and some proof
assembly (`plugWin`, `zeroFreeAll_of_topG`), but not the mathematical derivations.

**Impact.** This is an expository gap and a gap in the dossier, **not evidence that
the formal proof is wrong**. The reported kernel checks address validity, not
explainability. **Suggested correction.** Treat §§5–8 of the detailed reconstruction
as a map, not a proof. Commission a module-by-module reconstruction with the Lean
environment available.

## Finding 6 — `OpenLiteratureStatements` not recovered in full

**Severity: medium (documentation precision).**
**Evidence.** `MainConclusion.lean` visibly constructs the record as
`⟨h, recTExists, h⟩`. The record definition itself was not located in the sparse
extraction. It is therefore incorrect to state its exact fields or a definitive
list of "seven inputs" as if extracted.

**Suggested correction.** Quote the constructor and the downstream use; mark field
names unresolved. The seven-package description in secondary sources should be
attributed as secondary.

## Finding 7 — Mirror provenance

**Severity: medium (provenance, not mathematics).**
**Evidence.** The mirror README states the tree is byte-for-byte the author's
archive, with only README/.gitignore added, and gives an archive SHA-256. We did not
download the 239 MB archive or compare every file hash. We only hashed the eight
files we inspected.

**Suggested correction.** A full equality claim requires a tree-level comparison
or at least the absence of modifications in the inspected path. Report the mirror
commit and per-file hashes (done in the CSV) and label full equality as reported,
not verified here.

## Finding 8 — Axiom audit not reproduced

**Severity: medium (verification independence).**
**Evidence.** MIT, Waterloo, and Lean/Mathlib report the standard three axioms. We
did not execute `#print axioms`. The statement "the five theorems depend only on
`propext`, `Classical.choice`, `Quot.sound`" must therefore be attributed.

**Suggested correction.** Reproduce the audit in the pinned environment. Do not
convert "reported by MIT" into "we checked". No evidence of `sorryAx` or a custom
axiom was found, but the evidence is the reports, not our own run.

## Finding 9 — The phrase "without assumptions"

**Severity: low (terminology).**
**Evidence.** The author says the arguments are formalised "without assumptions".
Formally this is consistent with the reported axiom result (no extra axioms,
no `sorry`). Mathematics always has foundational assumptions, Mathlib's definitions,
and standard axioms. The phrase does not mean "no hypotheses in the theorems": the
endpoints have explicit hypotheses (`s≠1`, trivial-zero exclusion, positivity of
modulus, strip bounds).

**Suggested correction.** Say "no unproved axioms or admitted gaps beyond Lean's
standard axioms, as reported". Keep the explicit hypotheses visible.

## Finding 10 — Necessity and counterexamples

**Severity: none found; one wording corrected.**
The endpoint hypotheses were examined. The trivial-zero exclusion is genuinely
necessary. By contrast, `s≠1` is a definitional convention: Mathlib's ζ has a junk
value at its pole, and at this pin `riemannZeta_one_ne_zero` shows the value is
nonzero, so the hypothesis does not exclude a genuine zero. It remains part of
Mathlib's official statement and must not be silently dropped, but it should not be
called a necessary analytic exclusion. For the Dirichlet endpoints, the trivial
character's pole exception is part of the L-function convention. We did not
construct a counterexample to any theorem, because none is suggested by the
statements. Details in `AXIOMS_AND_ASSUMPTIONS.md` §5.

## Finding 11 — Consistency of the inspected reductions

**Severity: none found within the examined scope.**
The inspected Lean proof scripts (`factor_ne_zero`, `prim_zero`, `gamma_ne_zero`,
`prim_reflect`, `strip`, `zeta`, `zeta_iff`, `gammaFactor_ne_zero`, `critLine`,
`rh_of_every`, `rh_of_right`) are internally coherent as mathematics: their
hypotheses suffice for the stated conclusions, the Euler-factor and Gamma
nonvanishing facts are correctly invoked, and the endpoint statements match the
stated propositions. This is a human source audit, not a kernel check. No claim is
made about files that were not inspected.

## Finding 12 — Prize / recognition status

**Severity: medium (public communication).**
**Evidence.** Contemporary reporting says the Clay Mathematics Institute had not
changed the problem's status; the Institute's rules require publication in a
qualifying journal and a two-year waiting period among other conditions. We did not
independently fetch the Clay rules in this session, so this is attributed to the
reporting cited in `BIBLIOGRAPHY.md`.

**Suggested correction.** Distinguish four statuses: formal kernel acceptance;
independent verification; expert mathematical comprehension/peer review; official
prize recognition. None implies the next. Do not claim a Clay award.

## Appendix — the thirteen inputs in the Waterloo exposition

The following is taken from §III.11 (pp. 193–194) of the 265-page working draft
(version 2, 22 November 2026). It documents the state of the **secondary
exposition**, not a defect in the Lean proof. The draft states that (H0)–(H11) at
one sufficiently large scale imply its main inequality (M), and (H12) supplies
those data on the required intervals `[Z,Z^{3/2}]` with constants independent of
`Z`. The draft also states that **none of the thirteen is proved outright there**.

| Input | Role as labelled in the draft | Draft's reported status |
|---|---|---|
| (H0) | sizes of the parameters, the columns, and the density estimates | partly proved from named statements; first half of (g) assumed |
| (H1) | the size of the pairing | proved in §III.7 from named inputs |
| (H2) | the level correction | assumed here |
| (H3) | heights of two words | assumed here; elementary in kind |
| (H4) | the level prime and the count of forms | mixed; lower bound assumed, upper bound a condition of O23 |
| (H5) | the first lattice of forms | assumed here; described as deep |
| (H6)(i) | the pairing is integral | proved from named statements |
| (H6)(ii) | lower bound for the pairing | proved from named statements |
| (H6)(iii) | upper bound for its total | proved from named statements |
| (H7) | the gain against the known lattice | quoted |
| (H8) | the mean-slope inequality | proved from §III.8 statements |
| (H9) | the range of the slopes | assumed here |
| (H10) | `δ_p ≤ 1/2` | proved with one quoted statement |
| (H11) | ranks are positive | proved from §III.8 statements |
| (H12) | supply on windows: data with (H0)–(H11) at every `x ∈ [Z,Z^{3/2}]`, with good primes `q,d` | assumed; only the existence of the primes in clause (b) is proved |

The draft's own summary of what remains (§I.12) lists seven tasks, including:
the passage from its Theorem J to the divisibility conclusion; local comparison
inequalities; the lattice statement; the eleven sums over primes; denominators;
and a checked bibliography for the published results. It reports that the Lean
development gathers **195 formal entries** under published results, including
repetitions and one unused slot, and that the bibliographic matches proposed there
were "from memory" and not systematically checked; several are weak forms of the
published theorems.

**Interpretation.** This table is not evidence that (H0)–(H12) are false, unproved
in Lean, or axioms. The formal development claims them as proved declarations, and
the reported kernel audits concern that development. It is evidence that the
**public conventional exposition is conditional**, and that a reader cannot obtain
an unconditional human proof of (M) from the Waterloo draft alone. The corresponding
formal interfaces are `TopG`, `VWinAt`, and `Row0b`; see
`DEPENDENCY_ANALYSIS.md`.

**Caution.** The labels above are transcribed from a working draft by another
author, not from Lean declarations. They should not be substituted for the formal
statements without checking each against the archive.

## Severity summary

| # | Finding | Severity | Affects formal validity? |
|---|---|---|---|
| 1 | Metadata reconciled; initial count was wrong | None (corrected) | No |
| 2 | No complete human proof published | High (mission) | No |
| 3 | GRH scope inflation | Medium | No |
| 4 | Timeline ≠ proof map | Medium | No |
| 5 | Core unreconstructed | High (exposition) | No |
| 6 | Literature record fields unknown | Medium | No |
| 7 | Mirror equality not fully verified here | Medium | No |
| 8 | Axiom audit attributed only | Medium | No (attribution) |
| 9 | "Without assumptions" ambiguity | Low | No |
| 10 | Necessity of hypotheses | None found | — |
| 11 | Inspected reductions consistent | None found | — (human audit) |
| 12 | Prize status confusion | Medium | No |
