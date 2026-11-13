import { createDefaultOwner } from "../../actor2"
import { Feat2 } from "../../feat2/types"
import { addAbility } from "../../ability-sheet2/index"
import { AbilitySheetDefinition } from "../../ability-sheet2/abilities2/types"
import { BaseEquipment } from "../../equipment-sheet2/types"
import snapshotOwner, { deserializeOwnerSnapshot } from "./owner"
import { serializeFeatSheet, deserializeFeatSheet } from "./feat-sheet"
import { serializeAbilitySheet, deserializeAbilitySheet } from "./ability-sheet"
import { describe, test, assert, expect } from 'vitest'
import _verifyOwnerIsClone from "../../class-level2/level-up2/clone"
import addFeat from "../../feat2/add-feat/index"
import ambush from "../../feat2/feats/enemy/ambush"

// this covers leveling up where you can modify a clone of the owner (rather than the owner iteself)
// data layer -> level up info -> clone the owner for the display layer -> modify copy -> send back in
describe('Integration: _verifyOwnerIsClone', () => {
    test('time-travel module is safe', () => {
        const o = createDefaultOwner({})

        // NOT OKAY
        const snapshot = snapshotOwner(o)

        const deserializedSnapshot = deserializeOwnerSnapshot(snapshot)
        assert.equal(
            _verifyOwnerIsClone({
                clone: deserializedSnapshot,
                original: o,
            }),
            true
        )
    })
})

describe('Behavior', () => {
    test('test feats: not kept because it doesnt forward a relevant fallback', () => {
        const bunkFeat: Feat2 = {
            id: 'random',
            hidden: false,
            displayName: 'Random',
            broadContexts: {},
        }
        const owner = createDefaultOwner({ fs: { [bunkFeat.displayName]: bunkFeat } })

        // deserializeFeatSheet falls back to the original feat sheet's pointer
        // which isn't necessarily an issue
        const snap = snapshotOwner(owner)
        const deserialized = deserializeOwnerSnapshot(snap)
        assert.equal(Object.keys(deserialized.fs).length, 0)

        // if no fallback provided to deserialize, feat is lost
        const ids = serializeFeatSheet(owner.fs)
        const rehydrated = deserializeFeatSheet(ids, {})

        assert.isUndefined(rehydrated[bunkFeat.displayName])
    })

    test('ability: lost once there is no live sheet to fall back to', () => {
        const bunkAbility: AbilitySheetDefinition = {
            castType: 'standard',
            displayName: 'Hand-Typed Bunk Ability',
            factory: () => ({ steps: [] }),
        }
        const owner = createDefaultOwner()
        addAbility(owner, bunkAbility)

        const frozen = serializeAbilitySheet(owner.as)
        const rehydrated = deserializeAbilitySheet(frozen)
        // LANDMINE: the ability is gone, not reconstructed, because it was never in abilities/registry
        // and no fallback catalog was forwarded
        assert.isUndefined(rehydrated.standard.items[bunkAbility.displayName])
    })

    test('equipment: dropped on serialize even in-process, since it has no .blueprint', () => {
        const bunkSword: BaseEquipment = {
            displayName: 'Hand-Typed Bunk Sword',
            acceptableSlots: ['mainhand'],
            broadContexts: {},
            // no blueprint - this is the landmine condition; equipment not built via the factory
        }
        const owner = createDefaultOwner({ es: { mainhand: bunkSword } })

        const snap = snapshotOwner(owner)
        // LANDMINE: dropped before deserialize even runs, filtered out by freezeEquipmentSheet
        assert.isUndefined(snap.es.mainhand)

        const deserialized = deserializeOwnerSnapshot(snap)
        assert.isUndefined(deserialized.es.mainhand) // the equipped item vanished entirely
    })
})
