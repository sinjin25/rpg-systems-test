import { ArmorAffixKind, ArmorSuffixKind, LookupTableValue } from "../types";
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
}
