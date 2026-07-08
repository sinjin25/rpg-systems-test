import ostracizedGoblin from './ostracized-goblin.ts'
import { simulateFight, worldState } from '../../simulate/index.ts'
import { iterate } from '../../simulate/util/iterate.ts'
import { boxPlotStats } from '../../simulate/util/box-plot.ts'
import { defaultCharacterSheet } from '../../character-sheet/index.ts'
import { defaultFeatSheet } from '../../feat/index.ts'
import { defaultEquipmentSheet } from '../../equipment-sheet/index.ts'
import instantiateActor, { Owner } from '../../character/actor/index.ts'
import { describe, test, expect } from 'vitest'
import { featAlert } from '../../feat/feats/index.ts'

const SHOW_DEBUG = true

const defaultPlayer: Owner = {
    cs: defaultCharacterSheet,
    fs: defaultFeatSheet,
    es: defaultEquipmentSheet,
    ss: {},
}

describe('A default player can win', () => {
    test('simulate', () => {
        const ITERATIONS = 200
        const EXPECTED_WIN_RATE = 0.9

        const results = iterate(ITERATIONS, () => simulateFight({
            player: [defaultPlayer],
            enemy: [ostracizedGoblin],
        }))

        const wins = results.filter(r => r.winner === 'player').length
        expect(wins / ITERATIONS).toBeGreaterThanOrEqual(EXPECTED_WIN_RATE)

        if (SHOW_DEBUG) console.table({
            wins,
            iterations: ITERATIONS
        })
    })
})

const hpLosses = (results: ReturnType<typeof simulateFight>[]) =>
    results.map(r => r.debugData.player0HpStart - r.debugData.player0HpEnd)

describe('Ostracized goblin difficulty', () => {
    const ITERATIONS = 200
    // guards against a broken sim looping forever if the player never takes damage
    const MAX_CONSECUTIVE_FIGHTS = 200

    test('how many consecutive fights a player can win in a row', () => {
        /* const initPlayer: Owner = {
            cs: defaultCharacterSheet,
            es: defaultEquipmentSheet,
            fs: {
                ...defaultFeatSheet,
                featAlert,
            },
            ss: {},
        } */
        const winsPerRun = iterate(ITERATIONS, () => {
            const ws = worldState({ player: [defaultPlayer] })
            let wins = 0
            while (wins < MAX_CONSECUTIVE_FIGHTS) {
                const result = simulateFight({
                    player: ws.playerActors,
                    enemy: [ostracizedGoblin],
                })
                if (result.winner !== 'player') break
                wins++
                ws.playerAfterFight()
            }
            return wins
        })

        const stats = boxPlotStats(winsPerRun)

        // the worst-case run (min) still nets at least one win
        expect(stats.min).toBeGreaterThanOrEqual(1)
        expect(winsPerRun.every(w => w < MAX_CONSECUTIVE_FIGHTS)).toBe(true)

        if (SHOW_DEBUG) console.table(stats)
    })

    test('how many consecutive fights a player can win in a row against two goblins', () => {
        const winsPerRun = iterate(ITERATIONS, () => {
            const ws = worldState({ player: [defaultPlayer] })
            let wins = 0
            while (wins < MAX_CONSECUTIVE_FIGHTS) {
                const result = simulateFight({
                    player: ws.playerActors,
                    enemy: [ostracizedGoblin, ostracizedGoblin],
                })
                if (result.winner !== 'player') break
                wins++
                ws.playerAfterFight()
            }
            return wins
        })

        const stats = boxPlotStats(winsPerRun)

        expect(winsPerRun.every(w => w < MAX_CONSECUTIVE_FIGHTS)).toBe(true)

        if (SHOW_DEBUG) console.table(stats)
    })

    test('hp loss per fight against one goblin', () => {
        const results = iterate(ITERATIONS, () => simulateFight({
            player: [defaultPlayer],
            enemy: [ostracizedGoblin],
        }))

        const stats = boxPlotStats(hpLosses(results))
        const maxHp = instantiateActor(defaultPlayer).health.max

        expect(stats.median).toBeGreaterThan(0)
        // a single fight can lose at most a full bar of hp
        expect(stats.max).toBeLessThanOrEqual(maxHp)

        if (SHOW_DEBUG) console.table({ ...stats, maxHp })
    })

    // only interesting if I provide feats that make help with fighting multiple people
    test.skip('hp loss is higher fighting two goblins than one', () => {
        const oneGoblin = iterate(ITERATIONS, () => simulateFight({
            player: [defaultPlayer],
            enemy: [ostracizedGoblin],
        }))
        const twoGoblins = iterate(ITERATIONS, () => simulateFight({
            player: [defaultPlayer],
            enemy: [ostracizedGoblin, ostracizedGoblin],
        }))

        const statsOne = boxPlotStats(hpLosses(oneGoblin))
        const statsTwo = boxPlotStats(hpLosses(twoGoblins))

        // compare on median rather than mean so a handful of unlucky
        // near-death runs can't skew the "typical" fight
        expect(statsTwo.median).toBeGreaterThan(statsOne.median)

        if (SHOW_DEBUG) console.table({ oneGoblin: statsOne, twoGoblins: statsTwo })
    })
})
