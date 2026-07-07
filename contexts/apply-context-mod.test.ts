import { describe, test, assert } from 'vitest'
import applyContextMod from './apply-context-mod.ts'
import { FeatContext, standardFilters } from '../feat/core-types.ts'
import { defaultCharacterSheet } from '../character-sheet/index.ts'
import { ContextNames } from './index.ts'

const always = (_: ContextNames[]) => true
const never = (_: ContextNames[]) => false

describe('applyContextMod', () => {
    test('returns 0 for no sources', () => {
        const result = applyContextMod([], (s: FeatContext) => s, {}, [], 'attack')
        assert.equal(result, 0)
    })

    test('sums mods across sources for the matching broad context', () => {
        const sources: FeatContext[] = [
            { attack: { applies: always, mod: () => 1 } },
            { attack: { applies: always, mod: () => 2 } },
        ]

        const result = applyContextMod(sources, s => s, {}, [], 'attack')
        assert.equal(result, 3)
    })

    test('skips sources whose applies rejects the active contexts', () => {
        const sources: FeatContext[] = [
            { attack: { applies: always, mod: () => 1 } },
            { attack: { applies: never, mod: () => 100 } },
        ]

        const result = applyContextMod(sources, s => s, {}, [], 'attack')
        assert.equal(result, 1)
    })

    test('ignores entries under other broad contexts', () => {
        const sources: FeatContext[] = [
            { attack: { applies: always, mod: () => 1 } },
            { damage: { applies: always, mod: () => 100 } },
        ]

        assert.equal(applyContextMod(sources, s => s, {}, [], 'attack'), 1)
        assert.equal(applyContextMod(sources, s => s, {}, [], 'damage'), 100)
        assert.equal(applyContextMod(sources, s => s, {}, [], 'save'), 0)
    })

    test('tolerates sources without a context map', () => {
        const sources = [
            { context: undefined },
            { context: { attack: { applies: always, mod: () => 2 } } as FeatContext },
        ]

        const result = applyContextMod(sources, s => s.context, {}, [], 'attack')
        assert.equal(result, 2)
    })

    test('passes data through to the mod function', () => {
        const sources: FeatContext[] = [
            {
                attack: {
                    applies: always,
                    mod: (data) => data?.characterSheet ? 5 : 0,
                },
            },
        ]

        const withData = applyContextMod(
            sources, s => s,
            { characterSheet: defaultCharacterSheet },
            [], 'attack',
        )
        assert.equal(withData, 5)

        const withoutData = applyContextMod(sources, s => s, {}, [], 'attack')
        assert.equal(withoutData, 0)
    })

    test('passes the active contexts to applies (whitelist/blacklist filtering)', () => {
        const sources: FeatContext[] = [
            {
                attack: {
                    applies: standardFilters.noBlacklistAnyWhitelistFactory({
                        whitelist: ['melee'],
                        blacklist: ['magic'],
                    }),
                    mod: () => 1,
                },
            },
        ]

        assert.equal(applyContextMod(sources, s => s, {}, ['melee'], 'attack'), 1)
        assert.equal(applyContextMod(sources, s => s, {}, ['ranged'], 'attack'), 0)
        // blacklist wins even when the whitelist also matches
        assert.equal(applyContextMod(sources, s => s, {}, ['melee', 'magic'], 'attack'), 0)
    })
})
