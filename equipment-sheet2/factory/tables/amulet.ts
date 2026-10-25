import { AmuletAffixKind, AmuletSuffixKind, BaseItemLookupValue, LookupTableValue } from "../types";
import { tuplesToLookupTableValues } from "./lookup-table-tuples";

export const amuletBaseItemLookupTable = {
    plainCharm: {
        weight: 500,
        base: {
            displayName: 'plain charm',
            tags: []
        },
        implicit: [],
    },
    onyxAmulet: {
        weight: 100,
        base: {
            displayName: 'onyx charm',
            tags: []
        },
        implicit: [
            {
                kind: 'str',
                value: 1,
            },
            {
                kind: 'dex',
                value: 1,
            },
            {
                kind: 'con',
                value: 1,
            },
            {
                kind: 'int',
                value: 1,
            },
        ],
    },
    featherAmulet: {
        weight: 100,
        base: {
            displayName: 'feather charm',
            tags: []
        },
        implicit: [
            {
                kind: 'reflex',
                value: 2,
            }
        ],
    },
    stoneAmulet: {
        weight: 75,
        base: {
            displayName: 'stone charm',
            tags: []
        },
        implicit: [
            {
                kind: 'fortitude',
                value: 2,
            }
        ],
    },
    clarityAmulet: {
        weight: 75,
        base: {
            displayName: 'charm of clarity',
            tags: []
        },
        implicit: [
            {
                kind: 'will',
                value: 2,
            }
        ],
    },
    trackerAmulet: {
        weight: 75,
        base: {
            displayName: "tracker's charm",
            tags: []
        },
        implicit: [
            {
                kind: 'initiative',
                value: 4,
            },
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

export const amuletAffixLookupTable: Record<AmuletAffixKind, LookupTableValue[]> = {
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

export const amuletSuffixLookupTable: Record<AmuletSuffixKind, LookupTableValue[]> = {
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
