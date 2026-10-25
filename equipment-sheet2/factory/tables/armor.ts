import { ArmorAffixKind, ArmorSuffixKind, BaseItemLookupValue, LookupTableValue } from "../types";
import { tuplesToLookupTableValues } from "./lookup-table-tuples";

export const armorBaseItemLookupTable = {
    clothing: {
        weight: 100,
        base: { displayName: 'clothing' },
        implicit: [
            { kind: 'ac', value: 0 },
            { kind: 'max-dex', value: 10 }
        ],
    },
    'padded armor': {
        weight: 100,
        base: { displayName: 'padded armor' },
        implicit: [
            { kind: 'ac', value: 1 },
            { kind: 'max-dex', value: 8 }
        ],
    },
    leather: {
        weight: 100,
        base: { displayName: 'leather' },
        implicit: [
            { kind: 'ac', value: 2 },
            { kind: 'max-dex', value: 6 }
        ],
    },
    'chain shirt': {
        weight: 100,
        base: { displayName: 'chain shirt' },
        implicit: [
            { kind: 'ac', value: 4 },
            { kind: 'max-dex', value: 4 }
        ],
    },
    'scale mail': {
        weight: 100,
        base: { displayName: 'scale mail' },
        implicit: [
            { kind: 'ac', value: 5 },
            { kind: 'max-dex', value: 3 }
        ],
    },
    breastplate: {
        weight: 100,
        base: { displayName: 'breastplate' },
        implicit: [
            { kind: 'ac', value: 6 },
            { kind: 'max-dex', value: 3 }
        ],
    },
    'splint mail': {
        weight: 100,
        base: { displayName: 'splint mail' },
        implicit: [
            { kind: 'ac', value: 7 },
            { kind: 'max-dex', value: 0 }
        ],
    },
    'banded mail': {
        weight: 100,
        base: { displayName: 'banded mail' },
        implicit: [
            { kind: 'ac', value: 7 },
            { kind: 'max-dex', value: 1 }
        ],
    },
    plate: {
        weight: 100,
        base: { displayName: 'plate' },
        implicit: [
            { kind: 'ac', value: 8 },
            { kind: 'max-dex', value: 1 }
        ],
    },
} satisfies Record<string, BaseItemLookupValue>

const STAT_RANGES = tuplesToLookupTableValues(
    [[4, 2, 1],
    [2, 1, 2],
    [1, 1, 4],]
)
const SAVE_RANGES = tuplesToLookupTableValues([
    [3, 1, 1],
    [1, 1, 3],
])

export const armorAffixLookupTable: Record<ArmorAffixKind, LookupTableValue[]> = {
    ac: tuplesToLookupTableValues([
        [4, 2, 1],
        [2, 1, 2],
        [1, 1, 4],
    ]),
    // damage-taken mods are negative
    dr: tuplesToLookupTableValues([
        [-3, -1, 1],
        [-1, -1, 3],
    ]),
    health: tuplesToLookupTableValues([
        [20, 10, 1],
        [10, 5, 2],
        [5, 1, 4],
    ]),
    initiative: tuplesToLookupTableValues([
        [4, 2, 1],
        [2, 1, 3],
    ]),
}

export const armorSuffixLookupTable: Record<ArmorSuffixKind, LookupTableValue[]> = {
    con: structuredClone(STAT_RANGES),
    str: structuredClone(STAT_RANGES),
    dex: structuredClone(STAT_RANGES),
    int: structuredClone(STAT_RANGES),
    fortitude: structuredClone(SAVE_RANGES),
    will: structuredClone(SAVE_RANGES),
    reflex: structuredClone(SAVE_RANGES),
    'max-dex': tuplesToLookupTableValues([
        [3, 2, 1],
        [2, 1, 2],
        [1, 1, 3],
    ]),
}
