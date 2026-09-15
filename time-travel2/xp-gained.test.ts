import { createDefaultOwner, instantiateActor } from '../actor2/index.ts'
import { leaf } from '../log2/index.ts'
import { mutateCurrentExperience } from '../experience/index.ts'
import xpGained from './xp-gained.ts'
import { describe, test, assert } from 'vitest'
import snapshotActor from './snapshot/actor.ts'

describe('xp-gained', () => {
    test('passes through amount and didLevel, drops currentXp', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)
        const amount = leaf('kill', 30)

        const { didLevel, currentXp } = mutateCurrentExperience(owner, amount)

        const record = xpGained({
            kind: 'xp-gained',
            source: snapshotActor(actor),
            amount,
            currentXp,
            didLevel,
        })

        assert.equal(record.amount, amount)
        assert.equal(record.didLevel, didLevel)
        assert.isFalse('currentXp' in record)
    })

    test('source snapshot reflects post-mutation xp', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)
        const amount = leaf('kill', 50)

        const { currentXp, didLevel } = mutateCurrentExperience(owner, amount)
        const snapshot = snapshotActor(actor)

        const record = xpGained({
            kind: 'xp-gained',
            source: snapshot,
            amount,
            currentXp,
            didLevel,
        })

        assert.equal(record.source.owner.experience.currentXp, 50)
    })
})
