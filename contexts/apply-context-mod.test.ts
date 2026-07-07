import { describe, test, assert } from 'vitest'
import applyContextMod from './apply-context-mod.ts'
import { FeatContext, standardFilters } from '../feat/core-types.ts'
import { defaultCharacterSheet } from '../character-sheet/index.ts'
import { ContextNames } from './index.ts'

const always = (_: ContextNames[]) => true
const never = (_: ContextNames[]) => false
const unnamed = (_: unknown) => 'src'

describe('applyContextMod', () => {
    test('returns 0 for no sources', () => {
        const result = applyContextMod([], (s: FeatContext) => s, unnamed, {}, [], 'attack')
        assert.equal(result.total, 0)
        assert.deepEqual(result.entries, [])
    })

    test('sums mods across sources for the matching broad context', () => {
        const sources: FeatContext[] = [
            { attack: { applies: always, mod: () => 1 } },
            { attack: { applies: always, mod: () => 2 } },
        ]

        const result = applyContextMod(sources, s => s, unnamed, {}, [], 'attack')
        assert.equal(result.total, 3)
    })

    test('records one named entry per applying source', () => {
        const sources = [
            { name: 'sword', context: { attack: { applies: always, mod: () => 1 } } as FeatContext },
            { name: 'ring', context: { attack: { applies: always, mod: () => 2 } } as FeatContext },
            { name: 'amulet', context: { attack: { applies: never, mod: () => 100 } } as FeatContext },
        ]

        const result = applyContextMod(sources, s => s.context, s => s.name, {}, [], 'attack')
        assert.deepEqual(result.entries, [
            { displayName: 'sword', amount: 1 },
            { displayName: 'ring', amount: 2 },
        ])
        assert.equal(result.total, 3)
    })

    test('skips sources whose applies rejects the active contexts', () => {
        const sources: FeatContext[] = [
            { attack: { applies: always, mod: () => 1 } },
            { attack: { applies: never, mod: () => 100 } },
        ]

        const result = applyContextMod(sources, s => s, unnamed, {}, [], 'attack')
        assert.equal(result.total, 1)
        assert.equal(result.entries.length, 1)
    })

    test('ignores entries under other broad contexts', () => {
        const sources: FeatContext[] = [
            { attack: { applies: always, mod: () => 1 } },
            { damage: { applies: always, mod: () => 100 } },
        ]

        assert.equal(applyContextMod(sources, s => s, unnamed, {}, [], 'attack').total, 1)
        assert.equal(applyContextMod(sources, s => s, unnamed, {}, [], 'damage').total, 100)
        assert.equal(applyContextMod(sources, s => s, unnamed, {}, [], 'save').total, 0)
    })

    test('tolerates sources without a context map', () => {
        const sources = [
            { context: undefined },
            { context: { attack: { applies: always, mod: () => 2 } } as FeatContext },
        ]

        const result = applyContextMod(sources, s => s.context, unnamed, {}, [], 'attack')
        assert.equal(result.total, 2)
    })

    test('passes data through to the mod function', () => {
        const sources: FeatContext[] = [
            {
                attack: {
                    applies: always,
                    mod: (data) => data?.cs ? 5 : 0,
                },
            },
        ]

        const withData = applyContextMod(
            sources, s => s, unnamed,
            { cs: defaultCharacterSheet },
            [], 'attack',
        )
        assert.equal(withData.total, 5)

        const withoutData = applyContextMod(sources, s => s, unnamed, {}, [], 'attack')
        assert.equal(withoutData.total, 0)
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

        assert.equal(applyContextMod(sources, s => s, unnamed, {}, ['melee'], 'attack').total, 1)
        assert.equal(applyContextMod(sources, s => s, unnamed, {}, ['ranged'], 'attack').total, 0)
        // blacklist wins even when the whitelist also matches
        assert.equal(applyContextMod(sources, s => s, unnamed, {}, ['melee', 'magic'], 'attack').total, 0)
    })
})
