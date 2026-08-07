import { describe, test, expect, assert } from 'vitest'
import maximumHealth from './maximum-health'
import { createDefaultOwner } from '../../actor2'
import { leaf, findNodeMatching } from '..'
import { ObjectWithBroadContexts } from '../types'
import { fakeCharacterLevels } from '../../character-sheet/util'

describe('maximum-health (terminal)', () => {
    test('level 1: base 20 + (10 + con mod) per level', () => {
        // con 14 -> +2, so 20 + 12 * 1
        expect(maximumHealth(createDefaultOwner({ cs: { con: 14 } })).total()).toBe(32)
    })

    test('per-level health multiplies by character level', () => {
        const node = maximumHealth(createDefaultOwner({
            cs: { con: 14, levels: fakeCharacterLevels(5) },
        }))
        // 20 + 12 * 5
        expect(node.total()).toBe(80)
        assert.exists(findNodeMatching(node, /health-from-levels/))
    })

    test('flat health is added once, not per level', () => {
        const toughness: ObjectWithBroadContexts = {
            displayName: 'toughness',
            broadContexts: { 'health-feat-mod': () => leaf('toughness', 3) },
        }
        const node = maximumHealth(createDefaultOwner({
            cs: { con: 14, levels: fakeCharacterLevels(5) },
            fs: { toughness },
        }))
        // 80 from the level case + 3 flat
        expect(node.total()).toBe(83)
    })
})
