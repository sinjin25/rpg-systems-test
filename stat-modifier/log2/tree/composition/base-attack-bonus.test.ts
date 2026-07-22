import { describe, test, expect } from 'vitest'
import baseAttackBonus from './base-attack-bonus'
import { createDefaultOwner } from '../../../../defaults'
import { ClassLevels, ClassLevelMember } from '../../../../character-sheet/class-level/type'

// LAYER: base-attack-bonus = one base-attack-bonus-for-class-level child per class, summed. Trusts
// the per-class leaf; this proves the fold and the one-child-per-class outline.

const member: ClassLevelMember = { attackBonus: 1, fortitudeSave: 0, reflexSave: 0, feats: {} }
const bab = (displayName: string, levels: number): ClassLevels => ({
    displayName, level: levels, data: Array.from({ length: levels }, () => member),
})

describe('base-attack-bonus', () => {
    test('one child per class (Fighter 4, Slayer 2), summed to +6', () => {
        const owner = createDefaultOwner({
            cs: { levels: { fighter: bab('Fighter', 4), slayer: bab('Slayer', 2) } },
        })
        const node = baseAttackBonus(owner)
        expect(node.total()).toBe(6)
        // the whole point: classes are summarised per class, not per level
        expect(node.children.map(c => `${c.displayName} ${c.total()}`)).toEqual(['Fighter 4', 'Slayer 2'])
    })

    test('an empty class sheet contributes 0', () => {
        const owner = createDefaultOwner({ cs: { levels: {} } })
        expect(baseAttackBonus(owner).total()).toBe(0)
        expect(baseAttackBonus(owner).children).toEqual([])
    })
})
