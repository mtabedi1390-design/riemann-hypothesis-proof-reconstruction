# Riemann proof reconstruction dossier

**Subject.** The Lean 4 formalization attributed to Levent Alpöge, with Claude, of
the Riemann Hypothesis and GRH for Dirichlet L-functions.

**Snapshot.** Public mirror `mtabedi1390-design/riemann-hypothesis-lean`,
commit `7cbf7a0c32fca1badf05931879a37c3f8a2b03b4`; Lean
`leanprover/lean4:v4.33.1`; Mathlib
`0df444a360eaa60ab8c11dca51a86af692955474`. Archive SHA-256
`9631b4f0…49c7fc`.

**Status.** Partial reconstruction, 2026-11-23. The endpoint reductions are
inspected and reconstructed. The 17M-line arithmetic core is mapped only at its
formal interfaces. No Lean build, kernel replay, or axiom audit was executed in
this work; verification results are attributed to MIT, Waterloo, and the
Lean/Mathlib community.

## Start here

1. `EXECUTIVE_SUMMARY.md` — scope, findings, limits.
2. `THEOREM_STATEMENTS.md` — five endpoints with exact hypotheses.
3. `DETAILED_PROOF_RECONSTRUCTION.md` — the main reconstruction.
4. `ERROR_AND_GAP_AUDIT.md` — twelve findings, plus the thirteen Waterloo inputs.
5. `REPRODUCIBILITY.md` — what to run and what we actually ran.

## Artifacts

| File | Content |
|---|---|
| `EXECUTIVE_SUMMARY.md` | precise overview and verdict |
| `THEOREM_STATEMENTS.md` | formal and natural-language statements |
| `MATHEMATICAL_BACKGROUND.md` | zeta, L-functions, windows, theta lifts |
| `PROOF_OVERVIEW.md` | high-level strategy and conditional structure |
| `DETAILED_PROOF_RECONSTRUCTION.md` | numbered reconstruction of the reductions |
| `DEPENDENCY_ANALYSIS.md` | source-level hierarchy, interfaces, extraction limits |
| `DEPENDENCY_GRAPH.mmd` | Mermaid graph (extracted vs editorial edges) |
| `AXIOMS_AND_ASSUMPTIONS.md` | reported audits, explicit hypotheses, trust boundary |
| `ERROR_AND_GAP_AUDIT.md` | severity-rated audit, Waterloo H0–H12 |
| `DECLARATION_TRACEABILITY.csv` | 36 declarations with files, lines, roles, status |
| `REPRODUCIBILITY.md` | pinned commands, resources, executed/unexecuted |
| `BIBLIOGRAPHY.md` | primary, verification, exposition, method sources |

## Reproducing the dossier's source snapshot

```bash
git clone --depth 1 --filter=blob:none --no-checkout \
  https://github.com/mtabedi1390-design/riemann-hypothesis-lean.git /tmp/rh
cd /tmp/rh
git rev-parse HEAD
git ls-tree -r --name-only HEAD | wc -l        # 175192 total tracked files
git -c core.quotePath=false ls-tree -r --name-only HEAD | grep -c '\.lean$'
# 175187 .lean files; the other 5 are metadata
```

The mirror tree is fully consistent with the reported 175,187 modules. A naive
`.lean$` grep returns 174,793 because Git quotes 394 non-ASCII paths; `quotePath`
must be disabled. The initial discrepancy was a counting error, corrected here and
in the audit. See `ERROR_AND_GAP_AUDIT.md`, finding 1.

## Scientific integrity

This dossier does **not** claim to prove RH, to reproduce the machine checks, or to
have reconstructed the arithmetic core. It distinguishes formal verification,
mathematical understanding, peer review, and prize recognition. Statements are
traceable to the pinned Lean source or explicitly attributed to secondary sources;
unresolved sections are marked as such.
