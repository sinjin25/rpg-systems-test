import { leaf, ModNode } from "../../../log2";
import { LookupTableValue, WeaponAffix, WeaponSuffix } from "../types";

const STD_WEIGHT = 100

export const weaponAffixLookupTable: Record<WeaponAffix['kind'], LookupTableValue[]> = {
    "flat-damage": [
        {
            max: 5,
            min: 3,
            weight: STD_WEIGHT
        },
        {
            max: 3,
            min: 1,
            weight: STD_WEIGHT * 3,
        },
        {
            max: 2,
            min: 1,
            weight: STD_WEIGHT * 5,
        }
    ],
    "roll-damage": [
        {
            max: 12,
            min: 6,
            weight: STD_WEIGHT
        },
        {
            max: 10,
            min: 4,
            weight: STD_WEIGHT
        },
        {
            max: 8,
            min: 3,
            weight: STD_WEIGHT * 2,
        },
        {
            max: 5,
            min: 2,
            weight: STD_WEIGHT * 4,
        }
    ],
    ac: [
        {
            max: 4,
            min: 2,
            weight: STD_WEIGHT
        },
        {
            max: 3,
            min: 1,
            weight: STD_WEIGHT * 2
        },
        {
            max: 2,
            min: 1,
            weight: STD_WEIGHT * 3,
        },
    ],
    attack: [
        {
            max: 6,
            min: 3,
            weight: STD_WEIGHT
        },
        {
            max: 4,
            min: 2,
            weight: STD_WEIGHT * 2
        },
        {
            max: 3,
            min: 1,
            weight: STD_WEIGHT * 3
        },
        {
            max: 2,
            min: 1,
            weight: STD_WEIGHT * 5
        },
    ],
    'crit-threat-range': [
        {
            max: 4,
            min: 1,
            weight: STD_WEIGHT * .5
        },
        {
            max: 3,
            min: 1,
            weight: STD_WEIGHT
        },
        {
            max: 2,
            min: 1,
            weight: STD_WEIGHT * 2
        },
    ],
}

export const weaponSuffixLookupTable: Record<WeaponSuffix['kind'], LookupTableValue[]> = {
    'crit-multiplier': [
        {
            max: 1,
            min: 1,
            weight: STD_WEIGHT * .5
        },
        {
            max: 1,
            min: 1,
            weight: STD_WEIGHT
        },
    ],
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
    speed: [
        {
            max: 10,
            min: 10,
            weight: STD_WEIGHT * .5
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