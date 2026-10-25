import { BaseItemLookupValue, LookupTableValue, WeaponAffix, WeaponSuffix } from "../types";
import { tuplesToLookupTableValues } from "./lookup-table-tuples";

export const weaponBaseItemLookupTable: Record<string, BaseItemLookupValue> = {
    dagger: { // simple finesse/crit
        weight: 100,
        base: {
            displayName: 'dagger',
            tags: ['melee', 'finesse']
        },
        implicit: [{
            kind: 'crit-threat-range', value: 20 - 1
        },
        {
            kind: 'crit-multiplier', value: 2
        }],
        damageDiceSides: 4 + 0
    },
    mace: { // simple dmg/dmg
        weight: 100,
        base: {
            displayName: 'mace',
            tags: ['melee',]
        },
        implicit: [{
            kind: 'crit-threat-range', value: 20
        },
        {
            kind: 'crit-multiplier', value: 2
        }],
        damageDiceSides: 4 + 2 + 2
    },
    shortsword: { // martial dmg/threat/finesse
        weight: 100,
        base: {
            displayName: 'shortsword',
            tags: ['melee', 'finesse', 'martial']
        },
        implicit: [
            {
                kind: 'crit-threat-range',
                value: 20 - 1
            },
            {
                kind: 'crit-multiplier',
                value: 2
            }
        ],
        damageDiceSides: 4 + 2
    },
    longsword: { // martial dmg/dmg/threat
        weight: 100,
        base: {
            displayName: 'longsword',
            tags: ['melee', 'martial']
        },
        implicit: [
            {
                kind: 'crit-threat-range',
                value: 20 - 1
            },
            {
                kind: 'crit-multiplier',
                value: 2
            }
        ],
        damageDiceSides: 4 + 2 + 2
    },
    rapier: { // martial dmg/threat/threat/finesse
        weight: 100,
        base: {
            displayName: 'rapier',
            tags: ['melee', 'finesse', 'martial']
        },
        implicit: [{
            kind: 'crit-threat-range',
            value: 20 - 1 - 1
        },
        {
            kind: 'crit-multiplier',
            value: 2
        }],
        damageDiceSides: 4 + 2
    },
    warhammer: { // martial dmg/dmg/mult
        weight: 100,
        base: {
            displayName: 'warhammer',
            tags: ['melee', 'martial']
        },
        implicit: [{
            kind: 'crit-multiplier',
            value: 2 + 1
        }],
        damageDiceSides: 4 + 2 + 2
    },
    duelingSword: { // exotic dmg/dmg/threat/finesse
        weight: 100,
        base: {
            displayName: 'dueling sword',
            tags: ['melee', 'exotic', 'finesse'],
        },
        implicit: [
            {
                kind: 'crit-multiplier',
                value: 2,
            },
            {
                kind: 'crit-threat-range',
                value: 20 - 1,
            }
        ],
        damageDiceSides: 4 + 2 + 2
    },
    bastardSword: { // exotic dmg/dmg/dmg/threat
        weight: 100,
        base: {
            displayName: 'bastard sword',
            tags: ['melee', 'exotic'],
        },
        implicit: [
            {
                kind: 'crit-multiplier',
                value: 2,
            },
            {
                kind: 'crit-threat-range',
                value: 20 - 1,
            }
        ],
        damageDiceSides: 4 + 2 + 2 + 2
    }
}

const STAT_RANGES = tuplesToLookupTableValues(
    [[4, 2, 1],
    [2, 1, 2],
    [1, 1, 3],]
)

export const weaponAffixLookupTable: Record<WeaponAffix['kind'], LookupTableValue[]> = {
    'flat-damage': tuplesToLookupTableValues([
        [5, 3, 1],
        [3, 1, 3],
        [2, 1, 5],
    ]),
    "roll-damage": tuplesToLookupTableValues([
        [10, 4, 1],
        [8, 4, 1],
        [5, 2, 2],
        [3, 2, 4],
    ]),
    ac: tuplesToLookupTableValues([
        [4, 2, 1],
        [3, 1, 2],
        [2, 1, 3],
    ]),
    attack: tuplesToLookupTableValues([
        [5, 3, 1],
        [4, 2, 2],
        [3, 1, 3],
        [2, 1, 5],
    ]),
    'crit-threat-range': tuplesToLookupTableValues([
        [3, 2, .5],
        [2, 1, 1],
        [1, 1, 2],
    ]),
}

export const weaponSuffixLookupTable: Record<WeaponSuffix['kind'], LookupTableValue[]> = {
    'crit-multiplier': tuplesToLookupTableValues([
        [3, 1, .5],
        [2, 1, .5],
    ]),
    con: structuredClone(STAT_RANGES),
    str: structuredClone(STAT_RANGES),
    dex: structuredClone(STAT_RANGES),
    int: structuredClone(STAT_RANGES),
    speed: tuplesToLookupTableValues([
        // base speed is 2d6
        [9, 3, .5],
        [6, 2, 1],
        [3, 1, 2],
    ]),
    initiative: tuplesToLookupTableValues([
        // base is 1d20
        [10, 3, 1],
        [6, 2, 2],
    ]),
}
