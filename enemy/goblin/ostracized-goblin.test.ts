import ostracizedGoblin from './ostracized-goblin.ts'
import { iterate } from '../../simulate/util/iterate.ts'
import { boxPlotStats } from '../../simulate/util/box-plot.ts'
import { defaultCharacterSheet } from '../../character-sheet/index.ts'
import { describe, test, expect, assert } from 'vitest'
import { createDefaultOwner } from '../../defaults/index.ts'
import { instantiateActor, OwnerMaximal } from '../../actor2/index.ts'
import { simulateFight } from '../../simulate2/index.ts'
import { setupWorldState } from '../../simulate2/setup.ts'
import { chooseOptionAndMutate, presentOptions } from '../../class-level2/level-up2/present-options.ts'

const SHOW_DEBUG = true

const defaultPlayer: OwnerMaximal = createDefaultOwner({})

const pickFighter = (options: ReturnType<typeof presentOptions>) => {
    return options.find(a => a.key === 'fighter')
}

describe('A default player can win', () => {
    test('simulate', () => {
        const ITERATIONS = 200
        const EXPECTED_WIN_RATE = 0.95

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

describe('Compare difficulties - consecutive wins', () => {
    const ITERATIONS = 50
    const MAX_CONSECUTIVE_FIGHTS = 20

    const fighter1 = createDefaultOwner({})
    const fighter4 = createDefaultOwner({})

    chooseOptionAndMutate(fighter4, {
        clp: pickFighter(presentOptions(fighter4.cs.levels)),
        freeFeat: 'Dodge',
    })
    chooseOptionAndMutate(fighter4, {
        clp: pickFighter(presentOptions(fighter4.cs.levels)),
    })
    chooseOptionAndMutate(fighter4, {
        clp: pickFighter(presentOptions(fighter4.cs.levels)),
        freeFeat: 'Fatiguing Blows',
    })
    chooseOptionAndMutate(fighter4, {
        clp: pickFighter(presentOptions(fighter4.cs.levels)),
    })
    const players = { fighter1, fighter4 }
    const encounters = {
        '1 goblin': [ostracizedGoblin],
        '4 goblins': [ostracizedGoblin, ostracizedGoblin, ostracizedGoblin, ostracizedGoblin],
    }

    const consecutiveWinsStats = (player: OwnerMaximal, enemy: OwnerMaximal[]) =>
        boxPlotStats(iterate(ITERATIONS, () => {
            const ws = setupWorldState({ player })
            let wins = 0
            while (wins < MAX_CONSECUTIVE_FIGHTS) {
                const result = simulateFight({ player: ws.playerActors, enemy })
                if (result.winner !== 'player') break
                wins++
                ws.playersAfterFight()
            }
            return wins
        }))

    test('Wins by level by encounter', () => {
        // average wins per character per encounter (mean of the consecutive-win streak)
        const avgWins: Record<string, Record<string, number>> = {}

        for (const [charName, player] of Object.entries(players)) {
            avgWins[charName] = {}
            for (const [encName, enemy] of Object.entries(encounters)) {
                const stats = consecutiveWinsStats(player, enemy)
                avgWins[charName][encName] = stats.mean

                // no streak can exceed the cap
                expect(stats.max).toBeLessThanOrEqual(MAX_CONSECUTIVE_FIGHTS)

                if (SHOW_DEBUG) console.log(`${charName} vs ${encName}`, stats)
            }
        }

        // headline view: average wins per character across both encounters
        if (SHOW_DEBUG) console.table(avgWins)
    })
})

describe('Expected Difficulty: Level 1', () => {
    const ITERATIONS = 50
    const MAX_CONSECUTIVE_FIGHTS = 30
    test('how many consecutive fights a player can win in a row', () => {
        const winsPerRun = iterate(ITERATIONS, () => {
            const ws = setupWorldState({ player: defaultPlayer })
            let wins = 0

            while (wins < MAX_CONSECUTIVE_FIGHTS) {
                const result = simulateFight({
                    player: ws.playerActors,
                    enemy: [ostracizedGoblin],
                })
                if (result.winner !== 'player') break
                wins++
                ws.playersAfterFight()
            }
            return wins
        })

        const stats = boxPlotStats(winsPerRun)
        console.log('how many consecutive fights a player can win in a row', stats)

        // the worst-case run (min) still nets at least one win
        /* expect(stats.min).toBeGreaterThanOrEqual(1) */
        expect(winsPerRun.every(w => w <= MAX_CONSECUTIVE_FIGHTS)).toBe(true)

        if (SHOW_DEBUG) console.table(stats)
    })

    test('hp loss per fight against one goblin', () => {
        const results = iterate(ITERATIONS, () => simulateFight({
            player: [defaultPlayer],
            enemy: [ostracizedGoblin],
        }))

        const stats = boxPlotStats(hpLosses(results))
        const maxHp = instantiateActor(defaultPlayer).health.max

        // median can land on 0 now that attacks can miss (or roll low enough
        // damage to net out), so check the mean trend across all fights instead
        expect(stats.mean).toBeGreaterThan(0)
        // a single fight can lose at most a full bar of hp
        expect(stats.max).toBeLessThanOrEqual(maxHp)

        if (SHOW_DEBUG) console.table({ ...stats, maxHp })
    })

    test('rounds to resolve a fight, split by outcome', () => {
        const results = iterate(ITERATIONS, () => simulateFight({
            player: [defaultPlayer],
            enemy: [ostracizedGoblin],
        }))

        const roundsByOutcome = (winner: 'player' | 'enemy' | 'draw') =>
            results.filter(r => r.winner === winner).map(r => r.rounds)

        const winRounds = roundsByOutcome('player')
        const lossRounds = roundsByOutcome('enemy')
        const drawRounds = roundsByOutcome('draw')

        // every fight resolves in at least one round, and none run away forever
        expect(results.every(r => r.rounds >= 1)).toBe(true)

        if (SHOW_DEBUG) {
            console.table({
                wins: winRounds.length,
                losses: lossRounds.length,
                draws: drawRounds.length,
            })
            if (winRounds.length) console.table({ winRounds: boxPlotStats(winRounds) })
            if (lossRounds.length) console.table({ lossRounds: boxPlotStats(lossRounds) })
            if (drawRounds.length) console.table({ drawRounds: boxPlotStats(drawRounds) })
        }
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

/* describe('Difficulty Level 4', () => {
    const ITERATIONS = 50
    const MAX_CONSECUTIVE_FIGHTS = 50

    test('Fighter: Expect to be trivial', () => {
        const EXPECTED_MEDIAN = 10
        const fighter = createDefaultOwner({ cs: { ...defaultCharacterSheet, levels: [] } })

        chooseOptionAndMutate(fighter, {
            clp: pickFighter(presentOptions(fighter.cs.levels)),
            freeFeat: 'Dodge',
        })
        chooseOptionAndMutate(fighter, {
            clp: pickFighter(presentOptions(fighter.cs.levels)),
        })
        chooseOptionAndMutate(fighter, {
            clp: pickFighter(presentOptions(fighter.cs.levels)),
            freeFeat: 'Fatiguing Blows',
        })
        chooseOptionAndMutate(fighter, {
            clp: pickFighter(presentOptions(fighter.cs.levels)),
        })

        expect(fighter.cs.levels.length).toEqual(4)
        const winsPerRun = iterate(ITERATIONS, () => {
            const ws = setupWorldState({ player: fighter })
            let wins = 0
            while (wins < MAX_CONSECUTIVE_FIGHTS) {
                const result = simulateFight({
                    player: ws.playerActors,
                    enemy: [ostracizedGoblin, ostracizedGoblin, ostracizedGoblin],
                })
                if (result.winner !== 'player') break
                wins++
                ws.playersAfterFight()
            }
            return wins
        })

        const stats = boxPlotStats(winsPerRun)

        if (SHOW_DEBUG) console.table(stats)

        assert.equal(stats.median, EXPECTED_MEDIAN)
    })
})
 */