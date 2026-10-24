import { AmuletAffixKind, AmuletSuffixKind, LookupTableValue } from "../types";
import { tuplesToLookupTableValues } from "./lookup-table-tuples";

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
