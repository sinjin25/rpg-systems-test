import { createDefaultOwner, instantiateActor } from '../actor2'
import abilityCanTarget from './ability-filter-by'
import { GenericFilter } from './generic-filter/types'
import { describe, test, assert, expect } from 'vitest'

describe('ability-filter-by', () => {
    test('returns true when every rule passes', () => {
        const actor = instantiateActor(createDefaultOwner())
        const rules: GenericFilter[] = [() => true, () => true]
        assert.isTrue(abilityCanTarget(actor, rules))
    })

    test('returns false when any rule fails', () => {
        const actor = instantiateActor(createDefaultOwner())
        const rules: GenericFilter[] = [() => true, () => false]
        assert.isFalse(abilityCanTarget(actor, rules))
    })

    test('empty rule set defaults to true', () => {
        const actor = instantiateActor(createDefaultOwner())
        assert.isTrue(abilityCanTarget(actor, []))
    })
})
