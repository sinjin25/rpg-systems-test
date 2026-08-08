import { describe, test, expect, assert } from 'vitest'
import flatHealth from './flat-health'
import { createDefaultOwner } from '../../actor2'
import { BaseEquipment, ObjectWithBroadContexts } from '../types'
import { leaf, findNodeMatching } from '..'

const toughness: ObjectWithBroadContexts = {
    displayName: 'toughness',
    broadContexts: { 'health-feat-mod': () => leaf('toughness', 3) },
}

const healthRing: BaseEquipment = {
    displayName: 'ring plus ten health',
    broadContexts: { 'health-equipment-mod': () => leaf('ring plus ten health', 10) },
}

describe('flat-health', () => {
    test('is 0 with no flat sources', () => {
        expect(flatHealth(createDefaultOwner()).total()).toBe(0)
    })

    test('sums a flat feat mod', () => {
        const node = flatHealth(createDefaultOwner({ fs: { toughness } }))
        expect(node.total()).toBe(3)
        assert.exists(findNodeMatching(node, /toughness/i))
    })

    test('sums a flat equipment mod alongside the feat mod', () => {
        const node = flatHealth(createDefaultOwner({ fs: { toughness }, es: { ring: healthRing } }))
        expect(node.total()).toBe(13)
        assert.exists(findNodeMatching(node, /ring plus ten health/i))
    })
})
