import { createDefaultOwner } from '../actor2/index.ts'
import { fakeCharacterLevels } from '../character-sheet'
import roll, { clearSeed, setSeed } from '../roll/index.ts'
import { simulateFight } from './index.ts'
import { describe, test, assert, afterEach } from 'vitest'

describe('simulateFight', () => {
    test('', () => {
        const o1 = createDefaultOwner({
            cs: {
                flavorSheet: {
                    displayName: 'Fighter2',
                    description: '',
                },
                levels: fakeCharacterLevels(2)
            },
        })
        const o2 = createDefaultOwner({
            cs: {
                flavorSheet: {
                    displayName: 'Fighter5',
                    description: '',
                },
                levels: fakeCharacterLevels(5)
            },
        })

        const sim = simulateFight(
            {
                player: [o2],
                enemy: [o1],
            }, {
            verbose: true,
        }
        )

        assert.equal(sim.winner, 'player')
    })
})

describe('Integration: TimeTravel', () => {
    const owner = createDefaultOwner({
        cs: {
            str: 30,
        }
    })
    const owner2 = createDefaultOwner()
    test('works with no ttr passed', () => {
        simulateFight(
            {
                enemy: [owner2],
                player: [owner],
            }
        )
    })
})

describe('Full integration with rollInstance', () => {
    afterEach(() => {
        clearSeed()
    })
    test('control', () => {
        setSeed(0)
        const r = roll(1000)
        setSeed(0)
        const r2 = roll(1000)
        assert.equal(r, r2)
    })
    test('Does not advance global seed when provided ri', () => {
        // did the roll advance
        setSeed(0)
        const ROLL = roll(1000)
        setSeed(0)

        const o1 = createDefaultOwner({
            cs: {
                flavorSheet: {
                    displayName: 'Fighter2',
                    description: '',
                },
                levels: fakeCharacterLevels(2)
            },
        })
        const o2 = createDefaultOwner({
            cs: {
                flavorSheet: {
                    displayName: 'Fighter5',
                    description: '',
                },
                levels: fakeCharacterLevels(5)
            },
        })

        const sim = simulateFight(
            {
                player: [o2],
                enemy: [o1],
            }, {
            verbose: true,
        }
        )


        const ROLL2 = roll(1000)
        // if this is not true, then something advanced the global rng and rollInstance was not forwarded to all rolls
        assert.equal(ROLL, ROLL2)
    })
})