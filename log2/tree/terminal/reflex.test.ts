import { describe, test, expect } from 'vitest'
import reflex from './reflex'
import { createDefaultOwner } from '../../defaults'
import { findNodeMatching } from '../..'
import { ClassLevels, ClassLevelMember } from '../../../../character-sheet/class-level/type'

// LAYER: reflex terminal = base-reflex + modded-dex + save-feat-mod + save-status-mod +
// save-equipment-mod, summed (mirror of terminal/fortitude.ts). Critically, reflex reuses the UNCAPPED
// modded-dex - no max-dex armor cap (that is an AC-only concern; see DESIGN.md worked example).

const member = (reflexSave: number): ClassLevelMember =>
    ({ attackBonus: 0, fortitudeSave: 0, reflexSave, feats: {} })

const klass = (displayName: string, members: ClassLevelMember[]): ClassLevels =>
    ({ displayName, level: members.length, data: members })

describe('reflex', () => {
    test('sums class base save + dex modifier + the mod buckets', () => {
        const owner = createDefaultOwner({
            cs: {
                dex: 16, // +3
                levels: { rogue: klass('Rogue', [member(1), member(1)]) }, // +2
            },
        })
        // base +2, dex +3 -> +5
        expect(reflex(owner).total()).toBe(5)
    })

    test('assembles all five sub-problems in the outline', () => {
        const node = reflex(createDefaultOwner({}))
        expect(node.displayName).toBe('reflex')
        expect(node.children.map(c => c.displayName)).toEqual([
            'base-reflex', 'modded-dex', 'save-feat-mod', 'save-status-mod', 'save-equipment-mod',
        ])
    })

    test('uses the uncapped dex modifier (no armor max-dex cap on saves)', () => {
        // high dex that an armor cap would clip for AC must pass through in full for reflex
        const node = reflex(createDefaultOwner({ cs: { dex: 20, levels: {} } }))
        expect(findNodeMatching(node, 'modded-dex')?.total()).toBe(5)
    })
})
