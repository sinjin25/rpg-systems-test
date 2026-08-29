import { findNodeMatching } from '..'
import { createDefaultOwner } from '../../actor2/index.ts'
import baseHealth from './base-health.ts'
import { describe, test, assert, expect } from 'vitest'

describe('base-health', () => {
    test('Returns a flat number', () => {
        const owner = createDefaultOwner()
        const node = baseHealth(owner)
        assert.equal(node.total(), 20)
        const f0 = findNodeMatching(node, /base-health$/, {
            includeRoot: true,
        })
        assert.exists(f0)
    })
})