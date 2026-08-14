import { createDefaultOwner, instantiateActor } from '../actor2'
import participantShouldBeTargeted from './participant-filter-by'
import { GenericFilter } from './generic-filter/types'
import { describe, test, assert, expect } from 'vitest'

describe('participant-filter-by', () => {
    test('returns true when every rule passes', () => {
        const actor = instantiateActor(createDefaultOwner())
        const rules: GenericFilter[] = [() => true, () => true]
        assert.isTrue(participantShouldBeTargeted(actor, rules))
    })

    test('returns false when any rule fails', () => {
        const actor = instantiateActor(createDefaultOwner())
        const rules: GenericFilter[] = [() => true, () => false]
        assert.isFalse(participantShouldBeTargeted(actor, rules))
    })

    test('empty rule set defaults to true', () => {
        const actor = instantiateActor(createDefaultOwner())
        assert.isTrue(participantShouldBeTargeted(actor, []))
    })
})
