import { createDefaultOwner } from '../actor2/index.ts'
import newModNode, { leaf, ModNode } from '../log2/index.ts'
import { StatusEffect } from '../status-sheet2/index.ts'
import ignite from './abilities/ignite.ts'
import { getAbilityKey, createAbilityCategory, addAbility, createDefaultAbilitySheet, AbilityModNode, abilityModNodePayloadIsModNode, abilityModNodePayloadIsStatusEffect, resetAbilityCategoryIndex, advanceAbilityCategoryIndex } from './index.ts'
import { describe, test, assert, expect } from 'vitest'

describe('AbilitySheet', () => {
    test('addAbility files the ability under its castType, keyed and prioritized', () => {
        const owner = createDefaultOwner()

        // this is a snapshot ability
        addAbility(owner, ignite)

        const key = getAbilityKey(ignite)

        const as = owner.as
        assert.deepEqual(as.standard.priority, [key])
        // other action-economy slots untouched
        assert.deepEqual(as.swift.priority, [])
        assert.deepEqual(as.free.priority, [])
    })
})

describe('abilityModNodePayloadIsX', () => {
    test('abilityModNodePayloadIsModNode', () => {
        const x: AbilityModNode = {
            payload: newModNode('test', [], () => 4) as ModNode,
            target: 'target'
        }

        const payload = x.payload
        if (abilityModNodePayloadIsModNode(payload)) {
            assert.equal(payload.total(), 4)
        } else throw Error('expected a modnode')
    })
    test('abilityModNodePayloadIsStatusEffect', () => {
        const x: AbilityModNode = {
            payload: {
                displayName: 'test',
                broadContexts: {},
            } as StatusEffect,
            target: 'self'
        }

        const payload = x.payload
        if (abilityModNodePayloadIsStatusEffect(payload)) {
            assert.exists(payload.broadContexts)
        } else throw Error('expected a StatusEffect')
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

        console.log(std.priority[std.index])
        assert.equal(std.priority[2], 'fake item')
        assert.equal(std.index, -1)
    })
})