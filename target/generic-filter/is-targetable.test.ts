import { createDefaultOwner, instantiateActor } from '../../actor2'
import { addStatusToStatusSheet } from '../../status-sheet2'
import { default as isTargetable, demoUntargetable } from './is-targetable'
import { describe, test, assert, expect } from 'vitest'

describe('is-targetable', () => {
    test('', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)

        const isOkay = isTargetable(actor)
        assert.isTrue(isOkay)

        addStatusToStatusSheet(owner, demoUntargetable)

        const isNotOkay = isTargetable(actor)
        assert.isNotTrue(isNotOkay)
    })
})