import { AmuletAffixKind, AmuletSuffixKind, LookupTableValue } from "../types";

const STD_WEIGHT = 100

export const amuletAffixLookupTable: Record<AmuletAffixKind, LookupTableValue[]> = {
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
    dc: [
        {
            max: 2,
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

export const amuletSuffixLookupTable: Record<AmuletSuffixKind, LookupTableValue[]> = {
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
