import { createDefaultOwner, instantiateActor } from '.'
import { iterate } from '../simulate/util/iterate.ts'
import { makeWrapper, StatusSheet } from '../status-sheet2'
import { inst } from '../status-sheet2/testing'
import { Round, round, speedRoll } from './round.ts'
import { describe, test, assert, expect } from 'vitest'

const defaultPerson = () => createDefaultOwner({})

const STANDARD_SPEED = 35

describe('Speed rolls are 2d6', () => {
    test('Outcomes are normally distributed', () => {
        const EXPECTED_UNIQUE_OUTCOMES = 11 // (1 is impossible with 2dX)
        const outcomes: Record<number, number> = {}
        let uniqueOutcomes = 0
        const TEST = 500

        for (let i = 0; i < TEST; i++) {
            const roll = speedRoll(defaultPerson())
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

    test.skip('Speed can be modified')
})

describe('Round reports participants who are ready to act', () => {
    test('Reports an array of TurnData', () => {
        // there's a 0% chance of this fluking because no one can act the first round iteration
        const roundData = {
            participants: [instantiateActor(defaultPerson())],
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
        const ITERATIONS = 10000

        const roundData = {
            participants: [instantiateActor(defaultPerson())],
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

    test('a speed-elapsed status decays alongside the participant\'s speed rolls', () => {
        const ss: StatusSheet = {
            test: [inst(makeWrapper({ displayName: 'test', broadContexts: {} }, { expiration: { kind: 'speed-elapsed', remaining: 200 } }))],
        }
        const p = instantiateActor(defaultPerson())
        p.owner.ss = ss
        const roundData = {
            participants: [p],
            speedSum: STANDARD_SPEED,
        }

        round(roundData)
        assert.property(p.owner.ss, 'test', 'a large remaining duration should survive a single round')

        for (let i = 0; i < 100; i++) round(roundData)
        assert.notProperty(p.owner.ss, 'test', 'enough rounds should exhaust even a large remaining duration')
    })

    test('Ordering of actors is based on excess speed (descending order)', () => {
        const roundData = {
            participants: [
                instantiateActor(defaultPerson()),
                instantiateActor(defaultPerson()),
                instantiateActor(defaultPerson()),
            ],
            speedSum: STANDARD_SPEED,
        }

        iterate(5, () => {
            roundData.participants.forEach(a => a.speed.remainder = 34)
            const result = round(roundData)
            for (let i = 1; i < result.length; i++) {
                const prev = result[i - 1]
                const curr = result[i]

                expect(prev.speed.remainder).toBeGreaterThanOrEqual(curr.speed.remainder)
            }
        })
    })

})