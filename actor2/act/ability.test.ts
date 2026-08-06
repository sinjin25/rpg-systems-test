import { createDefaultOwner, instantiateActor } from '..'
import ignite from '../../ability-sheet2/abilities/ignite.ts'
import { addAbility } from '../../ability-sheet2/index.ts'
import useAbility from '../../character/act/ability/index.ts'
import { generateAbilityModNodes, handleAbilityModNodes, selectAndPrepAbility } from './ability.ts'
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

describe('integration: selectAndPrepAbility', () => {
    test('When there are no abilities, returns undefined', () => {
        const owner = createDefaultOwner()
        const ownerA = instantiateActor(owner)

        const swift = selectAndPrepAbility(ownerA, 'swift')
        const standard = selectAndPrepAbility(ownerA, 'standard')
        const free = selectAndPrepAbility(ownerA, 'free')

        assert.isUndefined(swift)
        assert.isUndefined(standard)
        assert.isUndefined(free)
    })
    test('When you have an ability, returns the first ability', () => {
        const owner = createDefaultOwner()
        addAbility(owner, ignite)

        const ownerA = instantiateActor(owner)
        const standard = selectAndPrepAbility(ownerA, 'standard')
        assert.exists(standard)
        console.log(standard)

        const standard2 = selectAndPrepAbility(ownerA, 'standard')
        assert.notExists(standard2)
    })
})