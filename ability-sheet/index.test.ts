import { describe, test, assert } from 'vitest'

import { addAbility, createDefaultAbilitySheet, getAbilityKey } from './index.ts'
import ignite from './abilities/ignite.ts'

describe('AbilitySheet', () => {
    test('addAbility files the ability under its castType, keyed and prioritized', () => {
        const as = createDefaultAbilitySheet()

        addAbility(as, ignite)

        const key = getAbilityKey(ignite)
        assert.equal(as.standard.items[key], ignite)
        assert.deepEqual(as.standard.priority, [key])
        // other action-economy slots untouched
        assert.deepEqual(as.swift.priority, [])
        assert.deepEqual(as.free.priority, [])
    })

    test('createDefaultAbilitySheet returns independent sheets - no shared category state', () => {
        const a = createDefaultAbilitySheet()
        const b = createDefaultAbilitySheet()

        addAbility(a, ignite)

        assert.lengthOf(b.standard.priority, 0)
        assert.deepEqual(b.standard.items, {})
    })
})
