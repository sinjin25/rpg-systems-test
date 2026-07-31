import { describe, test, expect, assert } from 'vitest'
import attack from './attack'
import { ClassLevels, ClassLevelMember } from '../../character-sheet/class-level/type'
import { findNodeMatching, leaf } from '..'
import { BaseEquipment, ObjectWithBroadContexts, OwnerLog2 } from '../types'
import { hasAllTags, Tags } from '../tags'
import modNodeToText from '../format'
import { createDefaultOwner } from '../../actor2'
import { Feat2 } from '../../feat2'

const babMember: ClassLevelMember = { attackBonus: 1, fortitudeSave: 0, reflexSave: 0, feats: {} }
const cl = (displayName: string, levels: number): ClassLevels => ({
    displayName, level: levels, data: Array.from({ length: levels }, () => babMember),
})

// +2 attack on a finesse weapon
const finesseBless: ObjectWithBroadContexts = {
    displayName: 'Finesse Bless',
    broadContexts: {
        'attack-status-mod': o => hasAllTags(o.tags, ['finesse']) ? leaf('Finesse Bless', 2) : undefined,
    },
}

const daggerPlusOne: BaseEquipment = {
    displayName: 'dagger-plus-one',
    broadContexts: {
        'attack-from-equipment': () => leaf('dagger-plus-one', 1)
    },
    tags: ['finesse', 'melee'],
}

const ringPlusOneFinesseAttack: BaseEquipment = {
    displayName: 'ring-plus-one-finesse-attack',
    broadContexts: {
        'attack-from-equipment': (o: OwnerLog2) => hasAllTags(o.tags, ['finesse']) ? leaf('ring-plus-one-finesse-attack', 1) : undefined
    }
}

const finesseWeaponFighting: Feat2 = {
    displayName: 'finesse-weapon-fighting',
    broadContexts: {
        'attack-feat-mod': (o: OwnerLog2) => hasAllTags(o.tags, ['melee']) ? leaf('finesse-weapon-fighting', 1) : undefined
    }
}

const finesseBuild = () => {
    const owner = createDefaultOwner({
        cs: { dex: 18, str: 10, levels: { fighter: cl('Fighter', 4) } },
        es: { mainhand: daggerPlusOne, ring: ringPlusOneFinesseAttack },
        fs: { finesseWeaponFighting },
        ss: { finesseBless },
    })
    owner.relevantSlot = owner.es.mainhand
    return owner
}

describe('attack (terminal)', () => {
    const owner = createDefaultOwner({})
    owner.relevantSlot = owner.es.mainhand

    test('sums all five children of a full finesse build', () => {
        const node = attack(finesseBuild())
        expect(node.total()).toBe(13) // 4 + 4 + 1 + 2 + 2
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
        expect(node.total()).toBe(2)
        expect(findNodeMatching(node, /modded-str/i)).toBeTruthy()
    })
})

describe('Tags are added properly (mutated)', () => {
    test('Confirm tags exists', () => {
        const owner = finesseBuild()
        owner.relevantSlot = owner.es.mainhand

        assert.equal(owner.tags.length, 0)
        attack(owner) // mutates
        console.log(owner.tags)
        assert.equal(owner.tags.length, 3)
        expect(owner.tags).toEqual(expect.arrayContaining(['finesse', 'melee', 'standard-attack'] as Tags[]))
    })
})