import { describe, expect, test, assert } from 'vitest'
import { _blueprintModToModNode, blueprintToBaseEquipment } from './broad-context-adapter'
import { EquipmentBlueprint } from './types'
import { BaseEquipment } from '../types'
import { createDefaultOwner } from '../../actor2'
import { findNodeMatching } from '../../log2'
import maximumHealth from '../../log2/terminal/maximum-health'
import critThreatRange from '../../log2/terminal/crit-threat-range'
import critMultiplier from '../../log2/composition/crit-multiplier'
import modNodeToText from '../../log2/format'
import { RollInstance } from '../../roll/types'
import { weaponBaseItemLookupTable } from './tables/weapon'

// every die rolls its own max — deterministic without depending on a real seed's output
const maxRoll: RollInstance = {
    roll: (sides) => sides,
    spawn: () => maxRoll,
    _totalRolls: () => 0,
    getSeed: () => 0,
}

describe('_blueprintModToModNode', () => {
    test('resolves rank + perfection into a leaf named `${kind} T${rank}`', () => {
        // ring affix health rank 0 is {min: 10, max: 20} — perfection 0 lands on min
        const node = _blueprintModToModNode('ring', 'affix', { kind: 'health', rank: 0, perfection: 0 })

        expect(node?.displayName).toBe('health T0')
        expect(node?.total()).toBe(10)
    })

    test('returns undefined when the slot has no table for the mod', () => {
        const node = _blueprintModToModNode('offhand', 'affix', { kind: 'health', rank: 0, perfection: 0 })

        expect(node).toBeUndefined()
    })
})

describe('blueprint -> BaseEquipment -> terminal calculation (integration)', () => {
    test('health (affix+suffix) and crit-threat-range (affix only) stay separate, both named after the item', () => {
        // ring health rank 0 is {min: 10, max: 20}; ring crit-threat-range rank 0 is {min: 1, max: 4}
        const blueprint: EquipmentBlueprint = {
            slot: 'ring',
            affix: [
                { kind: 'health', rank: 0, perfection: 0 }, // -> 10
                { kind: 'crit-threat-range', rank: 0, perfection: 0 }, // -> 1
            ],
            suffix: [{ kind: 'health', rank: 0, perfection: 100 }], // -> 20
        }

        const ring = blueprintToBaseEquipment(blueprint, 'test ring')
        const owner = createDefaultOwner({ es: { ring } })

        const node = maximumHealth(owner)
        const ringNode = findNodeMatching(node, /^test ring$/)

        assert.exists(ringNode)
        expect(ringNode?.children).toHaveLength(2)
        expect(ringNode?.total()).toBe(30)

        expect(findNodeMatching(node, /threat/i)).toBeUndefined()
        const threatNode = ring.broadContexts['crit-threat-range-equipment-mod']?.(owner, {})
        assert.exists(threatNode)
        expect(threatNode?.displayName).toBe('test ring')
        expect(threatNode?.children).toHaveLength(1)
        expect(threatNode?.total()).toBe(1)

        console.log(modNodeToText(node))
        console.log(modNodeToText(threatNode))
    })

    test('a rolled rapier carries its crit stats through from its implicit entry', () => {
        const blueprint: EquipmentBlueprint = {
            slot: 'mainhand',
            base: { name: 'rapier', ...weaponBaseItemLookupTable.rapier },
            affix: [],
            suffix: [],
        }

        const weapon = blueprintToBaseEquipment(blueprint, 'test rapier')
        const owner = createDefaultOwner({ es: { mainhand: weapon } })

        expect(critThreatRange(owner).total()).toBe(18)
        expect(critMultiplier(owner).total()).toBe(2)
    })
})

describe('implicit crit-threat-range routing', () => {
    const syntheticBase: BaseEquipment = { displayName: 'test weapon', acceptableSlots: ['mainhand'], broadContexts: {} }

    // implicits should replace the base, not be a mod
    test('an implicit alone replaces the base', () => {
        const blueprint: EquipmentBlueprint = {
            slot: 'mainhand',
            base: {
                name: 'test weapon',
                base: syntheticBase,
                implicit: [{ kind: 'crit-threat-range', value: 18 }],
            },
            affix: [],
            suffix: [],
        }

        const weapon = blueprintToBaseEquipment(blueprint, 'test weapon')
        const owner = createDefaultOwner({ es: { mainhand: weapon } })

        expect(critThreatRange(owner).total()).toBe(18)
    })

    test('a crit-threat-range affix and a crit-threat-range implicit stay separate', () => {
        // mainhand affix crit-threat-range rank 0 is {min: 2, max: 3} — perfection 0 lands on min (2)
        const blueprint: EquipmentBlueprint = {
            slot: 'mainhand',
            base: {
                name: 'test weapon',
                base: syntheticBase,
                implicit: [{ kind: 'crit-threat-range', value: 18 }],
            },
            affix: [{ kind: 'crit-threat-range', rank: 0, perfection: 0 }], // -> 2
            suffix: [],
        }

        const weapon = blueprintToBaseEquipment(blueprint, 'test weapon')
        const owner = createDefaultOwner({ es: { mainhand: weapon } })

        const node = critThreatRange(owner)
        console.log(modNodeToText(node))

        // the implicit replaced the base (18, not summed with the engine default of 20)...
        const baseNode = findNodeMatching(node, /^test weapon$/)
        assert.exists(baseNode)
        expect(baseNode?.total()).toBe(18)

        // ...while the affix still stacks additively through -equipment-mod, on top of that
        const affixNode = findNodeMatching(node, /^crit-threat-range-equipment-mod$/)
        assert.exists(affixNode)
        expect(affixNode?.total()).toBe(2)

        expect(node.total()).toBe(20)
    })
})

describe('damageDiceSides -> generated damage broadContext', () => {
    test('builds the damage node from data, with no handler on the base item itself', () => {
        const synthetic: BaseEquipment = { displayName: 'test weapon', acceptableSlots: ['mainhand'], broadContexts: {} }
        const blueprint: EquipmentBlueprint = {
            slot: 'mainhand',
            base: { name: 'test weapon', base: synthetic, implicit: [], damageDiceSides: 8 },
            affix: [],
            suffix: [],
        }

        const weapon = blueprintToBaseEquipment(blueprint, 'test weapon')
        const owner = createDefaultOwner({ es: { mainhand: weapon } })

        const node = weapon.broadContexts.damage?.(owner, { rollInstance: maxRoll })
        assert.exists(node)
        expect(node?.total()).toBe(8) // 1d8, maxRoll always lands on the die's max
    })
})

describe('roll-damage: implicit and affix both contribute, each as its own live roll', () => {
    test('separates an implicit bonus die from an affix-rolled bonus die', () => {
        // mainhand affix roll-damage rank 1 is {min: 4, max: 10} — perfection 0 lands on min (4),
        // interpreted as a bonus d4
        const synthetic: BaseEquipment = { displayName: 'test weapon', acceptableSlots: ['mainhand'], broadContexts: {} }
        const blueprint: EquipmentBlueprint = {
            slot: 'mainhand',
            base: { name: 'test weapon', base: synthetic, implicit: [{ kind: 'roll-damage', value: 6 }] }, // bonus d6
            affix: [{ kind: 'roll-damage', rank: 1, perfection: 0 }], // -> bonus d4
            suffix: [],
        }

        const weapon = blueprintToBaseEquipment(blueprint, 'test weapon')
        const owner = createDefaultOwner({ es: { mainhand: weapon } })

        const node = weapon.broadContexts['roll-damage-equipment-mod']?.(owner, { rollInstance: maxRoll })
        assert.exists(node)

        const implicitNode = findNodeMatching(node!, /^roll-damage implicit$/)
        assert.exists(implicitNode)
        expect(implicitNode?.total()).toBe(6) // 1d6 at max

        const affixNode = findNodeMatching(node!, /^roll-damage T1$/)
        assert.exists(affixNode)
        expect(affixNode?.total()).toBe(4) // 1d4 at max

        expect(node?.total()).toBe(10)

        console.log(modNodeToText(node!))
    })
})
