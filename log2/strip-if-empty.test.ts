import { describe, expect, test } from 'vitest'
import { leaf } from '.'
import { stripSelectModNodeIfEmpty } from './strip-if-empty'

describe('stripSelectModNodeIfEmpty', () => {
    test('strips a whitelisted node when it totals 0', () => {
        const children = [
            leaf('base-attack-bonus', 3),
            leaf('attack-equipment-mod', 0),
        ]

        const result = stripSelectModNodeIfEmpty(children)

        expect(result).toHaveLength(1)
        expect(result[0].displayName).toBe('base-attack-bonus')
    })

    test('keeps a whitelisted node when it has a nonzero total', () => {
        const children = [
            leaf('base-attack-bonus', 3),
            leaf('attack-equipment-mod', 2),
        ]

        const result = stripSelectModNodeIfEmpty(children)

        expect(result).toHaveLength(2)
    })

    test('keeps a non-whitelisted node even when it totals 0', () => {
        const children = [
            leaf('base-attack-bonus', 0),
            leaf('attack-equipment-mod', 0),
        ]

        const result = stripSelectModNodeIfEmpty(children)

        expect(result).toHaveLength(1)
        expect(result[0].displayName).toBe('base-attack-bonus')
    })

    test('a custom whitelist overrides the default', () => {
        const children = [
            leaf('attack-equipment-mod', 0),
            leaf('speed-equipment-mod', 0),
        ]

        const result = stripSelectModNodeIfEmpty(children, { 'speed-equipment-mod': true })

        expect(result).toHaveLength(1)
        expect(result[0].displayName).toBe('attack-equipment-mod')
    })

    test('every default-whitelisted *-equipment-mod kind is stripped when empty', () => {
        const defaultStrippedKinds = [
            'attack-equipment-mod',
            'crit-multiplier-equipment-mod',
            'crit-threat-range-equipment-mod',
            'flat-damage-equipment-mod',
            'speed-equipment-mod',
            'initiative-equipment-mod',
            'damage-taken-equipment-mod',
            'health-equipment-mod',
            'fortitude-equipment-mod',
            'will-equipment-mod',
            'reflex-equipment-mod',
        ] as const

        const children = defaultStrippedKinds.map(kind => leaf(kind, 0))
        const result = stripSelectModNodeIfEmpty(children)

        expect(result).toHaveLength(0)
    })
})
