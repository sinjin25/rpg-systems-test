import { createDefaultOwner, instantiateActor } from '..'
import studiedTarget from '../../ability-sheet2/abilities/studied-target'
import { addAbility } from '../../ability-sheet2/index.ts'
import { act } from './index.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Act picks abilities and defaults to standard attacks', () => {
    test('works', () => {
        const owner = createDefaultOwner({})
        addAbility(owner, studiedTarget)

        const ownerA = instantiateActor(owner)
        const actions = act(ownerA)
        console.log(actions)
    })
})