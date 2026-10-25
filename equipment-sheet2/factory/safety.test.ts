import { describe, expect, test, assert } from 'vitest'
import { createDefaultOwner, OwnerMaximal } from '../../actor2'
import { findNodeMatching, leaf, ModNode } from '../../log2'
import ac from '../../log2/terminal/ac'
import attack from '../../log2/terminal/attack'
import maximumHealth from '../../log2/terminal/maximum-health'
import save from '../../log2/terminal/save'
import dc from '../../log2/terminal/dc'
import speed from '../../log2/terminal/speed'
import initiative from '../../log2/terminal/initiative'
import critThreatRange from '../../log2/terminal/crit-threat-range'
import moddedCsScore from '../../log2/composition/modded-cs-score'
import critMultiplier from '../../log2/composition/crit-multiplier'
import flatDamage from '../../log2/composition/flat-damage'
import damageTaken from '../../log2/terminal-composition/damage-taken'
import maxDexOfEquipment from '../../log2/composition/max-dex-of-equipment'
import { blueprintToBaseEquipment, MOD_KIND_TO_BROAD_CONTEXT_KEY } from './broad-context-adapter'
import { getModByRank, getModValueByPerfection } from './util'
import { weaponAffixLookupTable, weaponSuffixLookupTable } from './tables/weapon'
import { twohandAffixLookupTable, twohandSuffixLookupTable } from './tables/twohand'
import { armorAffixLookupTable, armorSuffixLookupTable } from './tables/armor'
import { ringAffixLookupTable, ringSuffixLookupTable } from './tables/ring'
import { amuletAffixLookupTable, amuletSuffixLookupTable } from './tables/amulet'
import { EquipmentBlueprint, LookupTableValue, ModKind } from './types'
import { EquipmentSheet, EquipmentSlot } from '../types'

type TestableModKind = Exclude<ModKind, 'roll-damage'>

// roll-damage has no flat broad-context key (see MOD_KIND_TO_BROAD_CONTEXT_KEY in
// broad-context-adapter.ts) — it's pending a future dice/rollTree mechanism, so it's
// excluded from blueprintToBaseEquipment entirely and has no terminal check here.
const runTerminalForKind = (kind: TestableModKind, owner: OwnerMaximal): ModNode => {
    switch (kind) {
        case 'ac': return ac(owner)
        case 'attack': return attack(owner)
        case 'health': return maximumHealth(owner)
        case 'fortitude': case 'will': case 'reflex': return save(kind)(owner)
        case 'str': case 'dex': case 'con': case 'int': return moddedCsScore(kind)(owner)
        case 'dc': return dc({ baseDc: 0 })(owner)
        case 'flat-damage': return flatDamage(owner)
        case 'crit-threat-range': return critThreatRange(owner)
        case 'crit-multiplier': return critMultiplier(owner)
        case 'speed': return speed(owner)
        case 'initiative': return initiative(owner)
        case 'dr': return damageTaken({ node: leaf('incoming', 0) })(owner)
        case 'max-dex': return maxDexOfEquipment(owner)!
    }
}

const buildMaximalBlueprint = (
    slot: EquipmentSlot,
    affixTable: Record<string, LookupTableValue[]>,
    suffixTable: Record<string, LookupTableValue[]>,
): EquipmentBlueprint => ({
    slot,
    affix: Object.keys(affixTable).map(kind => ({ kind: kind as ModKind, rank: 0, perfection: 0 })),
    suffix: Object.keys(suffixTable).map(kind => ({ kind: kind as ModKind, rank: 0, perfection: 0 })),
})

const expectedTotalFor = (
    slot: EquipmentSlot,
    kind: ModKind,
    affixTable: Record<string, LookupTableValue[]>,
    suffixTable: Record<string, LookupTableValue[]>,
): number => {
    const fromAffix = affixTable[kind] ? getModValueByPerfection(getModByRank(slot, 'affix', kind, 0)!, 0) : 0
    const fromSuffix = suffixTable[kind] ? getModValueByPerfection(getModByRank(slot, 'suffix', kind, 0)!, 0) : 0
    return fromAffix + fromSuffix
}

const runSlotSafetyCheck = (
    slot: EquipmentSlot,
    itemName: string,
    affixTable: Record<string, LookupTableValue[]>,
    suffixTable: Record<string, LookupTableValue[]>,
) => {
    const blueprint = buildMaximalBlueprint(slot, affixTable, suffixTable)
    const item = blueprintToBaseEquipment(blueprint, itemName)
    const owner = createDefaultOwner({ es: { [slot]: item } as Partial<EquipmentSheet> })

    const presentKinds = Array.from(new Set([...Object.keys(affixTable), ...Object.keys(suffixTable)]))
        .filter((kind): kind is TestableModKind => kind !== 'roll-damage')

    for (const kind of presentKinds) {
        const result = runTerminalForKind(kind, owner)

        const broadContextKey = MOD_KIND_TO_BROAD_CONTEXT_KEY[kind]
        const modNode = findNodeMatching(result, new RegExp(`^${broadContextKey}$`))
        assert.exists(modNode, `expected a ${broadContextKey} node in the ${kind} terminal tree`)

        const expected = expectedTotalFor(slot, kind, affixTable, suffixTable)
        expect(modNode!.total()).toBe(expected)

        const itemNode = findNodeMatching(modNode!, new RegExp(`^${itemName}$`))
        assert.exists(itemNode, `expected ${itemName} to show up under ${broadContextKey} in the ${kind} terminal tree`)
    }
}

describe('equipment safety: mainhand (weapon)', () => {
    test('affix/suffix identity is locked', () => {
        expect(Object.keys(weaponAffixLookupTable)).toEqual(['flat-damage', 'roll-damage', 'ac', 'attack', 'crit-threat-range'])
        expect(Object.keys(weaponSuffixLookupTable)).toEqual(['crit-multiplier', 'con', 'str', 'dex', 'int', 'speed', 'initiative'])
    })

    test('every affix/suffix shows up in its terminal calculation', () => {
        runSlotSafetyCheck('mainhand', 'weapon safety item', weaponAffixLookupTable, weaponSuffixLookupTable)
    })
})

describe('equipment safety: twohanded', () => {
    test('affix/suffix identity is locked', () => {
        expect(Object.keys(twohandAffixLookupTable)).toEqual(['crit-multiplier', 'con', 'str', 'dex', 'int', 'speed', 'initiative'])
        expect(Object.keys(twohandSuffixLookupTable)).toEqual(['crit-multiplier', 'con', 'str', 'dex', 'int', 'speed', 'initiative'])
    })

    test('every affix/suffix shows up in its terminal calculation', () => {
        runSlotSafetyCheck('twohanded', 'twohanded safety item', twohandAffixLookupTable, twohandSuffixLookupTable)
    })
})

describe('equipment safety: armor', () => {
    test('affix/suffix identity is locked', () => {
        expect(Object.keys(armorAffixLookupTable)).toEqual(['ac', 'dr', 'health', 'initiative'])
        expect(Object.keys(armorSuffixLookupTable)).toEqual(['con', 'str', 'dex', 'int', 'fortitude', 'will', 'reflex', 'max-dex'])
    })

    test('every affix/suffix shows up in its terminal calculation', () => {
        runSlotSafetyCheck('armor', 'armor safety item', armorAffixLookupTable, armorSuffixLookupTable)
    })
})

describe('equipment safety: ring', () => {
    test('affix/suffix identity is locked', () => {
        expect(Object.keys(ringAffixLookupTable)).toEqual(['health', 'speed', 'initiative', 'crit-threat-range', 'crit-multiplier', 'con', 'str', 'dex', 'int', 'dc'])
        expect(Object.keys(ringSuffixLookupTable)).toEqual(['health', 'initiative', 'fortitude', 'will', 'reflex'])
    })

    test('every affix/suffix shows up in its terminal calculation', () => {
        runSlotSafetyCheck('ring', 'ring safety item', ringAffixLookupTable, ringSuffixLookupTable)
    })
})

describe('equipment safety: amulet', () => {
    test('affix/suffix identity is locked', () => {
        expect(Object.keys(amuletAffixLookupTable)).toEqual(['health', 'speed', 'initiative', 'crit-threat-range', 'crit-multiplier', 'con', 'str', 'dex', 'int', 'dc'])
        expect(Object.keys(amuletSuffixLookupTable)).toEqual(['health', 'initiative', 'fortitude', 'will', 'reflex'])
    })

    test('every affix/suffix shows up in its terminal calculation', () => {
        runSlotSafetyCheck('amulet', 'amulet safety item', amuletAffixLookupTable, amuletSuffixLookupTable)
    })
})

// offhand (shield) has no affix/suffix lookup tables yet (getModTblBySlot returns {} for it) —
// known gap, not covered here until those tables exist.
