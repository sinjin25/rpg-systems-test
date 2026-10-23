import { describe, expect, test, assert } from 'vitest'
import { _blueprintModToModNode, blueprintModToModNodeAndMerge, blueprintToBaseEquipment } from './broad-context-adapter'
import { EquipmentBlueprint } from './types'
import { createDefaultOwner } from '../../actor2'
import { findNodeMatching } from '../../log2'
import maximumHealth from '../../log2/terminal/maximum-health'
import modNodeToText from '../../log2/format'

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

describe('blueprintModToModNodeAndMerge', () => {
    test('merges the same kind across affix and suffix into one summed node', () => {
        // ring health rank 0 is {min: 10, max: 20} on both affix and suffix
        const merged = blueprintModToModNodeAndMerge('ring', {
            slot: 'ring',
            affix: [{ kind: 'health', rank: 0, perfection: 0 }], // -> 10
            suffix: [{ kind: 'health', rank: 0, perfection: 100 }], // -> 20
        })

        expect(merged.health?.children).toHaveLength(2)
        expect(merged.health?.total()).toBe(30)
    })

    test('leaves a kind that only appears once as a plain leaf', () => {
        // ring affix crit-threat-range rank 0 is {min: 1, max: 4} — perfection 0 lands on min
        const merged = blueprintModToModNodeAndMerge('ring', {
            slot: 'ring',
            affix: [{ kind: 'crit-threat-range', rank: 0, perfection: 0 }],
            suffix: [{ kind: 'health', rank: 0, perfection: 100 }],
        })

        expect(merged['crit-threat-range']?.children).toHaveLength(0)
        expect(merged['crit-threat-range']?.total()).toBe(1)
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
})
