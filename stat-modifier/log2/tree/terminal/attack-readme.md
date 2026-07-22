# Attack — faked / bridged systems to replace

The attack tree is being built child by child. Several pieces are **not solved natively in log2
yet** — they lean on the old (legacy) calculators or on a stand-in input. Everything listed here
works today but is a bridge and needs a real log2 replacement eventually.

## Native now: feats

`attack-feat-mod` is **no longer a bridge**. Feats route natively, exactly the way statuses do
(cats-grace → `dex-from-status`): a feat is a `FeatMaximal` declaring an `attack-feat-mod`
contribution, and the node collects them off `owner.fs` via `collectFeatContributions`
(`../../collect-feat-contributions.ts`). Each feat gates itself on the weapon tags (`tree/feats/gate.ts`),
returning a leaf when it applies and `undefined` when it doesn't (the collector drops those, so a
gated-out feat leaves no leaf in the outline) — the node just sums what's left. The legacy
`calculateFeatMod` / `modResultToNode` path for feats is retired. The same `ac-feat-mod` node now feeds
AC (Dodgy, Shield/Heavy Armor Mastery).

## The remaining bridge (legacy context-tag engine)

This node still calls the legacy `applyContextMod` machinery and wraps the result with
`modResultToNode` (in `../../collect-status-contributions.ts`). It inherits the old
whitelist/blacklist tag filtering wholesale instead of routing contributions natively.
(`attack-status-mod` used to be here too; it is native now — statuses declare an `attack-status-mod`
contribution and gate themselves via `../feats/gate.ts`, exactly like `attack-feat-mod`.)

| node | file | bridges to |
| --- | --- | --- |
| `attack-equipment-mod` | `../composition/attack-equipment-mod.ts` | `roll-modifier/equipment-mod.ts` → `calculateWeaponEquipmentMod` |

Shared bridge helper: `modResultToNode` — flattens a legacy `ModResult` (one entry per applying
source) into a `sumFunc` node of leaves. It drops any nested `detail` a `ModLogMember` carried, so
the log2 outline is one level shallower than the legacy breakdown.

## The weapon fake

There is no real "weapon in hand" plumbing. Every node that needs the weapon reads
**`owner.es.mainhand`** as a stand-in:

- `../composition/effective-attack-stat.ts` (finesse tag → dex vs str)
- `tree/feats/gate.ts` (native feats read the weapon tags to gate themselves)
- both remaining bridged mods above (weapon tags drive the context filtering)

Replacing this means introducing an actual chosen-weapon input and swapping `owner.es.mainhand`
for it in one place per node.

## Known legacy fragility (not ours to fix here, but it will bite)

`calculateWeaponEquipmentMod` does `Object.values(es).filter(equipmentIsWeapon)`, and
`equipmentIsWeapon` throws on an `undefined` value (`'damage' in undefined`). A truly unarmed
attacker represented as `mainhand: undefined` crashes it. We currently sidestep this by assuming a
mainhand is always present.

## When these are replaced

The native log2 direction (see `DESIGN.md` "routing"): statuses/equipment declare the destination
node they feed via `broadContexts`, plus a way to express tag conditions natively — exactly what
feats now do (`collect-feat-contributions.ts` + `tree/feats/`). Once statuses and equipment follow,
these remaining bridges and the `modResultToNode` helper can be deleted, exactly like the
legacy `StatusEffect` cast bridge in `collect-status-contributions.ts` will go.
