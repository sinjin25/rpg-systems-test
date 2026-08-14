import { createDefaultOwner, instantiateActor } from '..'
import ignite from '../../ability-sheet2/abilities/ignite.ts'
import studiedTarget from '../../ability-sheet2/abilities/studied-target'
import { addAbility } from '../../ability-sheet2/index.ts'
import { act, actionIsAbility } from './index.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Act picks abilities and defaults to standard attacks', () => {
    test('a free ability is returned alongside the default standard attack', () => {
        const owner = createDefaultOwner({})
        addAbility(owner, studiedTarget)

        const ownerA = instantiateActor(owner)
        const actions = act(ownerA)

        // studiedTarget is a free cast; standard falls back to a raw attack
        const abilities = actions.filter(actionIsAbility)
        assert.equal(abilities.length, 1)
        assert.equal(abilities[0]!.displayName, studiedTarget.displayName)
    })
    test('a standard ability is returned as an Ability, not expanded mod nodes', () => {
        const owner = createDefaultOwner({})
        addAbility(owner, ignite)

        const actor1 = instantiateActor(owner)
        const actions = act(actor1)

        // act now returns the whole Ability; effects are resolved later against a target
        const abilities = actions.filter(actionIsAbility)
        assert.equal(abilities.length, 1)
        assert.equal(abilities[0]!.castType, 'standard')
    })
})