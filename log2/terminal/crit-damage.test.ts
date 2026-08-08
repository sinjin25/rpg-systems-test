import { describe, test, expect, assert } from 'vitest'
import critDamage from './crit-damage'
import { createDefaultOwner } from '../../actor2'
import { OwnerLog2, ObjectWithBroadContexts } from '../types'
import { Weapon } from '../../equipment-sheet'
import { leatherArmor } from '../../defaults/equipment'
import { leaf, findNodeMatching } from '..'
import modNodeToText from '../format'
import roll from '../../roll'
import { Feat2 } from '../../feat2'
import { BaseEquipment } from '../../equipment-sheet2/types'

const weapon = (dmg: number, crit?: number): BaseEquipment =>
({
    displayName: 'test-weapon', contexts: ['melee'], broadContexts: {
        'damage': () => {
            // use a standardized damage
            const r = dmg
            return leaf('test-weapon', r)
        },
        'crit-multiplier': () => leaf('test-weapon', crit || 1.5)
    }
} as BaseEquipment)


const flatStatOwner = (fs: OwnerLog2['fs'] = {}) =>
    createDefaultOwner({ cs: { str: 10, dex: 10 }, fs })

const scalingFeat: Feat2 = ({
    displayName: 'test-scaler',
    broadContexts: { 'crit-scalable-damage-feat-mod': () => leaf('test-scaler', 2) },
})

const flatFeat: Feat2 = {
    displayName: 'test-flat',
    broadContexts: { 'flat-damage-feat-mod': () => leaf('test-flat', 2) },
}

describe('crit-damage (terminal)', () => {
    test('weapon multiplier is picked up properly', () => {
        const w = weapon(4, 2)
        const owner = createDefaultOwner({
            cs: { str: 10, dex: 10 },
            es: {
                mainhand: w
            },
        })
        owner.relevantSlot = owner.es.mainhand
        const node = critDamage(owner)
        assert.equal(node.total(), 8)
        assert.exists(findNodeMatching(node, /crit-damage/, {
            includeRoot: true,
        }))
    })

    test('crit-scalable-damage-feat-mod contributes', () => {
        const w = weapon(4, 2)
        const owner = createDefaultOwner({
            cs: { str: 10, dex: 10 },
            es: {
                mainhand: w
            },
            fs: {
                scalingFeat,
            }
        })
        owner.relevantSlot = owner.es.mainhand
        const node = critDamage(owner)
        /* console.log(modNodeToText(node)) */
        assert.equal(node.total(), 12)
        assert.exists(findNodeMatching(node, /test-scaler/))
        assert.exists(findNodeMatching(node, /crit-scalable-damage-feat-mod/))
    })

    test('Flat mods are not scaled', () => {
        const w = weapon(4, 2)
        const owner = createDefaultOwner({
            cs: { str: 10, dex: 10 },
            es: {
                mainhand: w
            },
            fs: {
                flatFeat,
            }
        })
        owner.relevantSlot = owner.es.mainhand
        const node = critDamage(owner)
        /* console.log(modNodeToText(node)) */
        assert.equal(node.total(), 10) // 8 scaled, + 2 flat
        assert.exists(findNodeMatching(node, /test-flat/))
        assert.exists(findNodeMatching(node, /flat-damage/))
        assert.exists(findNodeMatching(node, /crit-scalable-damage-feat-mod/))
    })

    test('Rounds fractions down', () => {
        const w = weapon(5) // 5, 1.5x
        const owner = createDefaultOwner({
            cs: { str: 10, dex: 10 },
            es: {
                mainhand: w
            },
        })
        owner.relevantSlot = owner.es.mainhand
        const node = critDamage(owner)
        /* console.log(modNodeToText(node)) */
        assert.equal(node.total(), 7)
        assert.notEqual(node.total(), 7.5)
    })

    test.skip('a weapon with no explicit critMultiplier defaults to x1.5', () => {
        const w = weapon(5) // 5, 1.5x
        const owner = createDefaultOwner({
            cs: { str: 10, dex: 10 },
            es: {
                mainhand: w
            },
        })
        owner.relevantSlot = owner.es.mainhand
        const node = critDamage(owner)

        const multi = findNodeMatching(node, /crit-multiplier/)
        assert.exists(multi)
        assert.equal(multi.total(), 1.5)
    })

    test('CS score damage is multiplied', () => {
        const w = weapon(5, 2) // 5, 1.5x
        const owner = createDefaultOwner({
            cs: { str: 20, dex: 10 }, // +5
            es: {
                mainhand: w
            },
        })
        owner.relevantSlot = owner.es.mainhand
        const node = critDamage(owner)

        assert.equal(node.total(), 20)
        const csNode = findNodeMatching(node, /effective-damage-stat/)
        assert.exists(csNode)
        assert.equal(csNode.total(), 5)
    })

    test('throws when no relevantSlot is provided', () => {
        const owner = flatStatOwner()
        owner.relevantSlot = undefined
        expect(() => critDamage(owner)).toThrow(/relevant slot/i)
    })
})
