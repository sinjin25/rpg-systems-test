// default equipment for testing purposes
import newModNode, { leaf, ModNode } from '../log2'
import { Tags } from '../log2/tags'
import { ObjectWithBroadContexts, OwnerMaximal } from '../log2/types'
import roll from '../roll'
import type { BaseEquipment, EquipmentSheet, EquipmentSlot } from './types'

// generic is to provide inference
const buildOutBaseArmor = <const T extends readonly (readonly [string, number, number])[]>(
    data: T
): Record<T[number][0], BaseEquipment> => {
    const record = {} as Record<T[number][0], BaseEquipment>

    data.forEach(([dn, ac, maxDex]) => {
        record[dn as T[number][0]] = {
            displayName: dn,
            broadContexts: {
                'ac-of-equipment': () => leaf(dn, ac),
                'max-dex-of-equipment': () => leaf(dn, maxDex)
            }
        }
    })

    return record
}

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

export const heavyShield: BaseEquipment = (() => {
    const dn = 'heavy shield'

    return {
        displayName: dn,
        broadContexts: {
            "ac-of-equipment": (o: OwnerMaximal) => leaf(
                dn,
                2,
            )
        },
        tags: ['shield', 'heavy-armor']
    }
})()

export const shortsword: BaseEquipment = (() => {
    const dn = 'shortsword'
    return {
        displayName: dn,
        broadContexts: {
            damage: (o: OwnerMaximal) => {
                const sides = 6
                return leaf(dn, roll(sides))
            }
        },
        tags: ['melee']
    }
})()

export const shortswordPlusOne: BaseEquipment = (() => {
    const dn = 'shortswordPlusOne'
    return {
        displayName: dn,
        broadContexts: {
            damage: (o: OwnerMaximal) => {
                const sides = 6
                return leaf(dn, roll(sides))
            },
            enhancement: (o: OwnerMaximal) => {
                return leaf(dn, 1)
            }
        },
        tags: ['melee']
    }
})()

export const shortswordPlusOneIfFighter: BaseEquipment = (() => {
    const dn = 'shortswordPlusOneIfFighter'
    return {
        displayName: dn,
        broadContexts: {
            damage: (o: OwnerMaximal) => {
                const sides = 6
                return leaf(dn, roll(sides))
            },
            enhancement: (o: OwnerMaximal) => {
                if (!!o.cs.levels.fighter) return leaf(dn, 1)
                return undefined
            }
        },
        tags: ['melee']
    }
})()

export const dagger: BaseEquipment = (() => {
    const dn = 'dagger'
    return {
        displayName: dn,
        broadContexts: {
            damage: (o: OwnerMaximal) => {
                const sides = 4
                return leaf(dn, roll(sides))
            },
        },
        tags: ['melee', 'finesse']
    }
})()