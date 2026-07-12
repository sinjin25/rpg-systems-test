import { describe, test, assert } from 'vitest'
import { createEquipment } from './create-equipment.ts'
import calculateEquipmentMod from './equipment-mod.ts'
import roll, { setSeed, clearSeed } from '../roll/index.ts'
import { critAmulet, daggerPlusOne } from '../defaults/equipment/index.ts'
import { equipmentIsWeapon } from './index.ts'
import { createDefaultOwner } from '../defaults/index.ts'
import { critRangeModifierFactory, critMultiplierModifierFactory } from '../crit2/index.ts'

describe('enhancement', () => {
    test('expands to attack and damage mods that always apply', () => {
        const sword = createEquipment({
            displayName: '+2 sword',
            contexts: ['melee'],
            damage: () => roll(6),
            enhancement: 2,
        })

        assert.equal(calculateEquipmentMod([sword], {}, [], 'attack').total, 2)
        assert.equal(calculateEquipmentMod([sword], {}, [], 'damage').total, 2)
        assert.equal(calculateEquipmentMod([sword], {}, ['ranged', 'magic'], 'attack').total, 2)
        // enhancement does not leak into other broad contexts
        assert.equal(calculateEquipmentMod([sword], {}, [], 'save').total, 0)

        // the enhancement source is named after its bonus
        assert.deepEqual(calculateEquipmentMod([sword], {}, [], 'attack').entries, [
            { displayName: 'enhancement +2', amount: 2 },
        ])
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
        assert.equal(calculateEquipmentMod([sword], {}, ['finesse'], 'attack').total, 2)
        // only the enhancement when it does not
        assert.equal(calculateEquipmentMod([sword], {}, [], 'attack').total, 1)
        assert.equal(calculateEquipmentMod([sword], {}, ['finesse'], 'damage').total, 1)

        // explicit mods are named after the item; enhancement separately
        assert.deepEqual(calculateEquipmentMod([sword], {}, ['finesse'], 'attack').entries, [
            { displayName: '+1 finesse-attuned sword', amount: 1 },
            { displayName: 'enhancement +1', amount: 1 },
        ])
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

describe('crit range and multiplier', () => {
    test('No crit fields defaults to 20/x1.5', () => {
        const equip = createEquipment({
            displayName: 'default crit weapon',
            contexts: ['melee'],
            damage: () => roll(6),
        })

        assert.equal(equipmentIsWeapon(equip), true)
        if (!equipmentIsWeapon(equip)) return
        assert.equal(equip.critRange, 20)
        assert.equal(equip.critMultiplier, 1.5)
    })

    test('a weapon can declare its own threat range and multiplier (e.g. a keen rapier)', () => {
        const keenRapier = createEquipment({
            displayName: 'keen rapier',
            contexts: ['finesse', 'melee'],
            damage: () => roll(6),
            critRange: 18,
            critMultiplier: 2,
        })

        assert.equal(equipmentIsWeapon(keenRapier), true)
        if (!equipmentIsWeapon(keenRapier)) return
        assert.equal(keenRapier.critRange, 18)
        assert.equal(keenRapier.critMultiplier, 2)
    })

    test('Ensure other equipment is not getting crit fields', () => {
        const shield = createEquipment({
            displayName: 'shield',
            contexts: [],
            ac: 2,
        })

        assert.notProperty(shield, 'critRange')
        assert.notProperty(shield, 'critMultiplier')
    })

    test('non-weapon equipment can widen threat range and boost the multiplier via mods', () => {
        const bareOwner = createDefaultOwner({ es: { mainhand: daggerPlusOne } })
        const bareRange = critRangeModifierFactory({ ...bareOwner, weapon: daggerPlusOne })()
        const bareMultiplier = critMultiplierModifierFactory({ ...bareOwner, weapon: daggerPlusOne })()
        // daggerPlusOne declares no crit fields of its own, so it's the 20/x1.5 default
        assert.equal(bareRange.total, 20)
        assert.equal(bareMultiplier.total, 1.5)

        const amuletOwner = createDefaultOwner({ es: { mainhand: daggerPlusOne, amulet: critAmulet } })
        const amuletRange = critRangeModifierFactory({ ...amuletOwner, weapon: daggerPlusOne })()
        const amuletMultiplier = critMultiplierModifierFactory({ ...amuletOwner, weapon: daggerPlusOne })()
        // widened by 1 (20 -> 19) and boosted by 0.5 (1.5 -> 2)
        assert.equal(amuletRange.total, 19)
        assert.equal(amuletMultiplier.total, 2)
    })
})
