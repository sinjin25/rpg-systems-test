import { createDefaultOwner } from '../../actor2'
import { bastardSword, dagger, longsword } from '../../equipment-sheet2/defaults'
import proficientInEquipment from './proficient-in-equipment.ts'
import { describe, test, assert, expect } from 'vitest'

describe('proficientInEquipment', () => {
    test('needs to be passed correctly by a parent (terminal attack is reponsible)', () => {
        const owner = createDefaultOwner({
            es: {
                'mainhand': longsword,
            }
        })

        const wrongNode = proficientInEquipment(owner, {
        })
        assert.equal(wrongNode, undefined)

        const rightNode = proficientInEquipment(owner, {
            tags: [...longsword.tags ?? []]
        })
        assert.exists(rightNode)
        assert.equal(rightNode.total(), -4)

    })
    test('Martial returns undefined if martial proficiency', () => {
        const owner = createDefaultOwner({
            es: {
                'mainhand': longsword,
            },
            fs: {
                'martial proficiency': {
                    displayName: 'feat',
                    broadContexts: {},
                }
            }
        })

        const node = proficientInEquipment(owner, {
            tags: [...longsword.tags ?? []]
        })
        assert.equal(node, undefined)
    })
    test('Exotic returns undefined if Exotic proficiency', () => {
        const owner = createDefaultOwner({
            es: {
                'mainhand': bastardSword,
            },
            fs: {
                'exotic proficiency': {
                    displayName: 'feat',
                    broadContexts: {},
                }
            }
        })

        const node = proficientInEquipment(owner, {
            tags: [...bastardSword.tags ?? []]
        })
        assert.equal(node, undefined)
    })
    test('Missing the feat returns -4', () => {
        const owner = createDefaultOwner({
            es: {
                'mainhand': bastardSword,
            },
        })

        const node = proficientInEquipment(owner, {
            tags: [...bastardSword.tags ?? []]
        })
        assert.equal(node?.total(), -4)

        owner.es.mainhand = longsword

        const node2 = proficientInEquipment(owner, {
            tags: [...longsword.tags ?? []]
        })

        assert.equal(node2?.total(), -4)
    })
})