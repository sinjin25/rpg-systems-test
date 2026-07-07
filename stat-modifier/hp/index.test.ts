import { describe, test, assert, expect } from 'vitest'
import calculateHp from './index.ts'
import { defaultCharacterSheet } from '../../character-sheet/index.ts'
import { RingPlusTenHealth, RingPlusTwoCon } from '../../defaults/equipment/index.ts'
import { ModLogMember } from '../log/index.ts'

describe('calculateHp', () => {
    const findDisplayName = (key: string) => (d: ModLogMember) => d.displayName === key

    test('base health scales with level', () => {
        // con 15 → +2 mod → 12 hp per level
        const calc = calculateHp({
            cs: {
                ...defaultCharacterSheet,
                con: 10,
                level: 1,
            }, es: {}, fs: {}, ss: {}
        })
        assert.equal(calc.total, 10)

        const calc2 = calculateHp({
            cs: {
                ...defaultCharacterSheet,
                con: 10,
                level: 3,
            }, es: {}, fs: {}, ss: {}
        })
        assert.equal(calc2.total, 30)
    })

    test('base health scales with con with level', () => {
        const calc = calculateHp({
            cs: {
                ...defaultCharacterSheet,
                con: 16,
                level: 1,
            }, es: {}, fs: {}, ss: {}
        })
        assert.equal(calc.total, 13)

        const calc2 = calculateHp({
            cs: {
                ...defaultCharacterSheet,
                con: 16,
                level: 3,
            }, es: {}, fs: {}, ss: {}
        })
        assert.equal(calc2.total, 39)
    })

    test('equipment can give flat amounts of health', () => {
        const es = { ring: RingPlusTenHealth }
        const calc = calculateHp({
            cs: {
                ...defaultCharacterSheet,
                con: 12,
                level: 1,
            }, es, fs: {}, ss: {}
        })
        assert.equal(
            calc.total,
            21,
        )
    })

    test('con factors in equipment', () => {
        const es = { ring: RingPlusTwoCon }
        const calc = calculateHp({
            cs: {
                ...defaultCharacterSheet,
                con: 10,
                level: 1,
            }, es, fs: {}, ss: {}
        })
        assert.equal(calc.total, 11)
    })

    test('log records the health sources', () => {
        const { log } = calculateHp({
            cs: defaultCharacterSheet,
            es: { ring: RingPlusTenHealth },
            fs: {},
            ss: {},
        })

        assert.equal(log.mods.length, 3)

        assert.isTrue(log.mods.some(findDisplayName('base health')))
        assert.isTrue(log.mods.some(findDisplayName('feats')))
        assert.isTrue(log.mods.some(findDisplayName('equipment')))

        assert.isTrue(typeof log.finalResult().total === 'number')
    })
})
