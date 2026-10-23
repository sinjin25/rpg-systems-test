import { LookupTableValue, TwohandAffix, TwohandSuffix } from "../types";

const STD_WEIGHT = 100

export const twohandAffixLookupTable: Record<TwohandAffix['kind'], LookupTableValue[]> = {
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

export const twohandSuffixLookupTable: Record<TwohandSuffix['kind'], LookupTableValue[]> = {
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
