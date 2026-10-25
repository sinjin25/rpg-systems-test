// default equipment for testing purposes
import newModNode, { leaf, ModNode, sumFunc } from '../log2'
import { Tags } from '../log2/tags'
import { ModNodeOpts, ObjectWithBroadContexts, OwnerLog2 } from '../log2/types'
import rollTree from '../log2/roll'
import type { BaseEquipment, EquipmentSheet, EquipmentSlot } from './types'
import { classLevelCounts } from '../class-level2/derive'
import { blueprintToBaseEquipment } from './factory/broad-context-adapter'
import { weaponBaseItemLookupTable } from './factory/tables/weapon'

export const SLOT_TYPE: Record<string, BaseEquipment['acceptableSlots']> = {
    weapon: ['mainhand', 'offhand'],
    shield: ['offhand'],
    armor: ['armor'],
    amulet: ['amulet'],
    ring: ['ring'],
}

// generic is to provide inference
const buildOutBaseArmor = <const T extends readonly (readonly [string, number, number])[]>(
    data: T
): Record<T[number][0], BaseEquipment> => {
    const record = {} as Record<T[number][0], BaseEquipment>

    data.forEach(([dn, ac, maxDex]) => {
        record[dn as T[number][0]] = {
            acceptableSlots: SLOT_TYPE.armor,
            displayName: dn,
            broadContexts: {
                'ac-of-equipment': () => leaf(dn, ac),
                'max-dex-of-equipment': () => leaf(dn, maxDex)
            }
        }
    })

    return record
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

export const armors = buildOutBaseArmor([
    ['clothing', 0, 10],
    ['padded armor', 1, 8],
    ['leather', 2, 6],
    ['chain shirt', 4, 4],
    ['scale mail', 5, 3],
    ['breastplate', 6, 3],
    ['splint mail', 7, 0],
    ['banded mail', 7, 1],
    ['plate', 8, 1],
])

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
