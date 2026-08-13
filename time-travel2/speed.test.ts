import { createDefaultOwner, instantiateActor } from "../actor2"
import { round } from "../actor2/round"
import { describe, test, expect } from 'vitest'
import speed from './speed'
import snapshotActor from './snapshot/actor'
import newTimeTravelLogReplayer from './replay/index'
import ttrvTextVisualizer from './replay/text-visualizer'
import { StoredLog } from './replay/types'

describe('Replayer recreates turn order', () => {
    test('speed logs reproduce the live per-round turn order (by id)', () => {
        const owner = createDefaultOwner()
        const a1 = instantiateActor(owner)
        const a2 = instantiateActor(owner)

        const replayer = newTimeTravelLogReplayer(ttrvTextVisualizer)

        // ground-truth turn order per round, captured live from round()
        const matrix: number[][] = []
        for (let i = 0; i < 200; i++) {
            const acting = round({ participants: [a1, a2], speedSum: 35 })
            matrix.push(acting.map(a => a.id))

            // log the step: freeze the acting actors so the replayer only ever
            // sees snapshots, then let the speed handler re-derive their order
            replayer.appendLog(speed({ actors: acting.map(a => snapshotActor(a.id)(a)) }))
        }

        // replay: drain the tape and rebuild turn order from each stored speed log
        const replayed: number[][] = []
        let step = replayer.replayStep()
        while (step !== null) {
            // every log here is a speed log; it carries no `kind` to narrow on
            replayed.push((step as StoredLog<'speed'>).actors.map(a => a.id))
            step = replayer.replayStep()
        }

        // same number of total steps
        expect(replayed.length).toBe(matrix.length)
        // each step has the same ids in the same order
        for (let i = 0; i < matrix.length; i++) {
            expect(replayed[i]).toEqual(matrix[i])
        }
    })
})
