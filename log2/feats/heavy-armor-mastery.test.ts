import { createDefaultOwner } from '../../actor2'
import { ac } from '../terminal'
import heavyArmorMastery from './heavy-armor-mastery.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Works with tags', () => {
    test('Works', () => {
        const owner = createDefaultOwner({ fs: { heavyArmorMastery } })
        assert.equal(ac(owner).total(), 12) // base + 2, heavy-armor tag absent so feat doesn't fire

        assert.equal(ac(owner, {
            tags: ['heavy-armor']
        }).total(), 13) // +1 from heavy-armor-mastery via opts.tags
    })
})