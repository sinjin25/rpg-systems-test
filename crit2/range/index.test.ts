import { describe, test, assert } from 'vitest'
import { critRangeModifierFactory } from './index.ts'
import { createDefaultOwner } from '../../defaults/index.ts'
import { createEquipment } from '../../equipment-sheet/create-equipment.ts'
import { standardFilters } from '../../feat/core-types.ts'
import { equipmentIsWeapon } from '../../equipment-sheet/index.ts'
import roll from '../../roll/index.ts'

describe('critRangeModifierFactory', () => {
    test('defaults to a 20 threat range when nothing mods it', () => {
        const owner = createDefaultOwner({})
        if (!equipmentIsWeapon(owner.es.mainhand!)) throw new Error('expected a weapon')

        const result = critRangeModifierFactory({ ...owner, weapon: owner.es.mainhand })()
        assert.equal(result.total, 20)
        assert.deepEqual(result.groups.map(g => g.displayName), ['base mod', 'feat mod', 'equipment mod', 'status mod'])
        assert.deepEqual(result.groups[0].entries, [{ displayName: 'weapon base', amount: 20 }])
    })

    test('a weapon can define its own base threat range (e.g. a keen rapier)', () => {
        const keenRapier = createEquipment({
            displayName: 'keen rapier',
            contexts: ['finesse', 'melee'],
            damage: () => roll(6),
            critRange: 18,
        })
        if (!equipmentIsWeapon(keenRapier)) throw new Error('expected a weapon')

        const owner = createDefaultOwner({ es: { mainhand: keenRapier } })
        const result = critRangeModifierFactory({ ...owner, weapon: keenRapier })()
        assert.equal(result.total, 18)
    })

    test('a feat can widen the threat range (e.g. Improved Critical)', () => {
        const wideningFeat = {
            featWideningTest: {
                displayName: 'Widening Test',
                context: {
                    critRange: {
                        applies: standardFilters.noBlacklistAnyWhitelistFactory({ whitelist: ['all'], blacklist: [] }),
                        // negative shrinks the threshold number, which widens the range
                        mod: () => -1,
                    },
                },
            },
        }

        const owner = createDefaultOwner({ fs: wideningFeat as any })
        if (!equipmentIsWeapon(owner.es.mainhand!)) throw new Error('expected a weapon')

        const result = critRangeModifierFactory({ ...owner, weapon: owner.es.mainhand })()
        // base 20, widened by 1 -> threatens on 19 or 20
        assert.equal(result.total, 19)
    })

    test('a mod that does not apply to the active context is ignored', () => {
        const rangedOnlyFeat = {
            featRangedOnly: {
                displayName: 'Ranged Only',
                context: {
                    critRange: {
                        applies: standardFilters.noBlacklistAnyWhitelistFactory({ whitelist: ['ranged'], blacklist: [] }),
                        mod: () => 1,
                    },
                },
            },
        }

        const owner = createDefaultOwner({ fs: rangedOnlyFeat as any })
        if (!equipmentIsWeapon(owner.es.mainhand!)) throw new Error('expected a weapon')

        // mainhand (shortsword) is a melee weapon, not ranged, so the mod shouldn't apply
        const result = critRangeModifierFactory({ ...owner, weapon: owner.es.mainhand })()
        assert.equal(result.total, 20)
    })

    test('reports a base/feat/equipment/status mod breakdown, like the attack/damage factories', () => {
        const owner = createDefaultOwner({})
        if (!equipmentIsWeapon(owner.es.mainhand!)) throw new Error('expected a weapon')

        const result = critRangeModifierFactory({ ...owner, weapon: owner.es.mainhand })()
        const total = result.groups.reduce((acc, g) => acc + g.total, 0)
        assert.equal(total, result.total)
    })
})
