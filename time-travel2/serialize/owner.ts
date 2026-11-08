import type { OwnerMaximal } from "../../actor2/types"
import { EquipmentSheet } from "../../equipment-sheet2/types"
import { blueprintToBaseEquipment } from "../../equipment-sheet2/factory/broad-context-adapter"
import { AbilityCatalog } from "../../ability-sheet2/types"
import { snapshotStatusSheet } from "./status-effect-instance"
import { serializeFeatSheet, deserializeFeatSheet } from "./feat-sheet"
import { serializeAbilitySheet, deserializeAbilitySheet } from "./ability-sheet"
import type { FrozenEquipmentSheet, OwnerMaximalSnapshot } from "./types"
import { enemyFeatRegistry } from "../../enemy/goblin/feats"

export const freezeEquipmentSheet = (es: EquipmentSheet): FrozenEquipmentSheet =>
    Object.fromEntries(
        Object.entries(es)
            .filter(([, be]) => be?.blueprint)
            .map(([slot, be]) => [slot, be!.blueprint])
    ) as FrozenEquipmentSheet

// serialize only stores blueprints
// therefore we need to reserialize them to be functioning BaseEquipment
// if blueprints are modifiable, we need to serialize them better as well (structured clone)
export const deserializeEquipmentSheet = (es: FrozenEquipmentSheet): EquipmentSheet =>
    Object.fromEntries(
        Object.entries(es).map(([slot, blueprint]) => [
            slot,
            blueprintToBaseEquipment(blueprint, blueprint.base?.name || 'item'),
        ])
    ) as EquipmentSheet

// cs, fs and as all get mutated in place elsewhere (present-options.ts pushes onto cs.levels;
// addFeat/present-options write into fs directly; addAbility writes into as directly), so a bare
// reference to any of them would let a later level-up retroactively change what this snapshot
// looks like. cs is plain data, so a structuredClone is enough; fs/as hold live pointers to
// catalog values with functions (Feat2/AnyAbilitySheetDefinition), so they go through
// serialize/deserialize{FeatSheet,AbilitySheet} instead to rebuild a fresh dict of the same
// catalog values.
//
// abilityCatalogFallback is for callers whose live ability catalog isn't the rpg-tests test
// registry (e.g. rpg-content's full content ability registry) — threaded down to
// deserializeAbilitySheet the same way enemyFeatRegistry is threaded for feat-sheet.
const snapshotOwner = (owner: OwnerMaximal, abilityCatalogFallback?: AbilityCatalog): OwnerMaximalSnapshot => ({
    // frozen independently of the live cs (see comment above)
    cs: structuredClone(owner.cs),
    // pure blueprint data — no live reference left to alias or mutate
    es: freezeEquipmentSheet(owner.es),
    // frozen independently of the live fs (see comment above)
    fs: deserializeFeatSheet(serializeFeatSheet(owner.fs), enemyFeatRegistry),
    rewardId: owner.rewardId,
    // frozen independently of the live as (see comment above)
    as: deserializeAbilitySheet(serializeAbilitySheet(owner.as), abilityCatalogFallback),
    tags: [...owner.tags],
    experience: { ...owner.experience },
    ss: snapshotStatusSheet(owner.ss),
})

export const deserializeOwnerSnapshot = (snap: OwnerMaximalSnapshot): OwnerMaximal => ({
    ...snap,
    es: deserializeEquipmentSheet(snap.es),
})

export default snapshotOwner
