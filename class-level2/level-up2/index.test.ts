import { createDefaultOwner } from '../../actor2/index.ts'
import { patchCloneWithProposal, newLevelUpProposal } from './index.ts'
import { testUtilCloneOwner } from './clone.ts'
import { ClassLevel } from '../types.ts'
import { describe, test, assert, expect } from 'vitest'

const pickFighter = (options: ClassLevel[]) => {
    return options.find(a => a.key === 'fighter')!
}

const levelUpFighter = (original: ReturnType<typeof createDefaultOwner>, chosenFeats: string[] = ['Power Attack']) => {
    const clone = testUtilCloneOwner(original)
    const cl = pickFighter(newLevelUpProposal(original).classLevelList)
    return patchCloneWithProposal({ original, clone }, { cl, chosenFeats: chosenFeats as any }) ?? original
}

describe('Proposes the correct items', () => {
    test('A level 0 character should have all options presented', () => {
        const owner = createDefaultOwner()
        const options = newLevelUpProposal(owner).classLevelList
        /* console.log(options) */
        assert.equal(options.length, 2)
        // has keys
        assert.notEqual(options[0].key, options[1].key)
    })

    test('A max level fighter should not have fighter options presented', () => {
        let owner = createDefaultOwner()
        assert.equal(newLevelUpProposal(owner).classLevelList.length, 2)
        // NOTE: NOTHING STOPS YOU FROM PASSING IN THE SAME ITEMS
        owner = levelUpFighter(owner)
        owner = levelUpFighter(owner)
        owner = levelUpFighter(owner)
        owner = levelUpFighter(owner)

        // out of levels here
        assert.equal(newLevelUpProposal(owner).classLevelList.length, 1)
    })
})
