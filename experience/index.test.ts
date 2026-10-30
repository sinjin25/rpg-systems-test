import { describe, test, assert } from 'vitest'
import { leaf } from '../log2'
import { createDefaultOwner } from '../actor2'
import { experienceBreakpoints, mutateCurrentExperience } from './index'

const makeOwner = (currentXp: number) => createDefaultOwner({
    experience: {
        currentXp,
        breakpoints: experienceBreakpoints,
    }
})

describe('mutateCurrentExperience', () => {
    test('mutates currentXp on the target', () => {
        const owner = makeOwner(0)
        mutateCurrentExperience(owner, leaf('base-xp-on-kill', 30))
        assert.equal(owner.experience.currentXp, 30)
    })

    test('returns amount and updated currentXp', () => {
        const owner = makeOwner(0)
        const amount = leaf('base-xp-on-kill', 30)
        const result = mutateCurrentExperience(owner, amount)
        assert.equal(result.amount, amount)
        assert.equal(result.currentXp, 30)
    })

    test('no level when XP stays below next breakpoint', () => {
        const owner = makeOwner(0)
        const result = mutateCurrentExperience(owner, leaf('base-xp-on-kill', 5))
        assert.isFalse(result.didLevel)
    })

    test('levels up when XP exactly hits the breakpoint', () => {
        const owner = makeOwner(0)
        const result = mutateCurrentExperience(owner, leaf('base-xp-on-kill', 10))
        assert.isTrue(result.didLevel)
    })

    test('levels up when XP exceeds the breakpoint', () => {
        const owner = makeOwner(0)
        const result = mutateCurrentExperience(owner, leaf('base-xp-on-kill', 15))
        assert.isTrue(result.didLevel)
    })

    test('uses the correct next breakpoint when already past earlier ones', () => {
        // at 60 XP, 10 and 50 are already passed — next is 200
        const owner = makeOwner(60)
        const result = mutateCurrentExperience(owner, leaf('base-xp-on-kill', 10))
        assert.isFalse(result.didLevel)
    })

    test('levels up crossing the second breakpoint', () => {
        const owner = makeOwner(60)
        const result = mutateCurrentExperience(owner, leaf('base-xp-on-kill', 150))
        assert.isTrue(result.didLevel)
    })
})
