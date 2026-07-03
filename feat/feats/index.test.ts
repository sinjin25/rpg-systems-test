import { defaultCharacterSheet } from '../../character-sheet/index.ts'
import { featMeleeWeaponFighting, standardFilters, possibleFeats, featDemoEvenOdd } from './index.ts'
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
    test('save test', () => {
        const fcs = possibleFeats.featConSaves

        assert.equal(
            fcs.context.save!.applies(['constitution']),
            true,
        )
    })
})

describe('mod functions work', () => {
    test('even-odd feat test', () => {
        // this test feat will add additional +1 to the mod for each
        // even stat line
        const fdeo = featDemoEvenOdd
        const mod = fdeo.context.attack!.mod({
            characterSheet: defaultCharacterSheet,
        })

        // all odd
        assert.equal(mod, 0)

        const mod2 = fdeo.context.attack!.mod({
            characterSheet: {
                con: 15,
                dex: 16,
                str: 8,
            }
        })

        // 2 even
        assert.equal(mod2, 2)
    })
})