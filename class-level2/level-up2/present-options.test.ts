import { createDefaultOwner } from '../../actor2/index.ts'
import { chooseOptionAndMutate, presentOptions, } from './present-options.ts'
import { describe, test, assert, expect } from 'vitest'

const pickFighter = (options: ReturnType<typeof presentOptions>) => {
    return options.find(a => a.key === 'fighter')!
}

describe('Proposes the correct items', () => {
    test('A level 0 character should have all options presented', () => {
        const owner = createDefaultOwner()
        const options = presentOptions(owner.cs.levels)
        /* console.log(options) */
        assert.equal(options.length, 2)
        // has keys
        assert.notEqual(options[0].key, options[1].key)
    })

    test('A max level fighter should not have fighter options presented', () => {
        const owner = createDefaultOwner()
        // NOTE: NOTHING STOPS YOU FROM PASSING IN THE SAME ITEMS
        chooseOptionAndMutate(owner, {
            clp: pickFighter(presentOptions(owner.cs.levels)),
            freeFeat: 'Power Attack',
        })
        chooseOptionAndMutate(owner, {
            clp: pickFighter(presentOptions(owner.cs.levels)),
            freeFeat: 'Power Attack',
        })
        chooseOptionAndMutate(owner, {
            clp: pickFighter(presentOptions(owner.cs.levels)),
            freeFeat: 'Power Attack',
        })
        chooseOptionAndMutate(owner, {
            clp: pickFighter(presentOptions(owner.cs.levels)),
            freeFeat: 'Power Attack',
        })
        chooseOptionAndMutate(owner, {
            clp: pickFighter(presentOptions(owner.cs.levels)),
            freeFeat: 'Power Attack',
        })
        const opt = presentOptions(owner.cs.levels)
        assert.equal(opt.length, 1)
    })
})