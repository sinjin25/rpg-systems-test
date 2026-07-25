import { describe, test, expect } from 'vitest'
import attack from './attack'
import { createDefaultOwner } from '../../defaults'
import { daggerPlusOne, RingPlusOneFinesseAttack } from '../../../defaults/equipment'
import finesseWeaponFighting from '../feats/finesse-weapon-fighting'
import { StatusEffectMaximal } from '../types'
import { passesTags, weaponTags } from '../feats/gate'
import { ClassLevels, ClassLevelMember } from '../../../character-sheet/class-level/type'
import { findNodeMatching, leaf } from '../..'

const babMember: ClassLevelMember = { attackBonus: 1, fortitudeSave: 0, reflexSave: 0, feats: {} }
const clazz = (displayName: string, levels: number): ClassLevels => ({
    displayName, level: levels, data: Array.from({ length: levels }, () => babMember),
})

// +2 attack on a finesse weapon
const finesseBless: StatusEffectMaximal = {
    displayName: 'Finesse Bless',
    broadContexts: {
        'attack-status-mod': o => passesTags(weaponTags(o), ['finesse'], []) ? leaf('Finesse Bless', 2) : undefined,
    },
}

const finesseBuild = () => createDefaultOwner({
    cs: { dex: 18, str: 10, levels: { fighter: clazz('Fighter', 4) } },
    es: { mainhand: daggerPlusOne, ring: RingPlusOneFinesseAttack },
    fs: { finesseWeaponFighting },
    ss: { finesseBless },
})

describe('attack (terminal)', () => {
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
        const node = attack(createDefaultOwner({}))
        expect(node.total()).toBe(2)
        expect(findNodeMatching(node, /modded-str/i)).toBeTruthy()
    })
})
