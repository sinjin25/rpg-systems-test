import { describe, test, expect, assert } from 'vitest'
import damage from './damage'
import { createDefaultOwner } from '../../actor2'
import roll, { setSeed, clearSeed } from '../../roll'
import newModNode, { findNodeMatching, leaf } from '..'
import modNodeToText from '../format'
import { BaseEquipment } from '../../equipment-sheet2/types'
import { SLOT_TYPE } from '../../equipment-sheet2/defaults'

const wp = (dmg: number): BaseEquipment => ({
    displayName: 'test-weapon',
    acceptableSlots: SLOT_TYPE.weapon,
    tags: ['melee'],
    broadContexts: {
        'damage': () => leaf('test-weapon', dmg)
    }
})

describe('damage (terminal)', () => {
    test('sums its two buckets: crit-scalable-damage + flat-damage', () => {
        // NOTE: CRIT-SCALABLE-DAMAGE IS SCALABLE, DOES NOT MEAN IT WAS SCALED
        const w = wp(5) // 5
        const owner = createDefaultOwner({
            cs: { str: 20, dex: 10 }, // +5
            es: {
                mainhand: w
            },
        })

        const node = damage(owner)
        const csd = findNodeMatching(node, /crit-scalable-damage/i)
        assert.exists(csd)
        const fd = findNodeMatching(node, /flat-damage/)
        assert.exists(fd)

        assert.equal(node.total(), 10)
    })

    test('Confirm a roll can be frozen across reads', () => {
        setSeed(42)
        try {
            const w: BaseEquipment = ({
                displayName: 'test-weapon',
                acceptableSlots: SLOT_TYPE.weapon,
                tags: ['melee'],
                broadContexts: {
                    'damage': () => {
                        const r = roll(4)
                        return leaf('test-weapon', r)
                    }
                }
            })
            const owner = createDefaultOwner({
                cs: { str: 10, dex: 10 }, // +5
                es: {
                    mainhand: w
                },
            })
    
            const node = damage(owner)
            const first = node.total()
            expect(first).toBeGreaterThanOrEqual(1)
            expect(first).toBeLessThanOrEqual(4)

            // would roll again if it wasn't frozen
            expect(node.total()).toBe(first)
        } finally {
            clearSeed()
        }
    })


})
