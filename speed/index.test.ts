import { defaultCharacterSheet } from '../character-sheet/index.ts'
import { defaultEquipmentSheet } from '../equipment-sheet/index.ts'
import { defaultFeatSheet } from '../feat/index.ts'
import { round, speedRoll, STANDARD_SPEED } from './index.ts'
import { describe, test, assert, expect } from 'vitest'

const defaultPerson = {
    cs: defaultCharacterSheet,
    es: defaultEquipmentSheet,
    fs: defaultFeatSheet,
    ss: {},
}

describe('Speed rolls are 2d6', () => {
    test('Simulate: outcomes should be normally distributed', () => {
        const EXPECTED_UNIQUE_OUTCOMES = 11 // (1 is impossible with 2dX)
        const outcomes: Record<number, number> = {}
        let uniqueOutcomes = 0
        const TEST = 500

        for (let i = 0; i < TEST; i++) {
            const roll = speedRoll(defaultPerson)
            if (!outcomes[roll]) {
                outcomes[roll] = 1
                uniqueOutcomes++
            }
            else outcomes[roll]++
        }

        console.table(outcomes)
        assert.equal(EXPECTED_UNIQUE_OUTCOMES, uniqueOutcomes)

        // should be normally distributed at least
        const min = outcomes[2]!
        const max = outcomes[12]!

        for (let outcome of [5, 6, 7, 8]) {
            const freq = outcomes[outcome]!
            expect(freq).toBeGreaterThanOrEqual(min * 1.5)
            expect(freq).toBeGreaterThanOrEqual(max * 1.5)
        }
    })
    test.skip('Speed can be affected by modifiers', () => {
        console.warn('NOT IMPLEMENTED')
    })
})

describe('Round reports participants to act', () => {

    test('Reports an array of TurnData', () => {
        // there's a 0% chance of this fluking because no one can act the first round iteration
        const roundData = {
            participants: [{
                owner: defaultPerson,
                speed: {
                    canAct: true,
                    remainder: 0,
                }
            }],
            speedSum: STANDARD_SPEED,
        }
        // expect around ~35/3.5 = 10 iterations per action on average
        const r = round(roundData)
        assert.equal(Array.isArray(r), true)

        assert.equal(
            !!roundData.participants.find(a => a.speed.remainder !== 0),
            true,
        )
    })

    test('simulate', () => {
        let noActors = 0
        let hasActors = 0
        const ITERATIONS = 100000

        const roundData = {
            participants: [{
                owner: defaultPerson,
                speed: {
                    canAct: true,
                    remainder: 0,
                }
            }],
            speedSum: STANDARD_SPEED,
        }

        for (let i = 0; i < ITERATIONS; i++) {
            const r = round(roundData)
            if (r.length > 0) hasActors++
            else noActors++
        }

        expect(noActors).toBeGreaterThan(hasActors)
        expect(hasActors / ITERATIONS).toBeCloseTo(.2, 1)
    })
})