import { describe, test, expect } from 'vitest'
import baseSave from './base-save'
import { createDefaultOwner } from '../../defaults'
import { ClassLevels, ClassLevelMember } from '../../../../character-sheet/class-level/type'

// LAYER: base-save = one base-save-for-class-level child per class, summed - the direct base-attack-bonus
// analog, reading the fortitudeSave/reflexSave per-level fields instead of attackBonus. Trusts the
// per-class leaf; this proves the fold, the one-child-per-class outline, and the save-type selection.

const member = (fortitudeSave: number, reflexSave: number): ClassLevelMember =>
    ({ attackBonus: 0, fortitudeSave, reflexSave, feats: {} })

const klass = (displayName: string, members: ClassLevelMember[]): ClassLevels =>
    ({ displayName, level: members.length, data: members })

describe('base-save', () => {
    test('fortitude: one child per class, summed over acquired levels', () => {
        const owner = createDefaultOwner({
            cs: {
                levels: {
                    // Fighter: good fort (1,0,1) = +2; Slayer: (0,1) = +1
                    fighter: klass('Fighter', [member(1, 0), member(0, 1), member(1, 1)]),
                    slayer: klass('Slayer', [member(0, 0), member(1, 0)]),
                },
            },
        })
        const node = baseSave(owner, 'fortitude')
        expect(node.total()).toBe(3) // Fighter +2, Slayer +1
        expect(node.children.map(c => `${c.displayName} ${c.total()}`)).toEqual(['Fighter 2', 'Slayer 1'])
        expect(node.displayName).toBe('base-fortitude')
    })

    test('reflex reads the reflex field off the same classes', () => {
        const owner = createDefaultOwner({
            cs: {
                levels: {
                    fighter: klass('Fighter', [member(1, 0), member(0, 1), member(1, 1)]),
                    slayer: klass('Slayer', [member(0, 0), member(1, 0)]),
                },
            },
        })
        const node = baseSave(owner, 'reflex')
        expect(node.total()).toBe(2) // Fighter +2, Slayer +0
        expect(node.displayName).toBe('base-reflex')
    })

    test('an empty class sheet contributes 0', () => {
        const owner = createDefaultOwner({ cs: { levels: {} } })
        expect(baseSave(owner, 'fortitude').total()).toBe(0)
        expect(baseSave(owner, 'fortitude').children).toEqual([])
    })
})
