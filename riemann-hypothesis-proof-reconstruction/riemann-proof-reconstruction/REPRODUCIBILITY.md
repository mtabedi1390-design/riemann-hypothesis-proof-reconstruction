# Reproducibility

## 0. Scope

These instructions reproduce the **software checks**, not this dossier's prose.
They are adapted from the mirror README and the MIT page. They were **not executed
in this session**. Resource figures marked "reported" come from those sources.
Our own executed steps are in §7.

## 1. Obtain the exact source

Preferred: the author's archive, because it is the primary artifact.

```bash
for i in $(seq -w 1 14); do
  curl -LO https://alpo.ge/lean.tar.gz.part$i
done
cat lean.tar.gz.part{01..14} > lean.tar.gz
shasum -a 256 lean.tar.gz
# expected: 9631b4f020199e580ba86178cb56c6e9b09f690c2369a80dc4334aa93f49c7fc
# size: 239,275,554 bytes
tar -xzf lean.tar.gz
cd lean
```

Alternative mirror used in this dossier:

```bash
git clone --depth 1 https://github.com/mtabedi1390-design/riemann-hypothesis-lean.git
cd riemann-hypothesis-lean
git rev-parse HEAD
# inspected: 7cbf7a0c32fca1badf05931879a37c3f8a2b03b4
```

Do not assume the mirror commit equals the archive. Compare hashes of every file
you rely on, or do a full tree comparison, before claiming byte identity.

## 2. Pinned environment

From the inspected files:

```
lean-toolchain: leanprover/lean4:v4.33.1
Mathlib git revision: 0df444a360eaa60ab8c11dca51a86af692955474
srcDir: src
package name: tree
autoImplicit: false
maxHeartbeats: 4000000
extra arg: --tstack=400000
```

Install `elan`, then:

```bash
source ~/.elan/env
lake exe cache get
```

## 3. Build targets

```bash
lake build Statements          # small statement layer
lake build Main                # full dependency closure of the five endpoints
```

Reported resources for the full build: on the order of 100 GB RAM and 70 GB disk
for the export/comparator path; 61.57 GB uncompressed export. The MIT page reports
a sandboxed `lake build Main` exit 0 and an export byte-identical to the published
one. Expect a long build on a large machine. A laptop is not a realistic target.

## 4. Axiom audit

Create `Check.lean` at the project root:

```lean
import Main

#print axioms riemannHypothesis
#print axioms riemannZeta_eq_zero_re
#print axioms LFunction_ne_zero_of_half_lt_re
#print axioms LFunction_eq_zero_re
#print axioms LFunction_eq_zero_re_of_isPrimitive
```

Run:

```bash
lake env lean Check.lean
```

Expected, according to the reported audit: only `propext`, `Classical.choice`,
`Quot.sound` for each. Record the actual output. If you see `sorryAx`,
`Lean.ofReduceBool`, or any project axiom, stop and investigate; do not report a
complete proof.

## 5. Statement match

The five statements must be compared against the canonical Mathlib-only challenge.
Two independent tools are reported:

```bash
# Example shape; exact CLI depends on the installed comparator version.
lake comparator --config comparator.json \
  --challenge-from-export challenge.ndjson \
  --solution-from-export solution.ndjson
```

The MIT page reports that both `comparator` and `con-leche --compare` (and the Rust
port `con-ron`) confirmed all five theorems against the challenge. Some
end-to-end stages were still running when the page was last updated (2026-11-22
16:20 UTC). Consult the live page for the current status.

## 6. Independent kernel checks

Reported commands and outcomes (see MIT page for full logs):

```bash
# Lean kernel replay of an inert export
leanchecker solution.ndjson

# nanoda, independent Rust kernel
nanoda_bin solution.ndjson

# con-leche
git clone https://github.com/leanprover/con-leche && cd con-leche
git checkout compare      # 5dc36dc1
lake build con-leche
.lake/build/bin/con-leche --compare challenge.ndjson solution.ndjson
```

Reported: 175,187 modules replay with zero rejections; nanoda accepts; con-leche
accepts; lean4lean accepts all modules (five with raised fuel). Resource use is
tens of GB of RAM and tens of minutes to hours depending on the checker and number
of threads.

## 7. What this dossier actually ran

Only the following, on 2026-11-23, in a sandbox:

```bash
git clone --depth 1 --filter=blob:none --no-checkout \
  https://github.com/mtabedi1390-design/riemann-hypothesis-lean.git /tmp/rh
cd /tmp/rh
git rev-parse HEAD
git ls-tree -r --name-only HEAD | wc -l
git -c core.quotePath=false ls-tree -r --name-only HEAD | grep -c '\.lean$'
# 7cbf7a0c32fca1badf05931879a37c3f8a2b03b4
# 175192 total tracked files
# 175187 .lean files; the other 5 are metadata

# sparse checkout of only the files inspected:
git sparse-checkout init --no-cone
git sparse-checkout set \
  '/src/Development/AutomorphicArithmetic/CharacterBoxes/*' \
  '/src/Supplements/Kernels/*' \
  '/src/Statements.lean' '/src/Main.lean' \
  '/src/Formalism/GammaFactorNonvanishing/*' \
  '/src/Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean'
git checkout

sha256sum src/Statements.lean src/Main.lean \
  src/Supplements/Kernels/MainTheorems.lean \
  src/Development/AutomorphicArithmetic/CharacterBoxes/EveryCharacter.lean \
  src/Development/AutomorphicArithmetic/CharacterBoxes/HalfPlane.lean \
  src/Development/AutomorphicArithmetic/CharacterBoxes/ClaimStrip.lean \
  src/Formalism/GammaFactorNonvanishing/CritLine.lean \
  src/Formalism/GammaFactorNonvanishing/RhOfRight.lean
```

Recorded hashes:

```
79ef7ca776e42abe1f46caee13ea09bd19f1e2d0b1620d8d5d200258f33b47bf  Statements.lean
017645ca448f2fd1f6fd5c4c2cb2c6e96e472725be13f6e180ca6e1574360939  Main.lean
1e734200b9b6a6d2a968743bd0c433d614bd6606cf538ac6d4f0ff70044dde53  Supplements/Kernels/MainTheorems.lean
31f6e49936226cfc3d71b15685347bd2874db0aef384e5cf4fea7d09ba68dc71  CharacterBoxes/EveryCharacter.lean
6d03105a1174a42db5e15350f3def0fb5ea6fc98c24d19215bac05f4416346f7  CharacterBoxes/HalfPlane.lean
74498552f19df4bd5b3c296ed247d25d40cabd1057647dd4db1ee7ba1c57ea03  CharacterBoxes/ClaimStrip.lean
5b1552ac13442150f6900f37b9b44eff1491fad1bebe2ec07a959eecb9bcfe02  GammaFactorNonvanishing/CritLine.lean
7e2c0b519ee420192cad8fb281c2d2bfebae2ba553342fd579c81c2aa0bd3dc5  GammaFactorNonvanishing/RhOfRight.lean
```

No `lake` command was run. No `.olean` was produced. No `#print axioms` output was
obtained.

## 8. A minimal target check for a skeptical reader

1. Verify the archive hash.
2. Verify `RiemannHypothesis` against the pinned Mathlib commit, not against prose.
3. Build `Main`.
4. Print axioms for all five endpoints.
5. Compare the five statements against the Mathlib-only challenge with two tools.
6. Replay the export with at least one independent kernel.
7. Record machine, memory, thread count, timestamps, and full logs.
8. Separate machine verification from human comprehension in your report.

## 9. Unexecuted steps in this dossier

- Full build and all kernel checks.
- Full line count of the archive.
- Full-archive hash comparison with the mirror.
- Environment-level dependency extraction.
- Axiom audit.
- Mathematical review of the deep arithmetic development.
