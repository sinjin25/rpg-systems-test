import { describe, test, expect, assert } from 'vitest'
import critThreatRangeMod from './crit-threat-range-mod'
import { createDefaultOwner } from '../../actor2'
import improvedCritical from '../../feat2/feats/improved-critical'
import dodge from '../../feat2/feats/dodge'
import modNodeToText from '../format'
import { findNodeMatching } from '..'

describe('crit-threat-range-mod (native)', () => {
    test('improved-critical contributes a summed -1 child leaf', () => {
        const node = critThreatRangeMod(createDefaultOwner({
            fs: { improvedCritical },
        }))
        expect(node.total()).toBe(-1)
        /* console.log(modNodeToText(node)) */
        const find = findNodeMatching(node, /improved critical/i)
        assert.exists(find)
    })

    test('no feats -> 0, no children', () => {
        const node = critThreatRangeMod(createDefaultOwner({}))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })

    test('a non crit-threat-range feat does not leak into the mod', () => {
        const node = critThreatRangeMod(createDefaultOwner({ fs: { dodge } }))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })
})
