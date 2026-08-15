import { outputFinalSar, outputRawSar } from '../actor2/act'
import { createDefaultOwner, instantiateActor } from '../actor2/index.ts'
import modNodeToText from '../log2/format.ts'
import { clearSeed, setSeed } from '../roll/index.ts'
import snapshotActor from './snapshot/actor.ts'
import standardActionResult from './standard-action-result.ts'
import { describe, test, assert, afterEach } from 'vitest'

const ownerActorUtil = () => {
    const owner = createDefaultOwner()
    return {
        owner,
        actor: instantiateActor(owner)
    }
}
describe('standardActionResult (time-travel2)', () => {
    afterEach(() => {
        clearSeed()
    })
    test('freezes each present ModNode result and passes relevantSlot through', () => {
        setSeed(5) // attack hits
        const { actor } = ownerActorUtil()
        const rawSar = outputRawSar(actor)

        // just attack self for simplicity
        const finalSar = outputFinalSar(rawSar, actor)

        const theAttack = finalSar[0].attackResult!

        const asLog = standardActionResult({
            source: snapshotActor(actor),
            to: [snapshotActor(actor)], // technically didn't apply the damage but w/e
            ...finalSar[0],
        })
        assert.equal(
            modNodeToText(theAttack!),
            modNodeToText(asLog.modNodes.attackResult!)
        )
        assert.equal(
            theAttack.total(),
            asLog.modNodes.attackResult!.total
        )
    })
})
