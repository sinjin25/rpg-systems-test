import { describe, test, expect, assert } from 'vitest'
import attack from './attack'
import { findNodeMatching, leaf } from '..'
import { ModNodeOpts, OwnerLog2 } from '../types'
import { hasAllTags, Tags } from '../tags'
import modNodeToText from '../format'
import { createDefaultOwner, OwnerMaximal } from '../../actor2'
import { makeWrapper } from '../../status-sheet2'
import { inst } from '../../status-sheet2/testing'
import { Feat2 } from '../../feat2'
import { BaseEquipment } from '../../equipment-sheet2/types'
import { fakeCharacterLevels } from '../../character-sheet/util'

// +2 attack on a finesse weapon
const finesseBless = makeWrapper({
    displayName: 'Finesse Bless',
    broadContexts: {
        'attack-status-mod': (o, opts) => hasAllTags(opts.tags ?? [], ['finesse']) ? leaf('Finesse Bless', 2) : undefined,
    },
})

const daggerPlusOne: BaseEquipment = {
    displayName: 'dagger-plus-one',
    broadContexts: {
        'attack-equipment-mod': () => leaf('dagger-plus-one', 1)
    },
    tags: ['finesse', 'melee'],
}

const ringPlusOneFinesseAttack: BaseEquipment = {
    displayName: 'ring-plus-one-finesse-attack',
    broadContexts: {
        'attack-equipment-mod': (o: OwnerLog2, opts: ModNodeOpts) => hasAllTags(opts.tags ?? [], ['finesse']) ? leaf('ring-plus-one-finesse-attack', 1) : undefined
    }
}

const finesseWeaponFighting: Feat2 = {
    displayName: 'finesse-weapon-fighting',
    broadContexts: {
        'attack-feat-mod': (o: OwnerLog2, opts: ModNodeOpts) => hasAllTags(opts.tags ?? [], ['melee']) ? leaf('finesse-weapon-fighting', 1) : undefined
    }
}

const finesseBuild = () => {
    const owner = createDefaultOwner({
        cs: { dex: 18, str: 10, levels: fakeCharacterLevels(4) },
        es: { mainhand: daggerPlusOne, ring: ringPlusOneFinesseAttack },
        fs: { finesseWeaponFighting },
        ss: { finesseBless: [inst(finesseBless)] },
    })
    owner.relevantSlot = owner.es.mainhand
    return owner
}

describe('attack (terminal)', () => {
    const owner = createDefaultOwner({})
    owner.relevantSlot = owner.es.mainhand

    test('sums all five children of a full finesse build', () => {
        const node = attack(finesseBuild())
        expect(node.total()).toBe(13) // 4 + 4 + 1 + 2 + 2 + 1
        expect(node.children.length).toBe(5)

    })

    test('total is exactly the sum of its children (trusts them)', () => {
        const node = attack(finesseBuild())
        const childSum = node.children.reduce((acc, c) => acc + c.total(), 0)
        expect(node.total()).toBe(childSum)
    })

    test('a finesse weapon makes both stats candidates, and the better (dex) wins', () => {
        const node = attack(finesseBuild())
        expect(findNodeMatching(node, /modded-dex/i)).toBeTruthy()
        expect(findNodeMatching(node, /modded-str/i)).toBeTruthy()
        expect(findNodeMatching(node, /effective-attack-stat/i)?.total()).toBe(4)
    })

    test('a plain default character still assembles (str, no gear bonuses)', () => {
        const node = attack(owner)
        expect(node.total()).toBe(3) // + 2 str / + 1 bab
        expect(findNodeMatching(node, /modded-str/i)).toBeTruthy()
    })
})

describe('owner is not mutated', () => {
    test('owner.tags is unchanged after calling attack', () => {
        const owner = finesseBuild()
        owner.relevantSlot = owner.es.mainhand

        assert.equal(owner.tags.length, 0)
        attack(owner)
        assert.equal(owner.tags.length, 0, 'owner.tags must not be mutated by attack()')
    })
})
