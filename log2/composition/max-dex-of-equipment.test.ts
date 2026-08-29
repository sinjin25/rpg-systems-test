import { describe, test, expect, assert } from 'vitest'
import maxDexOfEquipment from './max-dex-of-equipment'
import flatFooted from '../../status-sheet2/status/flat-footed'
import { makeWrapper } from '../../status-sheet2'
import { inst } from '../../status-sheet2/testing'
import modNodeToText from '../format'
import { armors, heavyShield, SLOT_TYPE } from '../../equipment-sheet2/defaults'
import { createDefaultOwner } from '../../actor2'
import { OwnerLog2 } from '../types'
import { findNodeMatching, leaf } from '..'

const owner = createDefaultOwner({
    es: {
        armor: armors['banded mail'], offhand: {
            displayName: 'super-heavy-shield',
            acceptableSlots: SLOT_TYPE.shield,
            broadContexts: {
                'max-dex-of-equipment': (o: OwnerLog2) => {
                    return leaf('super-heavy-shield', 0)
                }
            }
        }
    }
})

describe('max-dex-of-equipment', () => {
    test('No max dex equipment returns undefined', () => {
        const owner = createDefaultOwner()
        const node = maxDexOfEquipment(owner)
        assert.notExists(node)
    })
    test('Reports max dex of equipment, taking the floor', () => {
        const node = maxDexOfEquipment(owner)!
        assert.equal(node.total(), 0)
        assert.exists(node)

        const f0 = findNodeMatching(node, /max-dex-of-equipment$/, {
            includeRoot: true,
        })
        assert.exists(f0)

        const f1 = findNodeMatching(node, /super-heavy/)
        const f2 = findNodeMatching(node, /banded mail/)

        assert.exists(f1)
        assert.equal(f1.total(), 0)
        assert.exists(f2)
        assert.equal(f2.total(), 1)
    })
})

describe('Works with flat-footed status', () => {
    test('Flat-footed hijacks and returns 0', () => {
        const owner = createDefaultOwner({
            es: {
                armor: armors['banded mail']
            },
            ss: {
                flatFooted: [inst(makeWrapper({
                    displayName: 'flat-footed',
                    broadContexts: {},
                }))]
            }
        })
        const node = maxDexOfEquipment(owner)!
        assert.equal(node.total(), 0)
        assert.exists(node)

        // still returns the original items
        const f0 = findNodeMatching(node, /flat-footed/)
        assert.exists(f0)
        assert.equal(f0.total(), 0)

        const f1 = findNodeMatching(node, /banded mail/)
        assert.exists(f1)
        assert.equal(f1.total(), 1)
    })
})
