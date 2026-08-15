import { createDefaultOwner } from '../actor2/index.ts'
import ignite from './abilities2/ignite.ts'
import { getAbilityKey, addAbility, resetAbilityCategoryIndex, advanceAbilityCategoryIndex } from './index.ts'
import { describe, test, assert } from 'vitest'

describe('AbilitySheet', () => {
    test('addAbility files the ability under its castType, keyed and prioritized', () => {
        const owner = createDefaultOwner()

        addAbility(owner, ignite)

        const key = getAbilityKey(ignite)

        const as = owner.as
        assert.deepEqual(as.standard.priority, [key])
        // other action-economy slots untouched
        assert.deepEqual(as.swift.priority, [])
        assert.deepEqual(as.free.priority, [])
    })
})

describe('abilityCategoryIndex', () => {
    test('resetAbilityCategoryIndex', () => {
        // resets a catalog
        const owner = createDefaultOwner()
        const std = owner.as.standard
        std.index = 99
        assert.equal(std.index, 99)
        const swift = owner.as.swift
        swift.index = 98
        assert.equal(swift.index, 98)

        resetAbilityCategoryIndex(owner, 'standard')
        assert.equal(std.index, 0)
        // confirm it targeted the correct catalog
        assert.equal(swift.index, 98)
    })
    test('advanceAbilityCategoryIndex', () => {
        const owner = createDefaultOwner()
        addAbility(owner, ignite)

        const std = owner.as.standard
        assert.equal(std.index, 0)
        assert.equal(std.priority[0], 'ignite')

        // need two items to check behavior
        std.priority.push('ignite')
        assert.equal(std.priority.length, 2)

        advanceAbilityCategoryIndex(owner, 'standard')
        assert.equal(std.index, 1)

        // is now out of items
        advanceAbilityCategoryIndex(owner, 'standard')
        assert.equal(std.index, -1)

        // confirm behavior with non-existent items (priority item doesnt exist or priority item doesnt match a key in abilitysheet.items)
        std.index = 1
        std.priority.push('fake item')
        advanceAbilityCategoryIndex(owner, 'standard')

        assert.equal(std.priority[2], 'fake item')
        assert.equal(std.index, -1)

        // confirm that once index is -1 it doesn't advance anymore
        advanceAbilityCategoryIndex(owner, 'standard')
        assert.equal(std.index, -1)
    })
})
