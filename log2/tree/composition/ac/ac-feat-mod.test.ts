import { describe, test, expect } from 'vitest'
import acFeatMod from './ac-feat-mod'
import { createDefaultOwner } from '../../../defaults'
import { bandedMail, heavyShield, leatherArmor } from '../../../../../defaults/equipment'
import dodgy from '../../feats/dodgy'
import shieldMastery from '../../feats/shield-mastery'
import heavyArmorMastery from '../../feats/heavy-armor-mastery'

// LAYER: ac-feat-mod is native - it sums every feat on owner.fs that declares an 'ac-feat-mod'
// contribution. Dodgy is unconditional (+4); Shield/Heavy Armor Mastery gate on equipped gear tags.

describe('ac-feat-mod (native)', () => {
    test('dodgy contributes +4 unconditionally', () => {
        const node = acFeatMod(createDefaultOwner({ fs: { dodgy } }))
        expect(node.total()).toBe(4)
        expect(node.children.map(c => `${c.displayName} ${c.total()}`)).toEqual(['dodgy 4'])
    })

    test('shield mastery: +1 with a shield, 0 without', () => {
        const withShield = acFeatMod(createDefaultOwner({
            fs: { shieldMastery }, es: { offhand: heavyShield },
        }))
        expect(withShield.total()).toBe(1)

        const withoutShield = acFeatMod(createDefaultOwner({
            fs: { shieldMastery },
        }))
        expect(withoutShield.total()).toBe(0)
        expect(withoutShield.children).toEqual([]) // gated out -> no child
    })

    test('heavy armor mastery: +1 in heavy armor, 0 in light', () => {
        const inHeavy = acFeatMod(createDefaultOwner({
            fs: { heavyArmorMastery }, es: { armor: bandedMail },
        }))
        expect(inHeavy.total()).toBe(1)

        const inLight = acFeatMod(createDefaultOwner({
            fs: { heavyArmorMastery }, es: { armor: leatherArmor },
        }))
        expect(inLight.total()).toBe(0)
    })

    test('feats stack and no feats -> 0, no children', () => {
        const stacked = acFeatMod(createDefaultOwner({
            fs: { dodgy, shieldMastery },
            es: { offhand: heavyShield },
        }))
        expect(stacked.total()).toBe(5) // 4 + 1

        const none = acFeatMod(createDefaultOwner({}))
        expect(none.total()).toBe(0)
        expect(none.children).toEqual([])
    })
})
