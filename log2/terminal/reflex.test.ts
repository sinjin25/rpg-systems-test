import { describe, test, expect } from 'vitest'
import reflex from './reflex'
import { createDefaultOwner } from '../../actor2'
import { findNodeMatching } from '..'
import { ClassLevels, ClassLevelMember } from '../../character-sheet/class-level/type'

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
            'base-reflex', 'modded-dex', 'reflex-feat-mod', 'reflex-status-mod', 'reflex-equipment-mod',
        ])
    })

    test('uses the uncapped dex modifier (no armor max-dex cap on saves)', () => {
        const node = reflex(createDefaultOwner({ cs: { dex: 20, levels: {} } }))
        expect(findNodeMatching(node, 'modded-dex')?.total()).toBe(5)
    })
})
