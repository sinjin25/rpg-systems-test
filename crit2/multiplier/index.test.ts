import { describe, test, assert } from 'vitest'
import { critMultiplierModifierFactory } from './index.ts'
import { createDefaultOwner } from '../../defaults/index.ts'
import { createEquipment } from '../../equipment-sheet/create-equipment.ts'
import { standardFilters } from '../../feat/core-types.ts'
import { equipmentIsWeapon } from '../../equipment-sheet/index.ts'
import roll from '../../roll/index.ts'

describe('critMultiplierModifierFactory', () => {
    test('defaults to a x1.5 multiplier when nothing mods it', () => {
        const owner = createDefaultOwner({})
        if (!equipmentIsWeapon(owner.es.mainhand!)) throw new Error('expected a weapon')

        const result = critMultiplierModifierFactory({ ...owner, weapon: owner.es.mainhand })()
        assert.equal(result.total, 1.5)
        assert.deepEqual(result.groups.map(g => g.displayName), ['base mod', 'feat mod', 'equipment mod', 'status mod'])
        assert.deepEqual(result.groups[0].entries, [{ displayName: 'weapon base', amount: 1.5 }])
    })

    test('a weapon can define its own base multiplier (e.g. a greatsword)', () => {
        const twoHander = createEquipment({
            displayName: 'greatsword',
            contexts: ['melee'],
            damage: () => roll(6),
            critMultiplier: 2,
        })
        if (!equipmentIsWeapon(twoHander)) throw new Error('expected a weapon')

        const owner = createDefaultOwner({ es: { mainhand: twoHander } })
        const result = critMultiplierModifierFactory({ ...owner, weapon: twoHander })()
        assert.equal(result.total, 2)
    })

    test('a feat or weapon property can increase the crit multiplier (e.g. x2 -> x3)', () => {
        const multiplierFeat = {
            featMultiplierTest: {
                displayName: 'Multiplier Test',
                context: {
                    critMultiplier: {
                        applies: standardFilters.noBlacklistAnyWhitelistFactory({ whitelist: ['all'], blacklist: [] }),
                        mod: () => 1,
                    },
                },
            },
        }

        const twoHander = createEquipment({
            displayName: 'greatsword',
            contexts: ['melee'],
            damage: () => roll(6),
            critMultiplier: 2,
        })
        if (!equipmentIsWeapon(twoHander)) throw new Error('expected a weapon')

        const owner = createDefaultOwner({ fs: multiplierFeat as any })
        const result = critMultiplierModifierFactory({ ...owner, weapon: twoHander })()
        assert.equal(result.total, 3)
    })

    test('a mod that does not apply to the active context is ignored', () => {
        const rangedOnlyFeat = {
            featRangedOnly: {
                displayName: 'Ranged Only',
                context: {
                    critMultiplier: {
                        applies: standardFilters.noBlacklistAnyWhitelistFactory({ whitelist: ['ranged'], blacklist: [] }),
                        mod: () => 1,
                    },
                },
            },
        }

        const owner = createDefaultOwner({ fs: rangedOnlyFeat as any })
        if (!equipmentIsWeapon(owner.es.mainhand!)) throw new Error('expected a weapon')

        const result = critMultiplierModifierFactory({ ...owner, weapon: owner.es.mainhand })()
        assert.equal(result.total, 1.5)
    })
})
