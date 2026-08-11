import { createDefaultOwner } from '../actor2/index.ts'
import { fakeCharacterLevels } from '../character-sheet/util.ts'
import { simulateFight } from './index.ts'
import { describe, test, assert, expect } from 'vitest'
import newTimeTravelLogReplayer from './time-travel/replay/index.ts'

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
    test('Works with a ttr passed', () => {
        const ttr = newTimeTravelLogReplayer()
        simulateFight(
            {
                enemy: [owner2],
                player: [owner],
            },
            {
                timeTravelReplayer: ttr,
            }
        )
        assert.isTrue(ttr.logs.length > 2)
        for (let i = 0; i < ttr.logs.length; i++) {
            const res = ttr.replayStep()
            console.log(res)
        }
    })
})