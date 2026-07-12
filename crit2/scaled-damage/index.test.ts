import { describe, test, assert } from 'vitest'
import { calculateScaledDamage } from './index.ts'
import { createDefaultOwner } from '../../defaults/index.ts'
import { equipmentIsWeapon } from '../../equipment-sheet/index.ts'
import { createEquipment } from '../../equipment-sheet/create-equipment.ts'
import { featMeleeWeaponFighting, featPowerAttack } from '../../feat/feats/index.ts'
import roll from '../../roll/index.ts'

describe('calculateScaledDamage', () => {
    test('a damage bonus with no critMultiplier entry stays flat by default (e.g. Power Attack)', () => {
        const owner = createDefaultOwner({ fs: { featPowerAttack } })
        if (!equipmentIsWeapon(owner.es.mainhand!)) throw new Error('expected a weapon')

        const split = calculateScaledDamage({ ...owner, weapon: owner.es.mainhand }, ['melee'])
        assert.equal(split.flat.total, 4)
        assert.equal(split.scaled.total, 0)
    })

    test('a damage bonus that also defines an applying critMultiplier entry scales', () => {
        const owner = createDefaultOwner({ fs: { featMeleeWeaponFighting } })
        if (!equipmentIsWeapon(owner.es.mainhand!)) throw new Error('expected a weapon')

        const split = calculateScaledDamage({ ...owner, weapon: owner.es.mainhand }, ['melee'])
        assert.equal(split.scaled.total, 1)
        assert.equal(split.flat.total, 0)
    })

    test('a source outside the active context contributes to neither bucket', () => {
        const owner = createDefaultOwner({ fs: { featPowerAttack } })
        if (!equipmentIsWeapon(owner.es.mainhand!)) throw new Error('expected a weapon')

        // featPowerAttack is melee-only; an empty context means it shouldn't apply
        const split = calculateScaledDamage({ ...owner, weapon: owner.es.mainhand }, [])
        assert.equal(split.scaled.total, 0)
        assert.equal(split.flat.total, 0)
    })

    test('a weapon enhancement bonus scales with a crit', () => {
        const sword = createEquipment({
            displayName: '+2 sword',
            contexts: ['melee'],
            damage: () => roll(6),
            enhancement: 2,
        })

        const owner = createDefaultOwner({ es: { mainhand: sword } })
        const split = calculateScaledDamage({ ...owner, weapon: sword }, ['melee'])
        assert.equal(split.scaled.total, 2)
        assert.equal(split.flat.total, 0)
    })

    test('multiple sources combine into their respective buckets', () => {
        const owner = createDefaultOwner({ fs: { featMeleeWeaponFighting, featPowerAttack } })
        if (!equipmentIsWeapon(owner.es.mainhand!)) throw new Error('expected a weapon')

        const split = calculateScaledDamage({ ...owner, weapon: owner.es.mainhand }, ['melee'])
        assert.equal(split.scaled.total, 1)
        assert.equal(split.flat.total, 4)
    })
})
