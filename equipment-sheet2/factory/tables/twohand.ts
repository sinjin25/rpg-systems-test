import { BaseItemLookupValue, LookupTableValue, TwohandAffix, TwohandSuffix } from "../types";
import { tuplesToLookupTableValues } from "./lookup-table-tuples";

export const twohandBaseItemLookupTable: Record<string, BaseItemLookupValue> = {
    greatclub: { // simple dmg/dmg
        weight: 100,
        base: {
            displayName: 'great club',
            tags: ['melee']
        },
        implicit: [{
            kind: 'crit-threat-range', value: 20 - 1
        },
        {
            kind: 'crit-multiplier', value: 2
        }],
        damageDiceSides: 6 + 2 + 2
    },
    // this game doesn't have a concept of reach so increase something else
    longspear: { // simple dmg/mult
        weight: 100,
        base: {
            displayName: 'longspear',
            tags: ['melee']
        },
        implicit: [{
            kind: 'crit-threat-range', value: 20
        },
        {
            kind: 'crit-multiplier', value: 2 + 1
        }],
        damageDiceSides: 6 + 2
    },
    // this does 1d12 but it should do 2d6
    // but we have no dice concept yet
    greatsword: { // martial dmg/dmg/dmg/threat
        weight: 100,
        base: {
            displayName: 'greatsword',
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
        damageDiceSides: 6 + 2 + 2 + 2
    },
    greataxe: { // martial dmg/dmg/dmg/mult
        weight: 100,
        base: {
            displayName: 'great axe',
            tags: ['melee', 'martial']
        },
        implicit: [
            {
                kind: 'crit-threat-range',
                value: 20
            },
            {
                kind: 'crit-multiplier',
                value: 2 + 1
            }
        ],
        damageDiceSides: 6 + 2 + 2 + 2
    },
    // this should deal 2d4 but we have no dice number concept
    scythe: { // martial dmg/mult/mult
        weight: 100,
        base: {
            displayName: 'scythe',
            tags: ['melee', 'martial']
        },
        implicit: [
            {
                kind: 'crit-threat-range',
                value: 20
            },
            {
                kind: 'crit-multiplier',
                value: 2 + 1 + 1
            }
        ],
        damageDiceSides: 6 + 2
    },
    // should have reach
    // has 1 extra threat until then
    fauchard: { // exotic dmg/dmg/threat/threat temp threat
        weight: 100,
        base: {
            displayName: 'fauchard',
            tags: ['melee', 'exotic']
        },
        implicit: [
            {
                kind: 'crit-threat-range',
                value: 20 - 1 - 1 - 1
            },
            {
                kind: 'crit-multiplier',
                value: 2
            }
        ],
        damageDiceSides: 6 + 2 + 2
    },
    curvedBlade: { // finesse exotic dmg/dmg/threat/threat
        weight: 100,
        base: {
            displayName: 'curved blade',
            tags: ['melee', 'exotic', 'finesse']
        },
        implicit: [
            {
                kind: 'crit-threat-range',
                value: 20 - 1 - 1
            },
            {
                kind: 'crit-multiplier',
                value: 2
            }
        ],
        damageDiceSides: 6 + 2 + 2
    },
}

const STAT_RANGES = tuplesToLookupTableValues(
    [[4, 2, 1],
    [2, 1, 2],
    [1, 1, 4],]
)

export const twohandAffixLookupTable: Record<TwohandAffix['kind'], LookupTableValue[]> = {
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

export const twohandSuffixLookupTable: Record<TwohandSuffix['kind'], LookupTableValue[]> = {
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
