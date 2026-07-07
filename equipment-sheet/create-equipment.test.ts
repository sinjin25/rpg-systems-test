import { describe, test, assert } from 'vitest'
import { createEquipment } from './create-equipment.ts'
import calculateEquipmentMod from './equipment-mod.ts'
import roll, { setSeed, clearSeed } from '../roll/index.ts'
import { daggerPlusOne } from '../defaults/equipment/index.ts'
import { equipmentIsWeapon } from './index.ts'

describe('enhancement', () => {
    test('expands to attack and damage mods that always apply', () => {
        const sword = createEquipment({
            displayName: '+2 sword',
            contexts: ['melee'],
            damage: () => roll(6),
            enhancement: 2,
        })

        assert.equal(calculateEquipmentMod([sword], {}, [], 'attack'), 2)
        assert.equal(calculateEquipmentMod([sword], {}, [], 'damage'), 2)
        assert.equal(calculateEquipmentMod([sword], {}, ['ranged', 'magic'], 'attack'), 2)
        // enhancement does not leak into other broad contexts
        assert.equal(calculateEquipmentMod([sword], {}, [], 'save'), 0)
    })

    test('stacks with explicit mods on the same item', () => {
        const sword = createEquipment({
            displayName: '+1 finesse-attuned sword',
            contexts: ['melee'],
            damage: () => roll(6),
            enhancement: 1,
            mods: {
                attack: { whitelist: ['finesse'], mod: 1 },
            },
        })

        // enhancement + explicit mod when the context matches
        assert.equal(calculateEquipmentMod([sword], {}, ['finesse'], 'attack'), 2)
        // only the enhancement when it does not
        assert.equal(calculateEquipmentMod([sword], {}, [], 'attack'), 1)
        assert.equal(calculateEquipmentMod([sword], {}, ['finesse'], 'damage'), 1)
    })

    test('the damage roll stays pure base dice', () => {
        assert.equal(equipmentIsWeapon(daggerPlusOne), true)
        if (!equipmentIsWeapon(daggerPlusOne)) return

        setSeed(12345)
        for (let i = 0; i < 100; i++) {
            const result = daggerPlusOne.damage!()
            assert.equal(result >= 1 && result <= 4, true)
        }
        clearSeed()
    })
})
