import featContribution from '../../log2/composition/feat-contribution.ts'
import { createDefaultOwner } from '../../actor2'
import { findNodeMatching } from '../../log2/index.ts'
import heavyArmorMastery from './heavy-armor-mastery.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Works with tags', () => {
    test('No contribution when heavy-armor tag is absent', () => {
        const owner = createDefaultOwner({ fs: { heavyArmorMastery } })
        const acFeatModTree = featContribution('ac-feat-mod')(owner)
        const found = findNodeMatching(acFeatModTree, /mastery/i)
        assert.notExists(found)
    })

    test('Found in ac-feat-mod when heavy-armor tag is present', () => {
        const owner = createDefaultOwner({ fs: { heavyArmorMastery } })
        const acFeatModTree = featContribution('ac-feat-mod')(owner, { tags: ['heavy-armor'] })
        const found = findNodeMatching(acFeatModTree, /mastery/i)
        assert.exists(found)
        expect(found.total()).toEqual(1)
    })
})
