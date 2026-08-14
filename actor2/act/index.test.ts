import { createDefaultOwner, instantiateActor } from '..'
import ignite from '../../ability-sheet2/abilities/ignite.ts'
import studiedTarget from '../../ability-sheet2/abilities/studied-target'
import { addAbility } from '../../ability-sheet2/index.ts'
import { act, actionIsAbilityModNode } from './index.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Act picks abilities and defaults to standard attacks', () => {
    test('works', () => {
        const owner = createDefaultOwner({})
        addAbility(owner, studiedTarget)

        const ownerA = instantiateActor(owner)
        const actions = act(ownerA)

        const a1 = actions[1]
        if (!actionIsAbilityModNode(a1)) throw Error('Should be doing studiedTarget .onUse')
    })
    test('confirm shape of standard ability', () => {
        const owner = createDefaultOwner({})
        addAbility(owner, ignite)

        const actor1 = instantiateActor(owner)
        const actor2 = instantiateActor(owner)
        const actions = act(actor1)

        const a0 = actions[0]
        if (!actionIsAbilityModNode(a0)) throw Error('Should be doing ignite onUse')

        const a1 = actions[1]
        if (!actionIsAbilityModNode(a1)) throw Error('Should be doing ignite onFailedSave')
        console.log(a1)
    })
})