import { createDefaultOwner, instantiateActor } from '../actor2'
import { deriveFeatKey, rage } from '../feat2/registry'
import { handlePreFight } from '../simulate2/helpers.ts'
import { describe, test, assert, expect } from 'vitest'
import newTimeTravelLogReplayer from './replay/index.ts'
import { deserializeStatusEffect } from './serialize/status-effect.ts'
import { deserializeOwnerSnapshot } from './serialize/owner.ts'
import { deriveStatusKey, rageStatus } from '../status-sheet2/registry.ts'

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

        // confirm bfeat ran
        assert.exists(a.owner.ss[deriveStatusKey(rageStatus)])
        assert.equal(a.owner.ss[deriveStatusKey(rageStatus)].length, 1)

        // and it's visible on the TT log too
        assert.equal(replayer.logs.length, 1)
        const log = replayer.logs[0]!
        assert.equal(log.kind, 'pre-fight-feat-applied')
        if (log.kind !== 'pre-fight-feat-applied') return
        assert.deepEqual(log.featsTriggered, [deriveStatusKey(rageStatus)])
        assert.exists(log.source.owner.ss[deriveStatusKey(rageStatus)])
        assert.equal(log.source.owner.ss[deriveStatusKey(rageStatus)].length, 1)
        //either works
        assert.equal(
            deserializeStatusEffect(log.source.owner.ss[deriveStatusKey(rageStatus)][0]!.pointer).displayName,
            rage.displayName
        )
        assert.equal(
            deserializeOwnerSnapshot(log.source.owner).ss[deriveStatusKey(rageStatus)][0]!.pointer.displayName,
            rage.displayName
        )
    })
})