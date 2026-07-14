import { describe, test, assert, expect } from 'vitest'
import calculateHp from './index.ts'
import { defaultCharacterSheet } from '../../character-sheet/index.ts'
import { RingPlusTenHealth, RingPlusTwoCon } from '../../defaults/equipment/index.ts'
import { ModLogMember, util_findModLogGroupItem } from '../log/index.ts'

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

    test('log records the health sources per group', () => {
        const { log, total } = calculateHp({
            cs: defaultCharacterSheet,
            es: { ring: RingPlusTenHealth },
            fs: {},
            ss: {},
        })

        assert.deepEqual(log.groups.map(g => g.displayName), ['base health', 'feats', 'equipment', 'statuses'])

        // the individual item shows up by name inside the equipment group
        const equipMod = util_findModLogGroupItem(log, {
            groupName: 'equipment',
            modDisplayName: RingPlusTenHealth.displayName,
        })
        assert.exists(equipMod)
        assert.equal(equipMod.amount, 10)

        assert.equal(log.finalResult().total, total)
    })

    test('log details the con bonuses feeding base health', () => {
        const { log } = calculateHp({
            cs: {
                ...defaultCharacterSheet,
                con: 10,
                level: 1,
            },
            es: { ring: RingPlusTwoCon },
            fs: {},
            ss: {},
        })

        // the ring's +2 con is halved inside the con modifier, so it appears
        // as detail on the base health entry rather than as an additive entry
        const baseGroup = log.groups.find(g => g.displayName === 'base health')!
        assert.equal(baseGroup.total, 11)
        assert.deepEqual(baseGroup.entries[0].detail, [
            { displayName: RingPlusTwoCon.displayName, amount: 2 },
        ])
    })
})
