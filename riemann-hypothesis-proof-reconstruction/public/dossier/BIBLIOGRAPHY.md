# Bibliography and source register

Access date for all web sources: 2026-11-23. This register distinguishes primary
sources, verification reports, mathematical exposition, and methodological
references.

## Primary source and announcement

1. L. Alpöge, *Remark* (four-page announcement of the proof with Claude),
   20 November 2026. <https://alpo.ge/remark.pdf>
   SHA-256 reported by the atlas: `3fc97784b71ddd44ff8aa0a177e99622a1c61b13cfa843a0989ee4a7a0cfeb8d`.
   Consulted via a PDF-to-text render. It contains motivation, chronology, and
   declared intent, **not a proof**.
2. L. Alpöge, Lean archive, 14 parts: `https://alpo.ge/lean.tar.gz.part01` …
   `.part14`. Joined size 239,275,554 bytes; SHA-256
   `9631b4f020199e580ba86178cb56c6e9b09f690c2369a80dc4334aa93f49c7fc`.
3. Public mirror inspected: <https://github.com/mtabedi1390-design/riemann-hypothesis-lean>,
   commit `7cbf7a0c32fca1badf05931879a37c3f8a2b03b4`.
   Original mirror listed by the README:
   <https://github.com/CocoSgt/riemann-hypothesis-lean>.
4. Alternate mirror referenced by verification pages:
   <https://github.com/Deicyde/riemann-hypothesis> at
   `40e56bab026552e089d7afcfeff08d2defb9c005`.

## Formal statement and definitions

5. Mathlib, `Mathlib/NumberTheory/LSeries/RiemannZeta.lean`, definition
   `RiemannHypothesis`, at Mathlib revision
   `0df444a360eaa60ab8c11dca51a86af692955474` (tag v4.33.1).
6. Lean toolchain: `leanprover/lean4:v4.33.1`.
7. Files inspected in the mirror (paths relative to repository root):
   - `src/Main.lean`
   - `src/Statements.lean`
   - `src/Supplements/Kernels/MainTheorems.lean`
   - `src/Supplements/Kernels/MainTheoremsAll.lean`
   - `src/Development/AutomorphicArithmetic/CharacterBoxes/HalfPlane.lean`
   - `.../CharacterBoxes/ClaimStrip.lean`
   - `.../CharacterBoxes/EveryCharacter.lean`
   - `.../CharacterBoxes/ExistsPageN.lean`
   - `.../CharacterBoxes/ZeroFreeAllOfTopG.lean`
   - `.../CharacterBoxes/MainConclusion.lean`
   - `src/Formalism/GammaFactorNonvanishing/CritLine.lean`
   - `src/Formalism/GammaFactorNonvanishing/RhOfRight.lean`
   - `.../ThetaPairLifts/ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean`
   - `lean-toolchain`, `lakefile.toml`

## Verification reports

8. Lean and Mathlib communities (endorsed by Lean FRO and the Mathlib Initiative),
   *Lean verification of the Riemann Hypothesis*, 21 November 2026.
   <https://leanprover-community.github.io/blog/posts/riemann-hypothesis/>
   Certified: statement correct, library compiles, statement match by two tools,
   proof accepted by Lean's kernel and independent checkers.
9. A. Sutherland (MIT), *RH Lean proof: verification files*, page last updated
   2026-11-22 16:20 UTC when consulted.
   <https://math.mit.edu/~drew/grh/>
   Reports compilation, axiom audit, kernel replay, independent kernels, sandboxed
   rebuild, and statement comparison. Some end-to-end stages marked running.
10. M. Rubinstein (Waterloo), *Alpöge/Claude proof of the Generalized Riemann
    Hypothesis*, verification page.
    <https://www.math.uwaterloo.ca/~mrubinst/alpoge_claude_grh/>
    Also `https://mrubinst.github.io/grh-lean-verification/` for the Lean check.
11. B. Naskręcki / reading project, *The announced proof of the Riemann hypothesis:
    map, guide and record of checks*, atlas and proof guide.
    <https://nasqret.github.io/riemann-rev/> and
    <https://nasqret.github.io/riemann-rev/atlas/>
    A secondary source-read project. Its status tiers (kernel-checked vs
    source-read) are cited as interpretations, not as our own extraction.

## Mathematical exposition

12. M. Rubinstein, *The Alpöge–Claude proof of the Riemann hypothesis explained for
    the Riemann zeta function*, version 2, working draft, 22 November 2026, 265 pp.
    <https://www.math.uwaterloo.ca/~mrubinst/alpoge_claude_grh/zeta-paper_v2.pdf>
    Key status: deduces RH from a main inequality (M); **does not prove (M)**;
    reduces it to thirteen numbered hypotheses, none proved outright.
13. Author's original announcement (item 1) for the Stepanov/theta-lift motivation,
    the `√X` chain length, and the declared intent to write a proper exposition.
14. H. Iwaniec and E. Kowalski, *Analytic Number Theory*, AMS Colloquium
    Publications 53, 2004 — standard background for L-functions, functional
    equations, explicit formulae, and zero-free regions.
15. E. C. Titchmarsh, *The Theory of the Riemann Zeta-Function*, 2nd ed., Oxford,
    1986 — classical zeta theory and the functional equation.
16. H. L. Montgomery and R. C. Vaughan, *Multiplicative Number Theory I: Classical
    Theory*, Cambridge Studies in Advanced Mathematics 97, 2007 — Dirichlet
    characters, L-functions, prime sums.
17. J.-P. Serre, *A Course in Arithmetic*, GTM 7, Springer, 1973 — Dirichlet
    characters and Dirichlet's theorem.
18. For theta lifts, seesaw identities, and automorphic periods, the reader should
    consult the primary papers cited inside the archive's development. Those
    internal citations were not extracted in this session and are not invented
    here.

## Prize and status

19. Clay Mathematics Institute, *Riemann Hypothesis*,
    <https://www.claymath.org/millennium/riemann-hypothesis/>; *Millennium Problems
    Rules*, <https://www.claymath.org/millennium-problems/rules/>.
    Contemporary reporting (AP/SMH, 22–23 November 2026) stated that the Institute
    had not changed the problem's status and that its process requires journal
    publication and a two-year wait, among other conditions. We did not fetch the
    rules page in this session; verify the current status directly before
    repeating it.

## Methodological references requested in the brief

20. ITPEval: <https://github.com/lean-dojo/ITPEval>; paper
    <https://arxiv.org/abs/2607.19407>. Relevant concepts: translation fidelity,
    native theorem-prover verification, reproducible evaluation. **Not used as a
    substitute for source inspection**, and no ITPEval run was performed.
21. Herald translator: <https://github.com/frenzymath/herald_translator>;
    datasets <https://huggingface.co/datasets/FrenzyMath/Herald_statements> and
    `Herald_proofs`. Relevant concepts: formal-to-natural-language annotation,
    back-translation, hierarchical explanation. Not a proof of this theorem.
22. FIRMA: <https://github.com/smfatima3/FIRMA>; paper
    <https://aclanthology.org/2025.mathnlp-main.5/>. Relevant concepts:
    bidirectional alignment, proof grounding, semantic preservation. Its repository
    status was not assumed to be production-ready.
23. LEAP: <https://github.com/google-deepmind/superhuman/tree/main/leap>; paper
    <https://arxiv.org/abs/2606.03303>. Relevant concepts: proof decomposition,
    blueprint construction, compiler feedback. This dossier is not an agentic
    proof search run.

## Citation discipline

- URLs and hashes above are recorded so a reader can re-fetch the sources.
- Results attributed to MIT, Waterloo, the Lean/Mathlib community, the atlas, or
  the author are labelled as such in the text.
- No citation is used to support a stronger claim than its source states.
- The dossier's own executed commands and their outputs are in
  `REPRODUCIBILITY.md` §7.
- Where a source was inaccessible or insufficient, the corresponding section is
  marked unresolved rather than filled with a plausible reconstruction.
