import { FinalStandardActionResult, outputFinalSar, outputRawSar } from '../../../actor2/act'
import { createDefaultOwner, instantiateActor } from '../../../actor2/index.ts'
import { BaseEquipment } from '../../../equipment-sheet2/types'
import newModNode, { leaf, sumFunc } from '../../../log2'
import modNodeToText from '../../../log2/format.ts'
import { clearSeed, setSeed } from '../../../roll/index.ts'
import snapshotActor from '../snapshot/actor.ts'
import { TimeTravelContext } from '../types'
import standardActionResultToTT from './standard-action-result-to-tt.ts'
import { describe, test, assert, afterEach } from 'vitest'

const ownerActorUtil = () => {
    const owner = createDefaultOwner()
    return {
        owner,
        actor: instantiateActor(owner)
    }
}
describe('standardActionResultToTT', () => {
    afterEach(() => {
        clearSeed()
    })
    test('freezes each present ModNode result and passes relevantSlot through', () => {
        setSeed(5) // attack hits
        const { actor, owner } = ownerActorUtil()
        const rawSar = outputRawSar(actor)

        // just attack self for simplicity
        const finalSar = outputFinalSar(rawSar, actor)

        const theAttack = finalSar[0].attackResult!

        /* console.log(finalSar) */
        const asLog = standardActionResultToTT({
            source: snapshotActor(0)(actor),
            to: [snapshotActor(0)(actor)], // technically didn't apply the damage but w/e
        }, {
            kind: 'standard-action-result',
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
