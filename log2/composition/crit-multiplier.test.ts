import { describe, test, expect, assert } from 'vitest'
import critMultiplier from './crit-multiplier'
import { createDefaultOwner } from '../defaults'
import { OwnerMaximal, ObjectWithBroadContexts } from '../types'
import { leaf, findNodeMatching } from '..'
import { BaseEquipment } from '../../equipment-sheet2/types'

const weapon = (crit: number): BaseEquipment =>
({
    displayName: 'test-weapon', tags: ['melee'], broadContexts: {
        'damage': () => {
            const r = 4
            return leaf('test-weapon', r)
        },
        'crit-multiplier': () => {
            return leaf('test-weapon', crit)
        }
    }
})

describe('crit-multiplier', () => {
    const owner = createDefaultOwner({
        es: {
            mainhand: weapon(2)
        }
    })
    owner.relevantSlot = owner.es.mainhand
    test('uses the weapon base multiplier', () => {
        const node = critMultiplier(owner)
        expect(node.total()).toBe(2)
        expect(findNodeMatching(node, /test-weapon/i)?.total()).toBe(2)
    })

    test('adds feat increments on top of the base', () => {
        const owner = createDefaultOwner({
            es: {
                mainhand: weapon(2)
            },
            fs: {
                // @ts-expect-error
                'crit-plus': {
                    broadContexts: {
                        'crit-multiplier-mod': () => leaf('crit-plus', 2)
                    }
                }
            },
        })
        owner.relevantSlot = owner.es.mainhand
        const node = critMultiplier(owner)
        expect(node.total()).toBe(4)

        const critPlusNode = findNodeMatching(node, /crit-plus/)
        assert.exists(critPlusNode)
        expect(critPlusNode.total()).toEqual(2)

        const critFeatModNode = findNodeMatching(node, /crit-multiplier-mod/)
        assert.exists(critFeatModNode)
        expect(critFeatModNode.children.length).toEqual(1)
    })

    test('throws when relevantSlot is not a weapon', () => {
        /* expect(() => critMultiplier(withSlot(createDefaultOwner({}), leatherArmor))).toThrow(/relevantSlot/) */
    })
})
