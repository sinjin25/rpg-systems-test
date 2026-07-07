import { describe, test, assert } from 'vitest'
import { calculateWeaponEquipmentMod } from './equipment-mod.ts'
import { createEquipment } from '../equipment-sheet/create-equipment.ts'
import { EquipmentSheet, Weapon } from '../equipment-sheet/index.ts'
import { defaultCharacterSheet } from '../character-sheet/index.ts'
import { defaultFeatSheet } from '../feat/index.ts'
import { RingPlusOneFinesseAttack } from '../defaults/equipment/index.ts'
import roll from '../roll/index.ts'

describe('calculateWeaponEquipmentMod', () => {
    const mainhand = createEquipment({
        displayName: '+1 dagger',
        contexts: ['finesse', 'dagger', 'melee'],
        damage: () => roll(4),
        enhancement: 1,
    }) as Weapon
    const offhand = createEquipment({
        displayName: '+2 shortsword',
        contexts: ['shortsword', 'melee'],
        damage: () => roll(6),
        enhancement: 2,
    }) as Weapon

    const es: EquipmentSheet = {
        mainhand,
        offhand,
        ring: RingPlusOneFinesseAttack,
    }

    const run = (weapon: Weapon, contexts: Parameters<typeof calculateWeaponEquipmentMod>[1]) =>
        calculateWeaponEquipmentMod({
            characterSheet: defaultCharacterSheet,
            featSheet: defaultFeatSheet,
            equipmentSheet: es,
            weapon,
        }, contexts, 'attack')

    test('counts non-weapon equipment plus only the wielded weapon', () => {
        // ring(1, finesse applies) + mainhand enhancement(1); the offhand's +2 is excluded
        assert.equal(run(mainhand, ['finesse']).total, 2)
        // ring(1) + offhand enhancement(2); the mainhand's +1 is excluded
        assert.equal(run(offhand, ['finesse']).total, 3)
    })

    test('non-weapon equipment still filters by context', () => {
        // the finesse ring does not apply without the finesse context; enhancement always does
        assert.equal(run(mainhand, []).total, 1)
        assert.equal(run(offhand, ['melee']).total, 2)
    })

    test('names each contributing source', () => {
        const result = run(mainhand, ['finesse'])
        assert.deepEqual(result.entries, [
            { displayName: RingPlusOneFinesseAttack.displayName, amount: 1 },
            { displayName: 'enhancement +1', amount: 1 },
        ])
    })
})
