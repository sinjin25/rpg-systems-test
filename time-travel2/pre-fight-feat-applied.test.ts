import { createDefaultOwner, instantiateActor } from '../actor2'
import { deriveFeatKey, rage } from '../feat2/registry'
import { handlePreFight } from '../simulate2/helpers.ts'
import { describe, test, assert, expect } from 'vitest'
import newTimeTravelLogReplayer from './replay/index.ts'

describe('pre-fight-feat-applied', () => {
    const o = createDefaultOwner({
        fs: {
            [deriveFeatKey(rage)]: rage
        }
    })

    test('Integration', () => {
        const a = instantiateActor(o)
        const replayer = newTimeTravelLogReplayer()
        handlePreFight([a], replayer)

        // the feat actually ran: Rage's status landed on the actor's own sheet
        assert.exists(a.owner.ss['Rage'])
        assert.equal(a.owner.ss['Rage'].length, 1)

        // and it's visible on the TT log too
        assert.equal(replayer.logs.length, 1)
        const log = replayer.logs[0]!
        assert.equal(log.kind, 'pre-fight-feat-applied')
        if (log.kind !== 'pre-fight-feat-applied') return
        assert.deepEqual(log.featsTriggered, ['Rage'])
        assert.exists(log.source.owner.ss['Rage'])
        assert.equal(log.source.owner.ss['Rage'].length, 1)
        assert.equal(log.source.owner.ss['Rage'][0]!.displayName, 'Rage')
    })
})