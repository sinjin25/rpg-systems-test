import { createDefaultOwner } from '../actor2/index.ts'
import { fakeCharacterLevels } from '../character-sheet/util.ts'
import { simulateFight } from './index.ts'
import { describe, test, assert, expect } from 'vitest'
import newTimeTravelLogReplayer from '../time-travel2/replay/index.ts'
import ttrvTextVisualizer from '../time-travel2/replay/text-visualizer.ts'
import { addStatusToStatusSheet } from '../status-sheet2/add-status-to-status-sheet.ts'
import { ignite } from '../status-sheet2/index.ts'
import { Handlers } from '../time-travel2/types.ts'

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
    test('Works with a ttr passed', async () => {
        const onFireEnemy = createDefaultOwner()
        addStatusToStatusSheet(onFireEnemy, ignite)
        const ttr = newTimeTravelLogReplayer(ttrvTextVisualizer)
        simulateFight(
            {
                enemy: [onFireEnemy],
                player: [owner],
            },
            {
                timeTravelReplayer: ttr,
            }
        )
        assert.isTrue(ttr.logs.length > 2)
        const EXPECTED_LOG_TYPES: Array<keyof Handlers> = ['act-start', 'damage-over-time', 'fight-start', 'speed', 'standard-action-result', 'team-victory']
        for (let log of EXPECTED_LOG_TYPES) {
            const f = ttr.logs.find(a => a.kind === log)
            console.log('checking', log, f)
            assert.exists(f)
        }
        // this can timeout vitest
        await ttr.playback()
    })
})