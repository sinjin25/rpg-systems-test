// default equipment for testing purposes
import newModNode, { leaf, ModNode, sumFunc } from '../log2'
import { Tags } from '../log2/tags'
import { ModNodeOpts, ObjectWithBroadContexts, OwnerLog2 } from '../log2/types'
import rollTree from '../log2/roll'
import type { BaseEquipment, EquipmentSheet, EquipmentSlot } from './types'
import { classLevelCounts } from '../class-level2/derive'
import { blueprintToBaseEquipment } from './factory/broad-context-adapter'
import { weaponBaseItemLookupTable } from './factory/tables/weapon'
import { armorBaseItemLookupTable } from './factory/tables/armor'

export const SLOT_TYPE: Record<string, BaseEquipment['acceptableSlots']> = {
    weapon: ['mainhand', 'offhand'],
    shield: ['offhand'],
    armor: ['armor'],
    amulet: ['amulet'],
    ring: ['ring'],
}

// built from weaponBaseItemLookupTable via the factory pipeline instead of a hand-written
// closure — acceptableSlots is widened back to SLOT_TYPE.weapon since the factory's blueprint
// slot only governs which affix/suffix roll tables apply, not final equip eligibility
const buildWeapon = (name: keyof typeof weaponBaseItemLookupTable): BaseEquipment => ({
    ...blueprintToBaseEquipment(
        { slot: 'mainhand', base: { name, ...weaponBaseItemLookupTable[name] }, affix: [], suffix: [] },
        name,
    ),
    acceptableSlots: SLOT_TYPE.weapon,
})

const buildArmor = (name: keyof typeof armorBaseItemLookupTable): BaseEquipment => ({
    ...blueprintToBaseEquipment(
        { slot: 'armor', base: { name, ...armorBaseItemLookupTable[name] }, affix: [], suffix: [] },
        name,
    ),
    acceptableSlots: SLOT_TYPE.armor,
})

export const armors: Record<keyof typeof armorBaseItemLookupTable, BaseEquipment> = {
    clothing: buildArmor('clothing'),
    'padded armor': buildArmor('padded armor'),
    leather: buildArmor('leather'),
    'chain shirt': buildArmor('chain shirt'),
    'scale mail': buildArmor('scale mail'),
    breastplate: buildArmor('breastplate'),
    'splint mail': buildArmor('splint mail'),
    'banded mail': buildArmor('banded mail'),
    plate: buildArmor('plate'),
}

export const buckler: BaseEquipment = (() => {
    const dn = 'buckler'
    return {
        displayName: dn,
        acceptableSlots: SLOT_TYPE.shield,
        broadContexts: {
            "ac-of-equipment": (o: OwnerLog2) => leaf(
                dn,
                1,
            )
        },
        tags: ['shield']
    }
})()

export const heavyShield: BaseEquipment = (() => {
    const dn = 'heavy shield'

    return {
        displayName: dn,
        acceptableSlots: SLOT_TYPE.shield,
        broadContexts: {
            "ac-of-equipment": (o: OwnerLog2) => leaf(
                dn,
                2,
            )
        },
        tags: ['shield', 'heavy-armor']
    }
})()

export const shortsword: BaseEquipment = buildWeapon('shortsword')

export const shortswordPlusOne: BaseEquipment = buildWeapon('shortsword')
{
    shortswordPlusOne.displayName = 'shortsword-plus-one'
    shortswordPlusOne.broadContexts.enhancement = (o: OwnerLog2) => {
        return leaf('shortsword-plus-one', 1)
    }
}

export const shortswordPlusOneIfFighter: BaseEquipment = buildWeapon('shortsword')
{
    shortswordPlusOneIfFighter.displayName = 'shortsword-plus-one-if-fighter'
    shortswordPlusOneIfFighter.broadContexts.enhancement = (o: OwnerLog2) => {
        const fLevelCnt = classLevelCounts(o.cs.levels).fighter
        if (fLevelCnt === undefined) return leaf('shortswordPlusOneIfFighter', 0)
        return leaf('shortswordPlusOneIfFighter', fLevelCnt)
    }
}

export const longsword: BaseEquipment = buildWeapon('longsword')

export const dagger: BaseEquipment = buildWeapon('dagger')

export const rapier: BaseEquipment = buildWeapon('rapier')

export const bastardSword: BaseEquipment = buildWeapon('bastardSword')

// a lot of the tests used a shortsword which didn't have martial properties
// this makes testing a pain in the ass since you have to include martial prof in everything
export const testshortsword: BaseEquipment = buildWeapon('shortsword')
{
    const ind = testshortsword.tags?.findIndex(a => a === 'finesse')!
    testshortsword.tags?.splice(ind, 1)
    const ind2 = testshortsword.tags?.findIndex(a => a === 'martial')!
    testshortsword.tags?.splice(ind2, 1)
}