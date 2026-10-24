import { BaseItemLookupValue, LookupTableValue, WeaponAffix, WeaponSuffix } from "../types";
import { tuplesToLookupTableValues } from "./lookup-table-tuples";

export const weaponBaseItemLookupTable: Record<string, BaseItemLookupValue> = {
    dagger: { weight: 100, base: { displayName: 'dagger', tags: ['melee', 'finesse'] }, implicit: [{ kind: 'crit-threat-range', value: 19 }, { kind: 'crit-multiplier', value: 2 }], damageDiceSides: 4 },
    shortsword: { weight: 100, base: { displayName: 'shortsword', tags: ['melee'] }, implicit: [], damageDiceSides: 6 },
    longsword: { weight: 100, base: { displayName: 'longsword', tags: ['melee'] }, implicit: [{ kind: 'crit-threat-range', value: 19 }, { kind: 'crit-multiplier', value: 2 }], damageDiceSides: 8 },
    rapier: { weight: 100, base: { displayName: 'rapier', tags: ['melee', 'finesse'] }, implicit: [{ kind: 'crit-threat-range', value: 18 }, { kind: 'crit-multiplier', value: 2 }], damageDiceSides: 6 },
    warhammer: { weight: 100, base: { displayName: 'warhammer', tags: ['melee'] }, implicit: [{ kind: 'crit-multiplier', value: 3 }], damageDiceSides: 8 },
}

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
