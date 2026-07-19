import { describe, test, assert } from 'vitest'
import standardHealModifierFactory from './standard'
import { defaultCharacterSheet } from '../../character-sheet'
import { defaultFeatSheet, FeatSheet } from '../../feat'
import { Feat, standardFilters } from '../../feat/core-types'
import { StatusEffect } from '../../status-sheet/core-types'
import { StatusSheet } from '../../status-sheet/types'

const applies = standardFilters.noBlacklistAnyWhitelistFactory({ blacklist: [], whitelist: ['all'] })

describe('standard heal', () => {
    test('returns the base heal when nothing modifies it', () => {
        const heal = standardHealModifierFactory({
            cs: defaultCharacterSheet,
            es: {},
            fs: defaultFeatSheet,
            ss: {},
            baseHeal: 2,
        })
        assert.equal(heal().total, 2)
    })

    test('a heal feat stacks on top of the base heal', () => {
        const featHealer: Feat = {
            displayName: 'DEMO Healer',
            context: { heal: { applies, mod: () => 3 } },
        }
        // @ts-expect-error
        const fs: FeatSheet = { ...defaultFeatSheet, featHealer }
        const heal = standardHealModifierFactory({
            cs: defaultCharacterSheet,
            es: {},
            fs,
            ss: {},
            baseHeal: 2,
        })
        // base(2) + feat(3)
        assert.equal(heal().total, 5)
    })

    test('a heal status stacks on top of the base heal', () => {
        const statusHealBoost: StatusEffect = {
            displayName: 'Heal Boost',
            expiration: { kind: 'speed-elapsed', remaining: 1 },
            context: { heal: { applies, mod: () => 1 } },
        }
        const ss: StatusSheet = { statusHealBoost }
        const heal = standardHealModifierFactory({
            cs: defaultCharacterSheet,
            es: {},
            fs: defaultFeatSheet,
            ss,
            baseHeal: 2,
        })
        // base(2) + status(1)
        assert.equal(heal().total, 3)
    })
})
