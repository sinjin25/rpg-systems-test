import { describe, test, expect, assert } from 'vitest'
import { hasAnyTag, hasAllTags } from './tags'
import { Feat2 } from '../feat2/types'
import { findNodeMatching, leaf } from '.'
import attack from './terminal/attack'
import { createDefaultOwner } from '../actor2'
import { BaseEquipment } from '../equipment-sheet2/types'

describe('hasAnyTag', () => {
    test('passes when a whitelist tag is present and no blacklist tag is', () => {
        expect(hasAnyTag(['melee', 'one-handed'], ['melee', 'ranged'], ['shield'])).toBe(true)
    })

    test('fails when a blacklist tag is present', () => {
        expect(hasAnyTag(['melee', 'shield'], ['melee', 'ranged'], ['shield'])).toBe(false)
    })
})

describe('hasAllTags', () => {
    test('passes when every whitelist tag is present', () => {
        expect(hasAllTags(['melee', 'finesse', 'one-handed'], ['melee', 'finesse'])).toBe(true)
    })

    test('fails when a whitelist tag is missing', () => {
        expect(hasAllTags(['melee', 'one-handed'], ['melee', 'finesse'])).toBe(false)
    })
})

describe('Integration: works with feats and broadContext', () => {
    const tagFeat: Feat2 = {
        displayName: 'test-feat',
        hidden: false,
        id: 'testFeat',
        broadContexts: {
            'attack-feat-mod': (o, opts) => hasAllTags(opts.tags ?? [], ['standard-attack']) ? leaf('test-feat', 1) : undefined
        }
    }
    test('Feat is found correctly', () => {
        const owner = createDefaultOwner({
            fs: {
                tagFeat
            },
        })
        /* console.log('owner', owner.cs.levels) */
        const node = attack(owner)
        const matchingNode = findNodeMatching(node, /test-feat/)
        assert.exists(matchingNode)
    })
})