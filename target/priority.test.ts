import { createDefaultOwner, instantiateActor } from '../actor2'
import priority from './priority'
import { TargetPriority } from './types'
import { describe, test, assert, expect } from 'vitest'

describe('priority', () => {
    const a = instantiateActor(createDefaultOwner())
    const b = instantiateActor(createDefaultOwner())
    const valid = [a, b]
    const base: TargetPriority = { simple: 'first', team: 'enemy', filters: [] }

    test('"first" returns the first valid target', () => {
        assert.deepEqual(priority(valid, valid, valid, { ...base, simple: 'first' }), [a])
    })

    test('"last" returns the last valid target', () => {
        assert.deepEqual(priority(valid, valid, valid, { ...base, simple: 'last' }), [b])
    })

    test('"all" returns every valid target', () => {
        assert.deepEqual(priority(valid, valid, valid, { ...base, simple: 'all' }), [a, b])
    })

    test('override function takes precedence over simple', () => {
        const withOverride: TargetPriority = { ...base, override: () => [b] }
        assert.deepEqual(priority(valid, valid, valid, withOverride), [b])
    })
})
