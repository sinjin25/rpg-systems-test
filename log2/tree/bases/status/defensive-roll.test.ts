import { describe, test, expect } from 'vitest'
import defensiveRoll from './defensive-roll'
import { createDefaultOwner } from '../../../defaults'
import { findNodeMatching } from '../../../'
import { setSeed, clearSeed } from '../../../../../roll'

// LAYER: defensive-roll (a status definition). Its damage-taken-status-mod producer returns a node whose
// total is -(1d4) - a frozen die (resolved once) negated so it REDUCES incoming damage.

describe('defensive-roll', () => {
    test('registers a negated 1d4 in [-4, -1]', () => {
        setSeed(42)
        try {
            const node = defensiveRoll.broadContexts['damage-taken-status-mod']!(createDefaultOwner({}))!
            expect(node.total()).toBeGreaterThanOrEqual(-4)
            expect(node.total()).toBeLessThanOrEqual(-1)
        } finally {
            clearSeed()
        }
    })

    test('the die is frozen: total is stable across reads', () => {
        setSeed(7)
        try {
            const node = defensiveRoll.broadContexts['damage-taken-status-mod']!(createDefaultOwner({}))!
            const first = node.total()
            expect(node.total()).toBe(first)
            // the 1d4 shows as a positive child under a negative-total node
            expect(findNodeMatching(node, /d4/i)?.total()).toBe(-first)
        } finally {
            clearSeed()
        }
    })
})
