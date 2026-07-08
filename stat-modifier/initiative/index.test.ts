import { describe, test, assert, expect } from 'vitest'
import rollInitiative, { calculateInitiativeMod } from './index.ts'
import { defaultCharacterSheet } from '../../character-sheet/index.ts'
import { RingPlusTwoDex } from '../../defaults/equipment/index.ts'
import { featAlert } from '../../feat/feats/index.ts'
import { ModLogMember } from '../log/index.ts'

describe('calculateInitiativeMod', () => {
    const findDisplayName = (key: string) => (d: ModLogMember) => d.displayName === key

    test('modifier derives from dex', () => {
        const calc = calculateInitiativeMod({
            cs: {
                ...defaultCharacterSheet,
                dex: 10,
            }, es: {}, fs: {}, ss: {}
        })
        assert.equal(calc.total, 0)

        const calc2 = calculateInitiativeMod({
            cs: {
                ...defaultCharacterSheet,
                dex: 16,
            }, es: {}, fs: {}, ss: {}
        })
        assert.equal(calc2.total, 3)
    })

    test('dex factors in equipment', () => {
        const es = { ring: RingPlusTwoDex }
        const calc = calculateInitiativeMod({
            cs: {
                ...defaultCharacterSheet,
                dex: 10,
            }, es, fs: {}, ss: {}
        })
        assert.equal(calc.total, 1)
    })

    test('feats can give flat initiative bonuses', () => {
        const fs = { featAlert }
        const calc = calculateInitiativeMod({
            cs: {
                ...defaultCharacterSheet,
                dex: 10,
            }, es: {}, fs, ss: {}
        })
        assert.equal(calc.total, 4)
    })

    test('log records the initiative sources per group', () => {
        const { log, total } = calculateInitiativeMod({
            cs: defaultCharacterSheet,
            es: { ring: RingPlusTwoDex },
            fs: { featAlert },
            ss: {},
        })

        assert.deepEqual(log.groups.map(g => g.displayName), ['dexterity', 'feats', 'equipment', 'statuses'])

        // the individual feat shows up by name inside the feats group
        const featGroup = log.groups.find(g => g.displayName === 'feats')!
        assert.deepEqual(featGroup.entries, [
            { displayName: featAlert.displayName, amount: 4 },
        ])

        // the ring's +2 dex is halved inside the dex modifier, so it appears
        // as detail on the dexterity entry rather than as an additive entry
        const dexGroup = log.groups.find(g => g.displayName === 'dexterity')!
        assert.deepEqual(dexGroup.entries[0].detail, [
            { displayName: RingPlusTwoDex.displayName, amount: 2 },
        ])

        assert.equal(log.finalResult().total, total)
    })
})

describe('rollInitiative', () => {
    test('total is the modifier plus a d20', () => {
        // dex 10 → mod 0, so total is the raw d20
        const { total, log } = rollInitiative({
            cs: {
                ...defaultCharacterSheet,
                dex: 10,
            }, es: {}, fs: {}, ss: {}
        })

        expect(total).toBeGreaterThanOrEqual(1)
        expect(total).toBeLessThanOrEqual(20)
        assert.equal(log.roll.length, 1)
        assert.equal(log.finalResult().roll + log.finalResult().modifier, total)
    })

    test('Simulate: d20 outcomes should be uniformly spread', () => {
        const EXPECTED_UNIQUE_OUTCOMES = 20
        const outcomes: Record<number, number> = {}
        let uniqueOutcomes = 0
        const TEST = 2000

        for (let i = 0; i < TEST; i++) {
            const { total } = rollInitiative({
                cs: {
                    ...defaultCharacterSheet,
                    dex: 10,
                }, es: {}, fs: {}, ss: {}
            })
            if (!outcomes[total]) {
                outcomes[total] = 1
                uniqueOutcomes++
            }
            else outcomes[total]++
        }

        assert.equal(EXPECTED_UNIQUE_OUTCOMES, uniqueOutcomes)
    })
})
