import { createDefaultOwner, instantiateActor } from '../actor2/index.ts'
import postFight from './post-fight.ts'
import snapshotActor from './snapshot/actor.ts'
import { describe, test, assert } from 'vitest'

describe('post-fight', () => {
    test('passes the snapshot through unchanged', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)
        const source = snapshotActor(actor)

        const log = postFight({ source })

        assert.equal(log.kind, 'post-fight')
        assert.equal(log.source, source)
    })
})
