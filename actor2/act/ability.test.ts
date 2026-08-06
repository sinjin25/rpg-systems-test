import { createDefaultOwner, instantiateActor } from '..'
import ignite from '../../ability-sheet2/abilities/ignite.ts'
import { generateAbilityModNodes, handleAbilityModNodes } from './ability.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Handles damage ModNode and StatusEffect', () => {
    test('integration: ignite test', () => {
        // run gamn, run hamn(actorA, actorB, gamn)
        const caster = createDefaultOwner()
        const receiver = createDefaultOwner()

        const gamn = generateAbilityModNodes(caster, ignite(caster))

        console.log(gamn)
        assert.equal(gamn.length, 2)

        const casterA = instantiateActor(caster)
        const receiverA = instantiateActor(receiver)

        assert.notExists(receiverA.owner.ss['ignite'])
        assert.equal(receiverA.health.max, receiverA.health.curr)
        handleAbilityModNodes(casterA, receiverA, gamn)

        assert(receiverA.health.curr <= receiverA.health.max)
        assert.exists(receiverA.owner.ss['ignite'])
    })
})