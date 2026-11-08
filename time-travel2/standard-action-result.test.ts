import { outputFinalSar, outputRawSar } from '../actor2/act'
import { createDefaultOwner, instantiateActor } from '../actor2/index.ts'
import damageTakenTree from '../log2/terminal-composition/damage-taken.ts'
import { OwnerLog2 } from '../log2/types.ts'
import modNodeToText from '../log2/format.ts'
import { createRoll } from '../roll/index.ts'
import { RollInstance } from '../roll/types.ts'
import snapshotActor from './snapshot/actor.ts'
import standardActionResult from './standard-action-result.ts'
import { describe, test, assert } from 'vitest'

const ownerActorUtil = (rollInstance: RollInstance) => {
    const owner = createDefaultOwner()
    return {
        owner,
        actor: instantiateActor(owner, false, { rollInstance })
    }
}
describe('standardActionResult (time-travel2)', () => {
    test('freezes each present ModNode result and passes relevantSlot through', () => {
        const ri = createRoll(5) // attack hits
        const { actor } = ownerActorUtil(ri)
        const rawSar = outputRawSar(actor, { rollInstance: ri })

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

    test('freezes damageTakenResult when provided', () => {
        const ri = createRoll(5) // attack hits
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner, false, { rollInstance: ri })
        const rawSar = outputRawSar(actor, { rollInstance: ri })
        const finalSar = outputFinalSar(rawSar, actor)
        const fs = finalSar[0]

        const damageNode = fs.critDamageResult ?? fs.damageResult
        assert.exists(damageNode, 'seed 5 should produce damage')
        const dtNode = damageTakenTree({ node: damageNode! })(actor.owner as unknown as OwnerLog2, { rollInstance: ri })

        const asLog = standardActionResult({
            source: snapshotActor(actor),
            to: [snapshotActor(actor)],
            ...fs,
            damageTakenResult: dtNode,
        })

        assert.exists(asLog.modNodes.damageTakenResult)
        assert.equal(asLog.modNodes.damageTakenResult!.total, dtNode.total())
    })
})
