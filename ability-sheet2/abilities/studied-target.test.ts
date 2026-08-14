import { generateAbilityModNodes, handleAbilityModNodes } from '../../actor2/act/ability.ts'
import { createDefaultOwner, instantiateActor } from '../../actor2/index.ts'
import modNodeToText from '../../log2/format.ts'
import { findNodeMatching } from '../../log2/index.ts'
import damageTaken from '../../log2/terminal-composition/damage-taken.ts'
import ac from '../../log2/terminal/ac.ts'
import damage from '../../log2/terminal/damage.ts'
import studiedTarget from './studied-target.ts'
import { describe, test, assert, expect } from 'vitest'

describe('studied-target ability', () => {
    test('applies', () => {
        const owner = createDefaultOwner()
        const receiver = createDefaultOwner()
        const gamn = generateAbilityModNodes(owner, receiver, studiedTarget)

        const receiverA = instantiateActor(receiver)
        const ownerA = instantiateActor(owner)
        assert.equal(gamn.length, 1)

        assert.notExists(receiverA.owner.ss['Studied Target'])
        handleAbilityModNodes(ownerA, receiverA, gamn)
        assert.exists(receiverA.owner.ss['Studied Target'])

        // make sure it applies
        const dmg = damage(owner)
        const dmgTaken = damageTaken({
            node: dmg,
        })(receiver)
        console.log(modNodeToText(dmgTaken))

        const f0 = findNodeMatching(dmgTaken, /studied target/i)
        assert.exists(f0)

        const acCalc = ac(receiver)
        console.log(acCalc, acCalc.displayName)
        console.log(modNodeToText(acCalc))
        const f1 = findNodeMatching(acCalc, /studied target/i)
        assert.exists(f1)

        assert.equal(f0.total(), 1)
        assert.equal(f1.total(), -1)
    })
})