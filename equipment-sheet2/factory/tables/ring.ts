import flatHealth from "../../../log2/composition/flat-health";
import { RingAffixKind, RingSuffixKind, LookupTableValue, BaseItemLookupValue } from "../types";
import { tuplesToLookupTableValues } from "./lookup-table-tuples";

export const ringBaseItemLookupTable = {
    plainRing: {
        weight: 500,
        base: {
            displayName: 'plain ring',
            tags: []
        },
        implicit: [],
    },
    luckyRing: {
        weight: 100,
        base: {
            displayName: 'lucky ring',
            tags: []
        },
        implicit: [
            {
                kind: 'fortitude',
                value: 1,
            },
            {
                kind: 'reflex',
                value: 1,
            },
            {
                kind: 'will',
                value: 1,
            },
        ],
    },
    coralRing: {
        weight: 100,
        base: {
            displayName: 'coral ring',
            tags: []
        },
        implicit: [
            {
                kind: 'health',
                value: 10,
            }
        ],
    },
    ironRing: {
        weight: 100,
        base: {
            displayName: 'iron ring',
            tags: []
        },
        implicit: [
            {
                kind: 'flat-damage',
                value: 1,
            }
        ],
    },
    steelRing: {
        weight: 100,
        base: {
            displayName: 'steel ring',
            tags: []
        },
        implicit: [
            {
                kind: 'dr',
                value: 1,
            }
        ],
    },
    vermillionRing: {
        weight: 50,
        base: {
            displayName: 'vermillion ring',
            tags: []
        },
        implicit: [
            {
                kind: 'health',
                value: 30,
            },
            {
                kind: 'fortitude',
                value: 1,
            },
            {
                kind: 'reflex',
                value: 1,
            },
            {
                kind: 'will',
                value: 1,
            },
        ],
    },
    bladeRing: {
        weight: 50,
        base: {
            displayName: 'blade ring',
            tags: []
        },
        implicit: [
            {
                kind: 'health',
                value: -20,
            },
            {
                kind: 'dr',
                value: 2,
            },
            {
                kind: 'flat-damage',
                value: 2,
            }
        ],
    }
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

export const ringAffixLookupTable: Record<RingAffixKind, LookupTableValue[]> = {
    health: tuplesToLookupTableValues([
        [20, 10, 1],
        [10, 5, 2],
        [5, 1, 4],
    ]),
    speed: tuplesToLookupTableValues([
        [10, 10, .5],
    ]),
    initiative: tuplesToLookupTableValues([
        [4, 2, 1],
        [2, 1, 3],
    ]),
    'crit-threat-range': tuplesToLookupTableValues([
        [4, 1, .5],
        [3, 1, 1],
        [2, 1, 2],
    ]),
    'crit-multiplier': tuplesToLookupTableValues([
        [1, 1, .5],
        [1, 1, 1],
    ]),
    con: structuredClone(STAT_RANGES),
    str: structuredClone(STAT_RANGES),
    dex: structuredClone(STAT_RANGES),
    int: structuredClone(STAT_RANGES),
    dc: tuplesToLookupTableValues([
        [2, 1, 1],
        [1, 1, 3],
    ]),
}

export const ringSuffixLookupTable: Record<RingSuffixKind, LookupTableValue[]> = {
    health: tuplesToLookupTableValues([
        [20, 10, 1],
        [10, 5, 2],
        [5, 1, 4],
    ]),
    initiative: tuplesToLookupTableValues([
        [4, 2, 1],
        [2, 1, 3],
    ]),
    fortitude: structuredClone(SAVE_RANGES),
    will: structuredClone(SAVE_RANGES),
    reflex: structuredClone(SAVE_RANGES),
}
