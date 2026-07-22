import { describe, test, expect } from 'vitest'
import attack from './attack'
import { createDefaultOwner } from '../../defaults'
import { daggerPlusOne, RingPlusOneFinesseAttack } from '../../../../defaults/equipment'
import finesseWeaponFighting from '../feats/finesse-weapon-fighting'
import { StatusEffectMaximal } from '../types'
import { passesTags, weaponTags } from '../feats/gate'
import { ClassLevels, ClassLevelMember } from '../../../../character-sheet/class-level/type'
import { findNodeMatching, leaf } from '../..'

// LAYER: attack (terminal). Sums the five children; each has its own suite, so this proves the
// assembly and that a full build lands on the right number. See attack-readme.md for the bridges.

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

// a coherent finesse build so every child contributes:
//   effective stat (dex, dagger is finesse): dex 18 -> +4
//   base attack bonus: Fighter 4          -> +4
//   feat (Finesse Weapon Fighting, +1, native) -> +1
//   status (Finesse Bless, +2)            -> +2
//   equipment (+1 dagger enhancement, +1 finesse ring) -> +2
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

    test('the outline records which stat was used (dex here, via the finesse dagger)', () => {
        const node = attack(finesseBuild())
        expect(findNodeMatching(node, /modded-dex/i)).toBeTruthy()
        expect(findNodeMatching(node, /modded-str/i)).toBeUndefined()
    })

    test('a plain default character still assembles (str, no gear bonuses)', () => {
        // default shortsword is melee/non-finesse -> str; default str 15 -> +2, everything else 0
        const node = attack(createDefaultOwner({}))
        expect(node.total()).toBe(2)
        expect(findNodeMatching(node, /modded-str/i)).toBeTruthy()
    })
})
