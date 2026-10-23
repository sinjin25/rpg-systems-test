import { ArmorAffixKind, ArmorSuffixKind, LookupTableValue } from "../types";

const STD_WEIGHT = 100

export const armorAffixLookupTable: Record<ArmorAffixKind, LookupTableValue[]> = {
    ac: [
        {
            max: 4,
            min: 2,
            weight: STD_WEIGHT
        },
        {
            max: 2,
            min: 1,
            weight: STD_WEIGHT * 2
        },
        {
            max: 1,
            min: 1,
            weight: STD_WEIGHT * 4
        },
    ],
    // damage-taken mods are negative
    dr: [
        {
            max: -3,
            min: -1,
            weight: STD_WEIGHT
        },
        {
            max: -1,
            min: -1,
            weight: STD_WEIGHT * 3
        },
    ],
    health: [
        {
            max: 20,
            min: 10,
            weight: STD_WEIGHT
        },
        {
            max: 10,
            min: 5,
            weight: STD_WEIGHT * 2
        },
        {
            max: 5,
            min: 1,
            weight: STD_WEIGHT * 4
        },
    ],
    initiative: [
        {
            max: 4,
            min: 2,
            weight: STD_WEIGHT
        },
        {
            max: 2,
            min: 1,
            weight: STD_WEIGHT * 3
        },
    ],
}

export const armorSuffixLookupTable: Record<ArmorSuffixKind, LookupTableValue[]> = {
    str: [
        {
            max: 4,
            min: 2,
            weight: STD_WEIGHT
        },
        {
            max: 2,
            min: 1,
            weight: STD_WEIGHT * 2
        },
        {
            max: 1,
            min: 1,
            weight: STD_WEIGHT * 4
        },
    ],
    dex: [
        {
            max: 4,
            min: 2,
            weight: STD_WEIGHT
        },
        {
            max: 2,
            min: 1,
            weight: STD_WEIGHT * 2
        },
        {
            max: 1,
            min: 1,
            weight: STD_WEIGHT * 4
        },
    ],
    int: [
        {
            max: 4,
            min: 2,
            weight: STD_WEIGHT
        },
        {
            max: 2,
            min: 1,
            weight: STD_WEIGHT * 2
        },
        {
            max: 1,
            min: 1,
            weight: STD_WEIGHT * 4
        },
    ],
    fortitude: [
        {
            max: 3,
            min: 1,
            weight: STD_WEIGHT
        },
        {
            max: 1,
            min: 1,
            weight: STD_WEIGHT * 3
        },
    ],
    will: [
        {
            max: 3,
            min: 1,
            weight: STD_WEIGHT
        },
        {
            max: 1,
            min: 1,
            weight: STD_WEIGHT * 3
        },
    ],
    reflex: [
        {
            max: 3,
            min: 1,
            weight: STD_WEIGHT
        },
        {
            max: 1,
            min: 1,
            weight: STD_WEIGHT * 3
        },
    ],
}
