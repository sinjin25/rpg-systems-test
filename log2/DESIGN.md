# log2 composition model

A design record for how numeric calculations (AC, attack, saves, damage) are meant to
be built out of the node/leaf primitives in `index.ts`. This describes the *composition*
model only — how sub-trees are solved and reused. It does not cover how discovered
content (feats, statuses, equipment) gets routed onto nodes; that is a separate concern
tracked elsewhere.

---

## Core primitive (recap)

Every value is a `ModNode`: a `displayName`, a `total()`, and `children`. What differs
between nodes is not their type but the `TotalFunc` they carry — the rule that folds
their children into their own total (`sum`, `min`, `max`, `product`, a rounding map, a
constant).

- `total()` is the source of truth. `children` are the explanation.
- A **leaf** is not a distinct type. It is a node whose rule ignores its children
  (`constantFunc`). "Leaf-like" is a statement about *arity in the consumer's rule*, not
  a conversion.

The rest of this document is about how these primitives are assembled into real answers.

---

## The model

### 1. Solve sub-problems as standalone modules

Each meaningful quantity — Dex, Strength, Base Attack Bonus, the armor Max-Dex allowance
— is solved by its own function that takes the character (`Owner`, the bag of five
sheets: `cs`, `fs`, `es`, `ss`, `as`) and returns a `ModNode`.

- The base value is a leaf pulled from the character sheet.
- A finite, known set of contributions (statuses affecting Dex, etc.) attach to it.
- Because it is a pure function of its inputs, it can be **tested in isolation**. Anyone
  downstream who consumes "Dex" inherits that confidence.

### 2. Compose upward

A bigger tree is built by asking for the sub-trees it depends on and folding them.
A solved sub-tree is handed to a parent *as a whole node*, never flattened to a bare
number — the parent's `TotalFunc` only ever calls `.total()`, so there is zero cost to
keeping the full explanation, and every "why is this number what it is?" question stays
answerable at every level.

### 3. Destinations choose the transformations

A producer does not know how it will be used. Dex is solved once as a raw modifier.
*Which restrictions apply to it is the destination's decision*, not Dex's:

- **AC** wraps Dex in the armor Max-Dex cap.
- **Attack** and **Reflex** use the raw Dex modifier — no cap.

The set of transformations between the leaves and a destination is not open-ended or
mysterious; it is a **known, authored set that fires conditionally**. Weapon Finesse is
authored code; what is dynamic is only whether *this* character has it. So "keep solving
sub-problems until we run out" has a definite, enumerable stopping point per destination.

Transformations are **partial**: a transformation may decline. `effectiveDex` is
`min(dex, allowance)` *if an allowance exists*, otherwise just `dex`. So a transformation
is `(inputs) => node | passthrough`, not a mandatory node constructor. (`minFunc` throws
on empty children by design, which is what forces this branch to be explicit rather than
fudged.)

### Worked example: Dex for AC

Three *distinct* trees, three distinct names — do not let one name do double duty:

| key            | what it is                                             | depends on          |
| -------------- | ------------------------------------------------------ | ------------------- |
| `dexMod`       | raw modifier from sheet + stat-affecting statuses      | Owner               |
| `maxDexAllowance` | lowest equipment cap + Max-Dex boosts (Armor Training) | Owner            |
| `effectiveDex` | `min(dexMod, maxDexAllowance)`, or `dexMod` if no allowance | the two above   |

- **AC** consumes `effectiveDex`.
- **Attack** and **Reflex** consume `dexMod`.

Collapsing "the cap" and "the capped result" into one node named "Max Dex" creates a
`maxDex → effectiveDex → maxDex` cycle that is purely a naming mistake. Keep them apart.

---

## Scope: the discrete calculation

The tree and any per-calculation memo exist **only for the duration of arriving at one
final answer** (e.g. one attack = final roll + final mod, or one AC check). After that it
stops existing unless a reference is deliberately kept.

- Multiple attacks in a turn are **built fresh each time** — they must be, because the
  rolls have to differ. No reuse across attacks.
- This is what dissolves staleness and parameterization worries: nothing lives long
  enough to go stale, and you never reuse a tree keyed on inputs it no longer matches.

### Cross-actor values are handed over as fixed, pre-resolved trees

When resolving "did the attack hit?", the defender no longer has the attacker's `Owner`
and will not recompute the incoming attack. It is handed a **fixed tree** —
`attackerAttack` — computed earlier, all volatile values already baked to constants, and
trusted as-is.

```
didAttackHit                     ← a normal function, NOT a node
  AC                             ← a tree we just computed (this actor)
  Incoming attack (trust me bro) ← a fixed foreign tree, handed over and trusted
```

Such a foreign tree must be treated as **sealed**: it came from an owner we no longer
hold, so nothing local may push into it or mutate it. (See the sealing note below.)

---

## Invariants

### Purity: no number changes mid-calculation

The single load-bearing rule. `total()` is lazy and re-reads `children`, so an **impure
`TotalFunc` breaks everything** — a node containing RNG or an impure mod returns a
different number on a second read, and a second read *will* happen (rendering the outline
calls `total()` on every node, so "compare, then print the breakdown" evaluates twice and
the printout can disagree with the decision that was made).

Enforcement — state it out loud:

> A finished tree contains no impure `TotalFunc`s. RNG and impure mods are collapsed to
> constant leaves **at build time**. Only structural folds (`sum`, `min`, `max`,
> `product`) survive into the tree.

`rollNode` already models this: it resolves the die once at construction and stores the
result via `constantFunc`. Any other volatile input must do the same before it enters the
tree.

### Sealing: built, then consumed — never mutated after

A sub-tree is pure in `Owner`, fully built before it is returned, and not mutated after
something consumes it. This matters most for:

- **`rollNode`**, which resolves its die eagerly — a die built before its `sides` subtree
  finished collecting contributions is silently wrong. Bottom-up ordering makes this
  correct by default, but nothing *enforces* it.
- **Foreign trees** (the incoming attack), which must be off-limits to any local mutation.

The invariant is cheap to hold if stated and invisible-until-wrong if not. A `seal()`
step or a firm phase-boundary convention is the way to make it real.

### Boundary: numbers in the tree, decisions outside

The `ModNode` world is **numeric, pure, foldable**. Decisions, comparisons, and control
flow live in **ordinary functions outside it**.

- A hit is a boolean, not a number — `didAttackHit` is `attack.total() >= ac.total()`,
  with the two subtrees hanging off it *for explanation only*, not as a fold.
- Same for crit confirmation, save success, damage-reduction thresholds.
- Do not invent a `TotalFunc` that returns 0/1 to force a boolean into a node.

RNG is the *only* sanctioned crossing of this boundary: it is produced by a function (the
roller) but stored in the tree as a leaf. That is exactly `rollNode`.

---

## Open questions / blind spots

- **Does an in-calc memo earn its keep?** Cross-calc identity is explicitly *not* wanted
  (fresh every discrete calculation), which removes the original reason for a cache. What
  remains is only **diamonds within one calc** — the same `f(Owner)` sub-tree needed in
  two branches of one tree (e.g. a feat that reads Dex in two places; Str feeding both
  attack and damage within one full swing). If those don't exist, the "cache" is just
  function composition and the call stack, and should be dropped. **Enumerate the real
  in-calc diamonds before building any resolver.**

- **"Then we sum" is the weakest generalization.** Two destinations break a plain sum:
  - **Damage is a product** (crit): `(multiplier × sum(multiplied)) + sum(non-multiplied)`
    — precision/sneak/elemental damage is not multiplied. Expressible today with
    `productFunc` + `sumFunc`, but every damage contribution must be **classified**
    (multiplied or not) before assembly.
  - **Same-type bonuses do not stack**: the real fold is
    `sum over types of (max within type)`, not a flat sum. Every contribution must be
    **classified by bonus type** before assembly.
  - These are two different rules with one shared requirement: **contributions must be
    classified before the fold**. Decide whether bonus type / crit-eligibility is a
    property of the contribution or a structural level in the tree.

- **min/max nodes mislead the outline.** When Finesse picks Str over Dex, the renderer
  still prints the entire losing Dex subtree as a child; the reader sees two contributions
  and a total matching neither sum. Everything *considered* looks identical to everything
  *applied*. This is a **presentation issue, not a logic issue** — deferred, but noted.

- **Routing is unsolved here (by design).** How a status affecting Dex finds the Dex tree,
  how a shield feat lands under the shield, how a damage contribution knows its
  crit-eligibility group — this is the horizontal "which node does this contribution
  belong to?" problem. The composition model above deliberately assumes it is already
  solved. It is tracked separately.
