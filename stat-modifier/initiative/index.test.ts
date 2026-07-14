import { describe, test, assert, expect } from 'vitest'
import rollInitiative, { calculateInitiativeMod } from './index.ts'
import { defaultCharacterSheet } from '../../character-sheet/index.ts'
import { RingPlusTwoDex } from '../../defaults/equipment/index.ts'
import { featAlert } from '../../feat/feats/index.ts'
import { ModLogMember, util_findModLogGroupItem } from '../log/index.ts'
import { iterate } from '../../simulate/util/iterate.ts'
import { instantiateSpeed, Owner } from '../../character/actor/index.ts'
import { defaultEquipmentSheet } from '../../equipment-sheet/index.ts'
import { defaultFeatSheet } from '../../feat/index.ts'
import { defaultStatusSheet } from '../../status-sheet/types.ts'
import { boxPlotStats } from '../../simulate/util/box-plot.ts'
import { StatusExpirationSpeedElapsed } from '../../status-sheet/core-types.ts'

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
        const featMod = util_findModLogGroupItem(log, {
            groupName: 'feats',
            modDisplayName: featAlert.displayName,
        })
        assert.exists(featMod)
        assert.equal(featMod.amount, 4)

        // the ring's +2 dex is halved inside the dex modifier, so it appears
        // as detail on the dexterity entry rather than as an additive entry
        const dexMod = util_findModLogGroupItem(log, {
            groupName: 'dexterity',
            modDisplayName: 'dex modifier',
        })!
        assert.deepEqual(dexMod.detail, [
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

describe('integration: flat-footed', () => {
    test('improved initiative should prevent you from getting caught flat footed', () => {
        const ITERATIONS = 200
        const char: Owner = {
            cs: {
                ...defaultCharacterSheet,
                dex: 10,
            },
            es: defaultEquipmentSheet,
            fs: defaultFeatSheet,
            ss: defaultStatusSheet,
        }
        const char2: Owner = {
            ...char,
            fs: { featAlert },
        }
        const charSlow = iterate(ITERATIONS, () => {
            const character = char
            instantiateSpeed(character)
            const status = character.ss['flatFooted']!.expiration as StatusExpirationSpeedElapsed
            return status.remaining
        })

        const charFast = iterate(ITERATIONS, () => {
            const character = char2
            instantiateSpeed(character)
            const status = character.ss['flatFooted']!.expiration as StatusExpirationSpeedElapsed
            return status.remaining
        })

        const slow = boxPlotStats(charSlow)
        const fast = boxPlotStats(charFast)
        // seeded
        assert.equal(slow.median, 24)
        assert.equal(fast.median, 20)
        expect(slow.median).toBeGreaterThan(fast.median)
    })
})
