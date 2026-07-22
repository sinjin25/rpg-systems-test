# Attack — faked / bridged systems to replace

The attack tree is being built child by child. Several pieces are **not solved natively in log2
yet** — they lean on the old (legacy) calculators or on a stand-in input. Everything listed here
works today but is a bridge and needs a real log2 replacement eventually.

## The bridges (legacy context-tag engine)

These three nodes call the legacy `applyContextMod` machinery and wrap the result with
`modResultToNode` (in `../../collect-status-contributions.ts`). They inherit the old
whitelist/blacklist tag filtering wholesale instead of routing contributions natively the way log2
statuses (cats-grace → `dex-from-status`) do.

| node | file | bridges to |
| --- | --- | --- |
| `attack-feat-mod` | `../composition/attack-feat-mod.ts` | `roll-modifier/feat-mod.ts` → `calculateFeatMod` |
| `attack-status-mod` | `../composition/attack-status-mod.ts` | `status-sheet/status-mod.ts` → `calculateStatusMod` |
| `attack-equipment-mod` | `../composition/attack-equipment-mod.ts` | `roll-modifier/equipment-mod.ts` → `calculateWeaponEquipmentMod` |

Shared bridge helper: `modResultToNode` — flattens a legacy `ModResult` (one entry per applying
source) into a `sumFunc` node of leaves. It drops any nested `detail` a `ModLogMember` carried, so
the log2 outline is one level shallower than the legacy breakdown.

## The weapon fake

There is no real "weapon in hand" plumbing. Every node that needs the weapon reads
**`owner.es.mainhand`** as a stand-in:

- `../composition/effective-attack-stat.ts` (finesse tag → dex vs str)
- all three bridged mods above (weapon tags drive the context filtering)

Replacing this means introducing an actual chosen-weapon input and swapping `owner.es.mainhand`
for it in one place per node.

## Known legacy fragility (not ours to fix here, but it will bite)

`calculateWeaponEquipmentMod` does `Object.values(es).filter(equipmentIsWeapon)`, and
`equipmentIsWeapon` throws on an `undefined` value (`'damage' in undefined`). A truly unarmed
attacker represented as `mainhand: undefined` crashes it. We currently sidestep this by assuming a
mainhand is always present.

## When these are replaced

The native log2 direction (deferred, see `DESIGN.md` "routing"): feats/statuses/equipment declare
the destination node they feed via `broadContexts`, plus a way to express tag conditions natively —
at which point these bridges and the `modResultToNode` helper can be deleted, exactly like the
legacy `StatusEffect` cast bridge in `collect-status-contributions.ts` will go.
