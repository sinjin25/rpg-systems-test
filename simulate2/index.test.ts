import ignite from '../ability-sheet2/abilities2/ignite.ts'
import { addAbility } from '../ability-sheet2/index.ts'
import { createDefaultOwner } from '../actor2/index.ts'
import { fakeCharacterLevels } from '../character-sheet'
import { createRoll } from '../roll/index.ts'
import { simulateFight } from './index.ts'
import { describe, test, assert, vi } from 'vitest'

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
    test('never falls back to Math.random when provided a full rollInstance', () => {
        const spy = vi.spyOn(Math, 'random')

        const o1 = createDefaultOwner({
            cs: {
                flavorSheet: {
                    displayName: 'Fighter2',
                    description: '',
                },
                levels: fakeCharacterLevels(2)
            },
        })
        addAbility(o1, ignite)
        const o2 = createDefaultOwner({
            cs: {
                flavorSheet: {
                    displayName: 'Fighter5',
                    description: '',
                },
                levels: fakeCharacterLevels(5)
            },
        })

        simulateFight(
            {
                player: [o2],
                enemy: [o1],
            }, {
            verbose: true,
            rollInstance: createRoll(1),
        }
        )

        // if this fires, something fell through to the global rng instead of using rollInstance
        assert.isFalse(spy.mock.calls.length > 0)
        spy.mockRestore()
    })
})