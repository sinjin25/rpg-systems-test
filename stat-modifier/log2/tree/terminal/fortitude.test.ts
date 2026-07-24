import { describe, test, expect } from 'vitest'
import fortitude from './fortitude'
import { createDefaultOwner } from '../../defaults'
import { findNodeMatching } from '../..'
import { ClassLevels, ClassLevelMember } from '../../../../character-sheet/class-level/type'

// LAYER: fortitude terminal = base-fortitude + modded-con + save-feat-mod + save-status-mod +
// save-equipment-mod, summed (mirror of terminal/ac.ts). Trusts each child's own suite; this proves the
// five sub-problems are assembled and folded, and that fortitude reads con.

const member = (fortitudeSave: number): ClassLevelMember =>
    ({ attackBonus: 0, fortitudeSave, reflexSave: 0, feats: {} })

const klass = (displayName: string, members: ClassLevelMember[]): ClassLevels =>
    ({ displayName, level: members.length, data: members })

describe('fortitude', () => {
    test('sums class base save + con modifier + the mod buckets', () => {
        const owner = createDefaultOwner({
            cs: {
                con: 14, // +2
                levels: { fighter: klass('Fighter', [member(1), member(1), member(1)]) }, // +3
            },
        })
        // base +3, con +2, no feats/statuses/equipment saves -> +5
        expect(fortitude(owner).total()).toBe(5)
    })

    test('assembles all five sub-problems in the outline', () => {
        const node = fortitude(createDefaultOwner({}))
        expect(node.displayName).toBe('fortitude')
        expect(node.children.map(c => c.displayName)).toEqual([
            'base-fortitude', 'modded-con', 'save-feat-mod', 'save-status-mod', 'save-equipment-mod',
        ])
    })

    test('scales off con, not dex', () => {
        // con 18 (+4) with dex left at default proves the ability child is con
        const node = fortitude(createDefaultOwner({ cs: { con: 18, levels: {} } }))
        expect(findNodeMatching(node, 'modded-con')?.total()).toBe(4)
    })
})
