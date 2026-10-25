import { BaseItemLookupValue, LookupTableValue, ShieldAffixKind, ShieldSuffixKind } from "../types";
import { tuplesToLookupTableValues } from "./lookup-table-tuples";

export const offhandBaseItemLookupTable = {
    buckler: {
        weight: 100,
        base: {
            displayName: 'buckler',
            tags: ['shield']
        },
        implicit: [{ kind: 'ac', value: 1 }],
    },
    // also this dilutes the pool making having shield proficiency useful even for non-heavy armor
    // implement shield bash later based on weight
    lightShield: {
        weight: 100,
        base: {
            displayName: 'light shield',
            tags: ['shield', 'heavy-armor']
        },
        implicit: [{ kind: 'ac', value: 1 }],
    },
    heavyShield: {
        weight: 100,
        base: {
            displayName: 'heavy shield',
            tags: ['shield', 'heavy-armor']
        },
        implicit: [{ kind: 'ac', value: 2 }],
    },
    towerShield: {
        weight: 100,
        base: {
            displayName: 'tower shield',
            tags: ['shield', 'heavy-armor', 'tower-shield']
        },
        implicit: [{ kind: 'ac', value: 4 },
        { kind: 'max-dex', value: -2 },
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
const MAX_DEX_RANGES = tuplesToLookupTableValues([
    [3, 2, 1],
    [2, 1, 2],
    [1, 1, 3],
])

export const offhandAffixLookupTable: Record<ShieldAffixKind, LookupTableValue[]> = {
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

export const offhandSuffixLookupTable: Record<ShieldSuffixKind, LookupTableValue[]> = {
    con: structuredClone(STAT_RANGES),
    str: structuredClone(STAT_RANGES),
    dex: structuredClone(STAT_RANGES),
    int: structuredClone(STAT_RANGES),
    fortitude: structuredClone(SAVE_RANGES),
    will: structuredClone(SAVE_RANGES),
    reflex: structuredClone(SAVE_RANGES),
    'max-dex': MAX_DEX_RANGES,
}
