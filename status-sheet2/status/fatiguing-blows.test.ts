import { describe, test, expect, assert } from 'vitest'
import fatiguingBlows from './fatiguing-blows'
import attackStatusMod from '../../log2/composition/attack-status-mod'
import { createDefaultOwner } from '../../actor2'
import { findNodeMatching } from '../../log2'
import { inst } from '../testing'

describe('fatiguing-blows', () => {
    test('registers a -1 attack-status-mod contribution', () => {
        const contribution = fatiguingBlows.broadContexts['attack-status-mod']!
        expect(contribution(createDefaultOwner({}))!.total()).toBe(-1)
    })

    test('folds into attack-status-mod when on the sheet', () => {
        const node = attackStatusMod(createDefaultOwner({ ss: { fatiguingBlows: [inst(fatiguingBlows)] } }))
        expect(node.total()).toBe(-1)
        const f0 = findNodeMatching(node, /fatig/i)
        assert.exists(f0)
        assert.equal(f0.total(), -1)
    })
})
