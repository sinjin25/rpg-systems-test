import { createDefaultOwner } from '../actor2/index.ts'
import newModNode, { leaf, ModNode } from '../log2/index.ts'
import { StatusEffect } from '../status-sheet2/index.ts'
import ignite from './abilities/ignite.ts'
import { getAbilityKey, createAbilityCategory, addAbility, createDefaultAbilitySheet, AbilityModNode, abilityModNodePayloadIsModNode, abilityModNodePayloadIsStatusEffect } from './index.ts'
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