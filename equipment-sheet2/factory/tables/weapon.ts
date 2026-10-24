import { LookupTableValue, WeaponAffix, WeaponSuffix } from "../types";
import { tuplesToLookupTableValues } from "./lookup-table-tuples";

const STAT_RANGES = tuplesToLookupTableValues(
    [[4, 2, 1],
    [2, 1, 2],
    [1, 1, 4],]
)

export const weaponAffixLookupTable: Record<WeaponAffix['kind'], LookupTableValue[]> = {
    "flat-damage": tuplesToLookupTableValues([
        [5, 3, 1],
        [3, 1, 3],
        [2, 1, 5],
    ]),
    "roll-damage": tuplesToLookupTableValues([
        [12, 6, 1],
        [10, 4, 1],
        [8, 3, 2],
        [5, 2, 4],
    ]),
    ac: tuplesToLookupTableValues([
        [4, 2, 1],
        [3, 1, 2],
        [2, 1, 3],
    ]),
    attack: tuplesToLookupTableValues([
        [6, 3, 1],
        [4, 2, 2],
        [3, 1, 3],
        [2, 1, 5],
    ]),
    'crit-threat-range': tuplesToLookupTableValues([
        [4, 1, .5],
        [3, 1, 1],
        [2, 1, 2],
    ]),
}

export const weaponSuffixLookupTable: Record<WeaponSuffix['kind'], LookupTableValue[]> = {
    'crit-multiplier': tuplesToLookupTableValues([
        [1, 1, .5],
        [1, 1, 1],
    ]),
    con: structuredClone(STAT_RANGES),
    str: structuredClone(STAT_RANGES),
    dex: structuredClone(STAT_RANGES),
    int: structuredClone(STAT_RANGES),
    speed: tuplesToLookupTableValues([
        [10, 10, .5],
    ]),
    initiative: tuplesToLookupTableValues([
        [4, 2, 1],
        [2, 1, 3],
    ]),
}
