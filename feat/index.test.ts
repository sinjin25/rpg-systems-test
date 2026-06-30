import { featMeleeWeaponFighting, standardFilters } from './index.ts'
import { describe, test, assert, expect } from 'vitest'

describe('test standard filters', () => {
    test('noBlacklistAnyWhitelistFactory', () => {
        const filtFunc = standardFilters.noBlacklistAnyWhitelistFactory

        const filt0 = filtFunc({
            blacklist: ['magic'],
            whitelist: ['magic'],
        })

        // magic in blacklist
        assert.equal(
            filt0(['magic']),
            false,
        )

        // no matching whitelist
        assert.equal(
            filt0([]),
            false,
        )

        // no matching whitelist
        assert.equal(
            filt0(['melee']),
            false,
        )

        const filt1 = filtFunc({
            blacklist: ['ranged'],
            whitelist: ['melee']
        })

        // matching whitelist
        assert.equal(
            filt1(['melee']),
            true,
        )

        // extraneous tags but matches whitelist
        assert.equal(
            filt1(['magic', 'melee']),
            true,
        )
    })
})

describe('test a feat', () => {
    test('simple test', () => {
        const mwf = featMeleeWeaponFighting

        assert.equal(
            mwf.context.attack!.applies(['melee']),
            true
        )

        assert.equal(
            mwf.context.attack!.applies(['ranged']),
            false,
        )
    })
})