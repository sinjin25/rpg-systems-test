import { createDefaultOwner } from '../../actor2'
import modNodeToText from '../format.ts'
import { findNodeMatching } from '../index.ts'
import save from './save.ts'
import { describe, test, assert, expect } from 'vitest'
import { newLevelUpProposal, patchCloneWithProposal } from '../../class-level2/level-up2/index.ts'
import { testUtilCloneOwner } from '../../class-level2/level-up2/clone.ts'
import { ClassLevel } from '../../class-level2/types.ts'

const levelUpFighter = (original: ReturnType<typeof createDefaultOwner>) => {
    const clone = testUtilCloneOwner(original)
    const cl = newLevelUpProposal(original).classLevelList.find((a: ClassLevel) => a.key === 'fighter')!
    return patchCloneWithProposal({ original, clone }, { cl, chosenFeats: [] }) ?? original
}

describe('Too lazy to do this rn', () => {
    test('Works with classes', () => {
        const owner = createDefaultOwner({
            cs: {
                dex: 16, // +3
                str: 10,
            },
        })
        const node = save('reflex')(owner)
        console.log(modNodeToText(node))
        expect(node.total()).toBe(3)
        assert.exists(findNodeMatching(node, /reflex$/, {
            includeRoot: true,
        }))

        expect(node.children.length).toBe(1)

        // filters children with a score of 0
    })
    /* too test:
    fortitude
    reflex

    base
    modded-cs
    feat-mod
    status-mod
    equipment-mod
    */
})

describe('save-from-class-levels integration', () => {
    test('base save reflects real class levels gained via level-up2, not just fake levels on the owner', () => {
        // createDefaultOwner already starts with one real fighter level (fortitude +1)
        let owner = createDefaultOwner({
            cs: { con: 10 },
        })
        owner = levelUpFighter(owner) // fighter level index 1: fortitude +0
        owner = levelUpFighter(owner) // fighter level index 2: fortitude +1

        expect(owner.cs.levels.length).toBe(3)

        const node = save('fortitude')(owner)
        console.log(modNodeToText(node))

        const base = findNodeMatching(node, /^class-fortitude$/, { includeRoot: true })
        assert.exists(base)
        expect(base!.children.map(c => `${c.displayName} ${c.total()}`)).toEqual(['fighter 2'])
        expect(base!.total()).toBe(2)

        // con is +0, hardy from fighter + 2
        expect(node.total()).toBe(4)
    })
})