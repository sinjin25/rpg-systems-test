import { describe, test, expect, assert } from 'vitest'
import critThreatRangeMod from './crit-threat-range-mod'
import { createDefaultOwner } from '../../defaults'
import improvedCritical from '../feats/improved-critical'
import dodgy from '../feats/dodgy'
import modNodeToText from '../../format'
import { findNodeMatching } from '../..'

// LAYER: crit-threat-range-mod is native, exactly like crit-confirm-mod / crit-multiplier-mod - it sums
// every feat on owner.fs that declares a 'crit-threat-range-mod' contribution. A feat that declares a
// different broad context (or isn't on the sheet) leaves no child behind. improved-critical contributes
// a flat -1 unconditionally (negative widens the threat range).

describe('crit-threat-range-mod (native)', () => {
    test('improved-critical contributes a summed -1 child leaf', () => {
        const node = critThreatRangeMod(createDefaultOwner({
            fs: { improvedCritical },
        }))
        expect(node.total()).toBe(-1)
        console.log(modNodeToText(node))
        const find = findNodeMatching(node, /improved\-critical/i)
        assert.exists(find)
    })

    test('no feats -> 0, no children', () => {
        const node = critThreatRangeMod(createDefaultOwner({}))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })

    test('a non crit-threat-range feat does not leak into the mod', () => {
        // dodgy declares only 'ac-feat-mod', so it is filtered out here entirely (not even a 0 leaf)
        const node = critThreatRangeMod(createDefaultOwner({ fs: { dodgy } }))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })
})
